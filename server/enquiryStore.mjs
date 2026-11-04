import { randomUUID } from 'node:crypto';

export function createPostgresEnquiryStore(pool) {
  return {
    recordEnquiry: (input) => recordEnquiry(pool, input),
    markAccepted: (input) => markAccepted(pool, input),
    startDelivery: (input) => startDelivery(pool, input),
    markRetry: (input) => markRetry(pool, input),
    markUncertain: (input) => markUncertain(pool, input),
    claimNextJob: (input) => claimNextJob(pool, input),
    releaseExpiredLeases: (input) => releaseExpiredLeases(pool, input),
    markFailed: (input) => markFailed(pool, input)
  };
}

async function startDelivery(pool, input) {
  const now = input.now || new Date();
  const leaseUntil = new Date(now.getTime() + Number(input.leaseMs || 60_000));
  const result = await pool.query(
    `UPDATE delivery_jobs SET state = 'leased', lease_owner = $2, lease_until = $3, updated_at = $4
     WHERE id = $1 AND state IN ('pending', 'retry')
     RETURNING id`,
    [input.jobId, input.workerId, leaseUntil, now]
  );
  return result.rowCount === 1;
}

async function recordEnquiry(pool, input) {
  const client = await pool.connect();
  const now = input.now || new Date();
  const enquiryId = input.correlationId;
  const jobId = input.jobId || randomUUID();
  const submissionKey = normalizeSubmissionKey(input.submissionKey);
  try {
    await client.query('BEGIN');
    if (submissionKey) {
      const existing = await findBySubmissionKey(client, submissionKey);
      if (existing) {
        await client.query('COMMIT');
        return { ...existing, duplicate: true };
      }
    }

    const deliveryIdempotencyKey = input.deliveryIdempotencyKey || `quote/${jobId}/v1`;
    await client.query(
      `INSERT INTO enquiries (
        id, submission_key, source, status, fields, file_metadata, artwork_status,
        retention_due_at, created_at, updated_at
      ) VALUES ($1, $2, $3, 'delivery_pending', $4::jsonb, $5::jsonb, $6, $7, $8, $8)`,
      [
        enquiryId,
        submissionKey,
        input.submission.source,
        JSON.stringify(input.submission.fields),
        JSON.stringify(safeFileMetadata(input.submission.files)),
        input.artworkStatus || 'none',
        input.retentionDueAt || null,
        now
      ]
    );
    await client.query(
      `INSERT INTO delivery_jobs (
        id, enquiry_id, provider, state, email_payload, idempotency_key,
        payload_version, max_attempts, next_attempt_at, created_at, updated_at
      ) VALUES ($1, $2, $3, 'pending', $4::jsonb, $5, 1, $6, $7, $7, $7)`,
      [
        jobId,
        enquiryId,
        input.provider,
        JSON.stringify(stripAttachments(input.deliveryEmail)),
        deliveryIdempotencyKey,
        Number(input.maxAttempts || 5),
        now
      ]
    );
    await client.query('COMMIT');
    return {
      correlationId: enquiryId,
      jobId,
      status: 'delivery_pending',
      artworkStatus: input.artworkStatus || 'none',
      deliveryIdempotencyKey,
      duplicate: false
    };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    if (error?.code === '23505' && submissionKey) {
      const existing = await findBySubmissionKey(pool, submissionKey);
      if (existing) return { ...existing, duplicate: true };
    }
    throw error;
  } finally {
    client.release();
  }
}

async function findBySubmissionKey(queryable, submissionKey) {
  const result = await queryable.query(
    `SELECT e.id AS correlation_id, e.status, e.artwork_status, j.id AS job_id
     FROM enquiries e
     JOIN delivery_jobs j ON j.enquiry_id = e.id AND j.purpose = 'sales_notification'
     WHERE e.submission_key = $1`,
    [submissionKey]
  );
  if (!result.rowCount) return null;
  const row = result.rows[0];
  return {
    correlationId: row.correlation_id,
    jobId: row.job_id,
    status: row.status,
    artworkStatus: row.artwork_status
  };
}

async function markAccepted(pool, input) {
  return recordAttemptAndUpdate(pool, input, {
    jobState: 'provider_accepted',
    enquiryStatus: 'provider_accepted',
    outcome: 'provider_accepted',
    clearPayload: true,
    artworkStatus: input.artworkStatus
  });
}

async function markRetry(pool, input) {
  return recordAttemptAndUpdate(pool, input, {
    jobState: input.nextAttemptAt ? 'retry' : 'failed',
    enquiryStatus: input.nextAttemptAt ? 'delivery_pending' : 'delivery_failed',
    outcome: input.nextAttemptAt ? 'retry_scheduled' : 'failed',
    nextAttemptAt: input.nextAttemptAt,
    artworkStatus: input.artworkStatus
  });
}

async function markUncertain(pool, input) {
  return recordAttemptAndUpdate(pool, input, {
    jobState: 'uncertain',
    enquiryStatus: 'delivery_uncertain',
    outcome: 'uncertain',
    artworkStatus: input.artworkStatus || 'delivery_unconfirmed'
  });
}

