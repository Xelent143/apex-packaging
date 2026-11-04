import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import pg from 'pg';
import { verifyEnquirySchema } from './db.mjs';
import { createPostgresEnquiryStore } from './enquiryStore.mjs';
import { processNextDelivery } from './enquiryWorker.mjs';
import { runMigrations } from './migrations.mjs';
import { handleQuoteRequest, ProviderTimeoutError } from './quoteEmail.mjs';

const { Pool } = pg;
const testDatabaseUrl = process.env.TEST_DATABASE_URL || '';

test('native PostgreSQL 17 enquiry outbox gates', { skip: !testDatabaseUrl }, async (t) => {
  const adminPool = new Pool({ connectionString: testDatabaseUrl, max: 8 });
  const suffix = randomUUID().replaceAll('-', '').slice(0, 12);
  const webRole = `apex_web_test_${suffix}`;
  const workerRole = `apex_worker_test_${suffix}`;
  const webPassword = `web_${suffix}_password`;
  const workerPassword = `worker_${suffix}_password`;
  let webPool;
  let workerPool;

  try {
    const version = (await adminPool.query('SHOW server_version')).rows[0].server_version;
    assert.match(version, /^17\./);
    await runMigrations(adminPool);
    await createLoginRole(adminPool, webRole, webPassword, 'apex_web_runtime');
    await createLoginRole(adminPool, workerRole, workerPassword, 'apex_worker_runtime');
    webPool = new Pool({ connectionString: roleUrl(testDatabaseUrl, webRole, webPassword), max: 5 });
    workerPool = new Pool({ connectionString: roleUrl(testDatabaseUrl, workerRole, workerPassword), max: 5 });
    await verifyEnquirySchema(webPool);
    await verifyEnquirySchema(workerPool);

    await t.test('runtime roles perform intended operations and cannot execute DDL', async () => {
      await resetDatabase(adminPool);
      const webStore = createPostgresEnquiryStore(webPool);
      const workerStore = createPostgresEnquiryStore(workerPool);
      const webRecord = await webStore.recordEnquiry(recordInput({ provider: 'resend' }));
      assert.equal(await webStore.startDelivery({
        jobId: webRecord.jobId,
        workerId: 'web-request',
        leaseMs: 60_000
      }), true);
      await webStore.markRetry({
        jobId: webRecord.jobId,
        errorClass: 'provider_transient_failure',
        errorCode: '503',
        nextAttemptAt: new Date(Date.now() - 1_000)
      });

      const workerRecord = await webStore.recordEnquiry(recordInput({
        correlationId: randomUUID(),
        submissionKey: `quote/native-worker-${suffix}`,
        provider: 'resend'
      }));
      const claimed = await workerStore.claimNextJob({ workerId: 'native-worker', leaseMs: 60_000 });
      assert.ok([webRecord.jobId, workerRecord.jobId].includes(claimed.id));
      await workerStore.markAccepted({ jobId: claimed.id, providerMessageId: 'mock-provider-message' });

      for (const pool of [webPool, workerPool]) {
        await assertPermissionDenied(pool.query(`CREATE TABLE forbidden_${suffix} (id integer)`));
        await assertPermissionDenied(pool.query('ALTER TABLE enquiries ADD COLUMN forbidden_column text'));
        await assertPermissionDenied(pool.query('DROP TABLE enquiries'));
      }
    });

    await t.test('concurrent workers claim one job exactly once', async () => {
      await resetDatabase(adminPool);
      const webStore = createPostgresEnquiryStore(webPool);
      const workerStore = createPostgresEnquiryStore(workerPool);
      const record = await webStore.recordEnquiry(recordInput({ correlationId: randomUUID() }));
      const claims = await Promise.all([
        workerStore.claimNextJob({ workerId: 'worker-a', leaseMs: 60_000 }),
        workerStore.claimNextJob({ workerId: 'worker-b', leaseMs: 60_000 })
      ]);
      assert.equal(claims.filter(Boolean).length, 1);
      assert.equal(claims.find(Boolean).id, record.jobId);
    });

    await t.test('outbox failure rolls back the enquiry transaction', async () => {
      await resetDatabase(adminPool);
      const store = createPostgresEnquiryStore(webPool);
      await assert.rejects(store.recordEnquiry(recordInput({ provider: null })), /null value|not-null|violates/i);
      assert.equal((await adminPool.query('SELECT count(*)::int AS count FROM enquiries')).rows[0].count, 0);
      assert.equal((await adminPool.query('SELECT count(*)::int AS count FROM delivery_jobs')).rows[0].count, 0);
    });

    await t.test('ambiguous commit retry recovers the original non-JavaScript enquiry', async () => {
      await resetDatabase(adminPool);
      const normalStore = createPostgresEnquiryStore(webPool);
      const ambiguousStore = createPostgresEnquiryStore(commitAcknowledgementFailurePool(webPool));
      const sessionId = '00000000-0000-4000-8000-000000000951';
      const originalCorrelationId = '00000000-0000-4000-8000-000000000952';
      const retryCorrelationId = '00000000-0000-4000-8000-000000000953';
      let providerCalls = 0;

      const first = await handleQuoteRequest(createSyntheticQuoteRequest({ acceptJson: false }), durableOptions({
        enquiryStore: ambiguousStore,
        submissionSessionId: sessionId,
        createCorrelationId: () => originalCorrelationId,
        sendEmail: async () => { providerCalls += 1; }
      }));
      assert.equal(first.status, 503);
      assert.match(await first.text(), /couldn.t submit your request/i);

      const retry = await handleQuoteRequest(createSyntheticQuoteRequest({ acceptJson: false }), durableOptions({
        enquiryStore: normalStore,
        submissionSessionId: sessionId,
        createCorrelationId: () => retryCorrelationId,
        sendEmail: async () => { providerCalls += 1; }
      }));
      assert.equal(retry.status, 303);
      assert.equal(
        retry.headers.get('location'),
        `/thank-you?reference=${originalCorrelationId}`
      );
      assert.equal(providerCalls, 0);
      assert.equal((await adminPool.query('SELECT count(*)::int AS count FROM enquiries')).rows[0].count, 1);
    });

    await t.test('database outage cannot return a false durable success', async () => {
      const unavailablePool = new Pool({
        connectionString: 'postgresql://unused:unused@127.0.0.1:1/unavailable',
        connectionTimeoutMillis: 100,
        max: 1
      });
      let providerCalls = 0;
      try {
        const response = await handleQuoteRequest(createSyntheticQuoteRequest(), durableOptions({
          enquiryStore: createPostgresEnquiryStore(unavailablePool),
          submissionSessionId: '00000000-0000-4000-8000-000000000954',
          sendEmail: async () => { providerCalls += 1; }
        }));
        assert.equal(response.status, 503);
        assert.equal((await response.json()).status, 'storage_failed');
        assert.equal(providerCalls, 0);
      } finally {
        await unavailablePool.end();
      }
    });

    await t.test('expired SMTP lease becomes uncertain after worker restart', async () => {
      await resetDatabase(adminPool);
      const webStore = createPostgresEnquiryStore(webPool);
      const workerStore = createPostgresEnquiryStore(workerPool);
      const record = await webStore.recordEnquiry(recordInput({ correlationId: randomUUID(), provider: 'smtp' }));
      await adminPool.query(
        `UPDATE delivery_jobs SET state = 'leased', lease_owner = 'stopped-worker', lease_until = now() - interval '1 minute'
         WHERE id = $1`,
        [record.jobId]
      );
      assert.equal(await workerStore.releaseExpiredLeases(), 1);
      const job = (await adminPool.query('SELECT state FROM delivery_jobs WHERE id = $1', [record.jobId])).rows[0];
      assert.equal(job.state, 'uncertain');
      assert.equal(await workerStore.claimNextJob({ workerId: 'replacement-worker', leaseMs: 60_000 }), null);
    });

    await t.test('provider timeout becomes uncertain using mocked delivery', async () => {
      await resetDatabase(adminPool);
      const webStore = createPostgresEnquiryStore(webPool);
      const workerStore = createPostgresEnquiryStore(workerPool);
      const record = await webStore.recordEnquiry(recordInput({ correlationId: randomUUID(), provider: 'smtp' }));
      const outcome = await processNextDelivery(workerStore, {
        store: workerStore,
        workerId: 'timeout-worker',
        deliver: async () => { throw new ProviderTimeoutError(); }
      });
      assert.equal(outcome.outcome, 'uncertain');
      assert.equal((await adminPool.query('SELECT state FROM delivery_jobs WHERE id = $1', [record.jobId])).rows[0].state, 'uncertain');
    });

    await t.test('bounded retries stop at the configured attempt ceiling', async () => {
      await resetDatabase(adminPool);
      const webStore = createPostgresEnquiryStore(webPool);
      const workerStore = createPostgresEnquiryStore(workerPool);
      const record = await webStore.recordEnquiry(recordInput({ correlationId: randomUUID(), provider: 'resend' }));
      const outcomes = [];
      for (let attempt = 0; attempt < 5; attempt += 1) {
        await adminPool.query('UPDATE delivery_jobs SET next_attempt_at = now() - interval \'1 second\' WHERE id = $1', [record.jobId]);
        const result = await processNextDelivery(workerStore, {
          store: workerStore,
          workerId: `retry-worker-${attempt}`,
          deliver: async () => {
            const error = new Error('synthetic provider failure');
            error.status = 503;
            throw error;
          }
        });
        outcomes.push(result.outcome);
      }
      assert.deepEqual(outcomes, ['retry_scheduled', 'retry_scheduled', 'retry_scheduled', 'retry_scheduled', 'failed']);
      const job = (await adminPool.query(
        'SELECT state, attempt_count FROM delivery_jobs WHERE id = $1',
        [record.jobId]
      )).rows[0];
      assert.equal(job.state, 'failed');
      assert.equal(job.attempt_count, 5);
    });
  } finally {
    await webPool?.end().catch(() => {});
    await workerPool?.end().catch(() => {});
    await adminPool.query(`DROP ROLE IF EXISTS ${quoteIdentifier(webRole)}`).catch(() => {});
    await adminPool.query(`DROP ROLE IF EXISTS ${quoteIdentifier(workerRole)}`).catch(() => {});
    await adminPool.end();
  }
});

