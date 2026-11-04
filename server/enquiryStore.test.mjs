import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { createPostgresEnquiryStore } from './enquiryStore.mjs';

const migrationUrl = new URL('./migrations/001_enquiry_outbox.sql', import.meta.url);

async function createTestStore() {
  const db = new PGlite();
  await db.exec(await readFile(migrationUrl, 'utf8'));
  const query = async (sql, params = []) => {
    const result = await db.query(sql, params);
    const returnsRows = /^\s*(SELECT|WITH)\b/i.test(sql);
    return {
      ...result,
      rowCount: returnsRows ? result.rows.length : (result.affectedRows ?? result.rows.length)
    };
  };
  const pool = {
    query,
    async connect() { return { query, release() {} }; },
    async end() { await db.close(); }
  };
  return { pool, store: createPostgresEnquiryStore(pool) };
}

function recordInput(overrides = {}) {
  return {
    correlationId: '00000000-0000-4000-8000-000000000010',
    submissionKey: 'quote/browser-attempt-1',
    submission: {
      source: 'Request Quote Contact Form',
      fields: { name: 'Alex Buyer', email: 'alex@example.com', details: 'Need mailer boxes' },
      files: [{ field: 'artwork', name: 'dieline.pdf', size: 12, type: 'application/pdf', content: 'c2VjcmV0' }]
    },
    deliveryEmail: {
      from: 'Apex <sales@example.com>',
      to: ['sales@example.com'],
      subject: 'New quote',
      text: 'Quote details',
      html: '<p>Quote details</p>',
      attachments: [{ filename: 'dieline.pdf', content: 'c2VjcmV0' }]
    },
    provider: 'smtp',
    artworkStatus: 'received_ephemeral',
    now: new Date('2026-11-04T12:00:00.000Z'),
    ...overrides
  };
}

test('recordEnquiry atomically writes one enquiry and one outbox job without artwork bytes', async () => {
  const { pool, store } = await createTestStore();
  try {
    const record = await store.recordEnquiry(recordInput());
    assert.equal(record.duplicate, false);

    const enquiries = await pool.query('SELECT * FROM enquiries');
    const jobs = await pool.query('SELECT * FROM delivery_jobs');
    assert.equal(enquiries.rowCount, 1);
    assert.equal(jobs.rowCount, 1);
    assert.equal(enquiries.rows[0].file_metadata[0].content, undefined);
    assert.equal(jobs.rows[0].email_payload.attachments, undefined);
  } finally {
    await pool.end();
  }
});

test('recordEnquiry returns the original record for a duplicate submission key', async () => {
  const { pool, store } = await createTestStore();
  try {
    const original = await store.recordEnquiry(recordInput());
    const duplicate = await store.recordEnquiry(recordInput({
      correlationId: '00000000-0000-4000-8000-000000000011'
    }));
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.correlationId, original.correlationId);
    assert.equal((await pool.query('SELECT * FROM enquiries')).rowCount, 1);
    assert.equal((await pool.query('SELECT * FROM delivery_jobs')).rowCount, 1);
  } finally {
    await pool.end();
  }
});

test('recordEnquiry rolls back the enquiry when the outbox insert fails', async () => {
  const { pool, store } = await createTestStore();
  try {
    await assert.rejects(
      store.recordEnquiry(recordInput({ provider: null })),
      /null value|not-null|violates/i
    );
    assert.equal((await pool.query('SELECT * FROM enquiries')).rowCount, 0);
    assert.equal((await pool.query('SELECT * FROM delivery_jobs')).rowCount, 0);
  } finally {
    await pool.end();
  }
});

