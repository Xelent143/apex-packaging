import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createDatabasePool, closeDatabasePool, verifyEnquirySchema } from './db.mjs';
import { nextRetryAt, safeErrorDetails } from './deliveryPolicy.mjs';
import { createPostgresEnquiryStore } from './enquiryStore.mjs';
import { ProviderTimeoutError, sendEmailWithTimeout, sendQuoteEmail } from './quoteEmail.mjs';
import { sendSmtpEmail } from './smtpEmail.mjs';

export async function processNextDelivery(store, options) {
  await store.releaseExpiredLeases?.({ now: options.now?.() || new Date() });
  const job = await store.claimNextJob({
    workerId: options.workerId,
    leaseMs: options.leaseMs || 60_000,
    now: options.now?.() || new Date()
  });
  if (!job) return { processed: false };

  const startedAt = options.now?.() || new Date();
  let result;
  try {
    result = await options.deliver(job.email_payload, {
      idempotencyKey: job.idempotency_key,
      timeoutMs: options.providerTimeoutMs
    });
  } catch (error) {
    const details = safeErrorDetails(error);
    const finishedAt = options.now?.() || new Date();
    if (error instanceof ProviderTimeoutError || details.errorClass === 'provider_timeout_unknown') {
      await store.markUncertain({ jobId: job.id, ...details, startedAt, finishedAt });
      return { processed: true, outcome: 'uncertain', jobId: job.id };
    }

    const attemptNumber = Number(job.attempt_count) + 1;
    const retryAt = details.errorClass === 'provider_permanent_rejection'
      ? null
      : nextRetryAt(attemptNumber, finishedAt);
    if (retryAt && attemptNumber < Number(job.max_attempts)) {
      await store.markRetry({ jobId: job.id, ...details, nextAttemptAt: retryAt, startedAt, finishedAt });
      return { processed: true, outcome: 'retry_scheduled', jobId: job.id };
    }
    await store.markFailed({ jobId: job.id, ...details, startedAt, finishedAt });
    return { processed: true, outcome: 'failed', jobId: job.id };
  }

  try {
    await store.markAccepted({
      jobId: job.id,
      providerMessageId: result?.id || null,
      startedAt,
      finishedAt: options.now?.() || new Date()
    });
    return { processed: true, outcome: 'provider_accepted', jobId: job.id };
  } catch {
    options.logStateFailure?.(job.id);
    return { processed: true, outcome: 'state_update_failed', jobId: job.id };
  }
}

export async function runWorker(options) {
  const pollMs = Number(options.pollMs || 5_000);
  let stopped = false;
  const stop = () => { stopped = true; };
  process.once('SIGTERM', stop);
  process.once('SIGINT', stop);
  try {
    while (!stopped) {
      const result = await processNextDelivery(options.store, options);
      if (!result.processed) await wait(pollMs);
    }
  } finally {
    process.removeListener('SIGTERM', stop);
    process.removeListener('SIGINT', stop);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const smtpConfigured = Boolean(process.env.SMTP_PASS);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  if (!smtpConfigured && !resendConfigured) {
    throw new Error('Delivery worker requires staging-scoped SMTP or Resend credentials');
  }
  const pool = createDatabasePool();
  await verifyEnquirySchema(pool);
  const store = createPostgresEnquiryStore(pool);
  const deliver = async (email, operation) => {
    const sendEmail = smtpConfigured
      ? (_apiKey, payload, providerOperation) => sendSmtpEmail({
          host: process.env.SMTP_HOST || 'smtp.hostinger.com',
          port: process.env.SMTP_PORT || '465',
          username: process.env.SMTP_USER || 'sales@apexpackagingsolutions.com',
          password: process.env.SMTP_PASS,
          envelopeFrom: process.env.SMTP_USER || 'sales@apexpackagingsolutions.com'
        }, payload, providerOperation)
      : sendQuoteEmail;
    return sendEmailWithTimeout({
      apiKey: process.env.RESEND_API_KEY || 'smtp-configured',
      sendEmail,
      providerTimeoutMs: operation.timeoutMs,
      idempotencyKey: operation.idempotencyKey
    }, email);
  };

  try {
    await runWorker({
      store,
      deliver,
      workerId: process.env.RAILWAY_REPLICA_ID || `worker-${randomUUID()}`,
      pollMs: process.env.ENQUIRY_WORKER_POLL_MS,
      providerTimeoutMs: process.env.QUOTE_PROVIDER_TIMEOUT_MS,
      logStateFailure: (jobId) => console.error(`Delivery status update failed [${jobId}]`)
    });
  } finally {
    await closeDatabasePool(pool);
  }
}