function recordInput(overrides = {}) {
  const correlationId = overrides.correlationId || randomUUID();
  return {
    correlationId,
    submissionKey: overrides.submissionKey || `quote/native/${correlationId}`,
    submission: {
      source: 'Synthetic Native PostgreSQL Test',
      fields: { name: 'Synthetic Buyer', email: 'synthetic@example.invalid', details: 'Synthetic packaging request' },
      files: []
    },
    deliveryEmail: {
      from: 'Synthetic <synthetic@example.invalid>',
      to: ['synthetic@example.invalid'],
      subject: 'Synthetic quote',
      text: 'Synthetic only',
      html: '<p>Synthetic only</p>'
    },
    provider: 'smtp',
    artworkStatus: 'none',
    maxAttempts: 5,
    ...overrides
  };
}

function createSyntheticQuoteRequest(options = {}) {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Synthetic Buyer');
  formData.set('email', 'synthetic@example.invalid');
  formData.set('details', 'Synthetic packaging request');
  formData.set('humanConfirmation', 'confirmed');
  return new Request('https://staging.example.invalid/api/quote', {
    method: 'POST',
    headers: {
      ...(options.acceptJson === false ? {} : { Accept: 'application/json' }),
      Referer: 'https://staging.example.invalid/contact'
    },
    body: formData
  });
}