async function markFailed(pool, input) {
  return recordAttemptAndUpdate(pool, input, {
    jobState: 'failed',
    enquiryStatus: 'delivery_failed',
    outcome: 'failed',
    artworkStatus: input.artworkStatus
  });
}

async function recordAttemptAndUpdate(pool, input, update) {
  const client = await pool.connect();
  const finishedAt = input.finishedAt || new Date();
  try {
    await client.query('BEGIN');
    const jobResult = await client.query(
      'SELECT enquiry_id, provider, attempt_count FROM delivery_jobs WHERE id = $1 FOR UPDATE',
      [input.jobId]
    );
    if (!jobResult.rowCount) throw new Error('Delivery job was not found.');
    const job = jobResult.rows[0];
    const attemptNumber = Number(job.attempt_count) + 1;

    await client.query(
      `INSERT INTO delivery_attempts (
        id, delivery_job_id, attempt_number, provider, outcome, error_class,
        error_code, provider_message_id, started_at, finished_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        randomUUID(), input.jobId, attemptNumber, job.provider, update.outcome,
        input.errorClass || null, input.errorCode || null, input.providerMessageId || null,
        input.startedAt || finishedAt, finishedAt
      ]
    );
    await client.query(
      `UPDATE delivery_jobs SET
        state = $2,
        attempt_count = $3,
        next_attempt_at = COALESCE($4, next_attempt_at),
        lease_owner = NULL,
        lease_until = NULL,
        last_error_class = $5,
        last_error_code = $6,
        provider_message_id = COALESCE($7, provider_message_id),
        email_payload = CASE WHEN $8 THEN NULL ELSE email_payload END,
        updated_at = $9
      WHERE id = $1`,
      [
        input.jobId, update.jobState, attemptNumber, update.nextAttemptAt || null,
        input.errorClass || null, input.errorCode || null, input.providerMessageId || null,
        Boolean(update.clearPayload), finishedAt
      ]
    );
    await client.query(
      `UPDATE enquiries SET
        status = $2,
        artwork_status = COALESCE($3, artwork_status),
        updated_at = $4
      WHERE id = $1`,
      [job.enquiry_id, update.enquiryStatus, update.artworkStatus || null, finishedAt]
    );
    await client.query('COMMIT');
    return { attemptNumber, state: update.jobState };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

async function releaseExpiredLeases(pool, input = {}) {
  const now = input.now || new Date();
  const result = await pool.query(
    `UPDATE delivery_jobs SET
      state = CASE WHEN provider = 'resend' THEN 'retry' ELSE 'uncertain' END,
      last_error_class = CASE WHEN provider = 'resend' THEN last_error_class ELSE 'worker_interrupted_unknown' END,
      lease_owner = NULL, lease_until = NULL,
      next_attempt_at = $1, updated_at = $1
     WHERE state = 'leased' AND lease_until <= $1
     RETURNING enquiry_id, state`,
    [now]
  );
  const uncertainEnquiryIds = result.rows
    .filter((row) => row.state === 'uncertain')
    .map((row) => row.enquiry_id);
  if (uncertainEnquiryIds.length) {
    await pool.query(
      `UPDATE enquiries SET status = 'delivery_uncertain', updated_at = $2
       WHERE id = ANY($1::uuid[])`,
      [uncertainEnquiryIds, now]
    );
  }
  return result.rowCount;
}

async function claimNextJob(pool, input) {
  const now = input.now || new Date();
  const leaseUntil = new Date(now.getTime() + Number(input.leaseMs || 60_000));
  const result = await pool.query(
    `WITH candidate AS (
      SELECT id FROM delivery_jobs
      WHERE (
        state IN ('pending', 'retry') OR
        (state = 'leased' AND lease_until <= $1)
      )
      AND next_attempt_at <= $1
      AND attempt_count < max_attempts
      ORDER BY next_attempt_at, created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    UPDATE delivery_jobs j SET
      state = 'leased', lease_owner = $2, lease_until = $3, updated_at = $1
    FROM candidate
    WHERE j.id = candidate.id
    RETURNING j.*`,
    [now, input.workerId, leaseUntil]
  );
  return result.rows[0] || null;
}

function safeFileMetadata(files = []) {
  return files.map((file) => ({
    field: String(file.field || ''),
    name: String(file.name || '').slice(0, 160),
    size: Number(file.size || 0),
    type: String(file.type || '').slice(0, 120),
    skipped: file.skipped ? String(file.skipped).slice(0, 240) : undefined
  }));
}

function stripAttachments(email) {
  const { attachments: _attachments, ...safeEmail } = email;
  return safeEmail;
}

function normalizeSubmissionKey(value) {
  const key = String(value || '').trim();
  if (!key || key.length > 128 || !/^[a-zA-Z0-9:_./-]+$/.test(key)) return null;
  return key;
}