test('expired SMTP worker leases become uncertain after a restart instead of risking a duplicate send', async () => {
  const { pool, store } = await createTestStore();
  try {
    const record = await store.recordEnquiry(recordInput());
    await pool.query(
      `UPDATE delivery_jobs SET state = 'leased', lease_owner = 'worker-before-restart',
       lease_until = $2 WHERE id = $1`,
      [record.jobId, new Date('2026-11-04T11:59:00.000Z')]
    );
    const released = await store.releaseExpiredLeases({ now: new Date('2026-11-04T12:01:00.000Z') });
    const job = await pool.query('SELECT state, lease_owner, lease_until FROM delivery_jobs WHERE id = $1', [record.jobId]);
    assert.equal(released, 1);
    assert.equal(job.rows[0].state, 'uncertain');
    assert.equal(job.rows[0].lease_owner, null);
    assert.equal(job.rows[0].lease_until, null);
    const reclaimed = await store.claimNextJob({
      workerId: 'worker-after-restart',
      leaseMs: 60_000,
      now: new Date('2026-11-04T12:01:01.000Z')
    });
    assert.equal(reclaimed, null);
    assert.equal((await pool.query('SELECT status FROM enquiries WHERE id = $1', [record.correlationId])).rows[0].status, 'delivery_uncertain');
  } finally {
    await pool.end();
  }
});

test('expired Resend leases can be safely reclaimed with the same provider idempotency key', async () => {
  const { pool, store } = await createTestStore();
  try {
    const record = await store.recordEnquiry(recordInput({ provider: 'resend' }));
    await pool.query(
      `UPDATE delivery_jobs SET state = 'leased', lease_owner = 'worker-before-restart',
       lease_until = $2 WHERE id = $1`,
      [record.jobId, new Date('2026-11-04T11:59:00.000Z')]
    );
    await store.releaseExpiredLeases({ now: new Date('2026-11-04T12:01:00.000Z') });
    const reclaimed = await store.claimNextJob({
      workerId: 'worker-after-restart',
      leaseMs: 60_000,
      now: new Date('2026-11-04T12:01:01.000Z')
    });
    assert.equal(reclaimed.id, record.jobId);
    assert.equal(reclaimed.state, 'leased');
    assert.equal(reclaimed.lease_owner, 'worker-after-restart');
    assert.equal(reclaimed.idempotency_key, record.deliveryIdempotencyKey);
  } finally {
    await pool.end();
  }
});

test('delivery outcomes persist attempts and clear the message payload after acceptance', async () => {
  const { pool, store } = await createTestStore();
  try {
    const record = await store.recordEnquiry(recordInput({ provider: 'resend' }));
    await store.markRetry({
      jobId: record.jobId,
      errorClass: 'provider_transient_failure',
      errorCode: '503',
      nextAttemptAt: new Date('2026-11-04T12:05:00.000Z'),
      startedAt: new Date('2026-11-04T12:00:00.000Z'),
      finishedAt: new Date('2026-11-04T12:00:01.000Z')
    });
    await store.markAccepted({
      jobId: record.jobId,
      providerMessageId: 'provider-message-1',
      startedAt: new Date('2026-11-04T12:05:00.000Z'),
      finishedAt: new Date('2026-11-04T12:05:01.000Z')
    });

    const job = (await pool.query('SELECT * FROM delivery_jobs WHERE id = $1', [record.jobId])).rows[0];
    const attempts = await pool.query('SELECT * FROM delivery_attempts WHERE delivery_job_id = $1 ORDER BY attempt_number', [record.jobId]);
    assert.equal(job.state, 'provider_accepted');
    assert.equal(job.attempt_count, 2);
    assert.equal(job.provider_message_id, 'provider-message-1');
    assert.equal(job.email_payload, null);
    assert.deepEqual(attempts.rows.map((row) => row.outcome), ['retry_scheduled', 'provider_accepted']);
  } finally {
    await pool.end();
  }
});

test('startDelivery leases a pending job once before provider contact', async () => {
  const { pool, store } = await createTestStore();
  try {
    const record = await store.recordEnquiry(recordInput());
    const first = await store.startDelivery({
      jobId: record.jobId,
      workerId: 'request-worker',
      leaseMs: 60_000,
      now: new Date('2026-11-04T12:00:00.000Z')
    });
    const second = await store.startDelivery({
      jobId: record.jobId,
      workerId: 'duplicate-request-worker',
      leaseMs: 60_000,
      now: new Date('2026-11-04T12:00:01.000Z')
    });
    assert.equal(first, true);
    assert.equal(second, false);
    const job = (await pool.query('SELECT state, lease_owner FROM delivery_jobs WHERE id = $1', [record.jobId])).rows[0];
    assert.equal(job.state, 'leased');
    assert.equal(job.lease_owner, 'request-worker');
  } finally {
    await pool.end();
  }
});