function durableOptions(overrides = {}) {
  return {
    apiKey: 'mock-only-not-a-runtime-provider',
    from: 'Synthetic <synthetic@example.invalid>',
    to: 'synthetic@example.invalid',
    providerName: 'resend',
    createCorrelationId: () => randomUUID(),
    ...overrides
  };
}

function commitAcknowledgementFailurePool(pool) {
  let failOnce = true;
  return {
    query: (...args) => pool.query(...args),
    async connect() {
      const client = await pool.connect();
      return {
        async query(statement, params) {
          const result = await client.query(statement, params);
          if (failOnce && String(statement).trim().toUpperCase() === 'COMMIT') {
            failOnce = false;
            const error = new Error('synthetic connection loss after commit');
            error.code = 'ECONNRESET';
            throw error;
          }
          return result;
        },
        release: () => client.release()
      };
    }
  };
}

async function resetDatabase(pool) {
  await pool.query('TRUNCATE provider_events, delivery_attempts, delivery_jobs, enquiries CASCADE');
}

async function createLoginRole(pool, role, password, membership) {
  await pool.query(`DROP ROLE IF EXISTS ${quoteIdentifier(role)}`);
  await pool.query(`CREATE ROLE ${quoteIdentifier(role)} LOGIN PASSWORD ${quoteLiteral(password)}`);
  await pool.query(`GRANT ${quoteIdentifier(membership)} TO ${quoteIdentifier(role)}`);
}

function roleUrl(baseUrl, role, password) {
  const url = new URL(baseUrl);
  url.username = role;
  url.password = password;
  return url.toString();
}

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function quoteLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function assertPermissionDenied(promise) {
  await assert.rejects(promise, (error) => error?.code === '42501');
}
