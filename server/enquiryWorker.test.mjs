import assert from 'node:assert/strict';
import { test } from 'node:test';
import { processNextDelivery } from './enquiryWorker.mjs';
import { ProviderTimeoutError } from './quoteEmail.mjs';

function createFakeStore(job) {
  const calls = [];
  let availableJob = job;
  return {
    calls,
    async releaseExpiredLeases(input) { calls.push(['releaseExpiredLeases', input]); },
    async claimNextJob(input) {
      calls.push(['claimNextJob', input]);
      const claimed = availableJob;
      availableJob = null;
      return claimed;
    },
    async markAccepted(input) { calls.push(['markAccepted', input]); },
    async markRetry(input) { calls.push(['markRetry', input]); },
    async markUncertain(input) { calls.push(['markUncertain', input]); },
    async markFailed(input) { calls.push(['markFailed', input]); }
  };
}

const job = {
  id: '00000000-0000-4000-8000-000000000020',
  email_payload: { to: ['sales@example.com'], subject: 'New quote' },
  idempotency_key: 'quote/job-20/v1',
  attempt_count: 0,
  max_attempts: 5
};

test('worker records provider acceptance with the provider message ID', async () => {
  const store = createFakeStore(job);
  const result = await processNextDelivery(store, {
    store,
    workerId: 'worker-1',
    deliver: async (_email, operation) => {
      assert.equal(operation.idempotencyKey, job.idempotency_key);
      return { id: 'provider-message-1' };
    }
  });
  assert.equal(result.outcome, 'provider_accepted');
  assert.equal(store.calls.at(-1)[0], 'markAccepted');
  assert.equal(store.calls.at(-1)[1].providerMessageId, 'provider-message-1');
});

test('worker schedules a bounded retry for a confirmed transient failure', async () => {
  const store = createFakeStore(job);
  const result = await processNextDelivery(store, {
    store,
    workerId: 'worker-1',
    deliver: async () => {
      const error = new Error('private provider detail');
      error.status = 503;
      throw error;
    }
  });
  assert.equal(result.outcome, 'retry_scheduled');
  assert.equal(store.calls.at(-1)[0], 'markRetry');
  assert.equal(store.calls.at(-1)[1].errorClass, 'provider_transient_failure');
  assert.ok(store.calls.at(-1)[1].nextAttemptAt instanceof Date);
  assert.doesNotMatch(JSON.stringify(store.calls.at(-1)[1]), /private provider detail/);
});

test('worker quarantines timeout uncertainty instead of retrying automatically', async () => {
  const store = createFakeStore(job);
  const result = await processNextDelivery(store, {
    store,
    workerId: 'worker-1',
    deliver: async () => { throw new ProviderTimeoutError(); }
  });
  assert.equal(result.outcome, 'uncertain');
  assert.equal(store.calls.at(-1)[0], 'markUncertain');
  assert.equal(store.calls.some(([name]) => name === 'markRetry'), false);
});

test('worker stops retrying after the configured attempt ceiling', async () => {
  const store = createFakeStore({ ...job, attempt_count: 4, max_attempts: 5 });
  const result = await processNextDelivery(store, {
    store,
    workerId: 'worker-after-restart',
    deliver: async () => { throw new Error('temporary network failure'); }
  });
  assert.equal(result.outcome, 'failed');
  assert.equal(store.calls.at(-1)[0], 'markFailed');
});

test('worker leaves an accepted message leased when its status update fails', async () => {
  const store = createFakeStore(job);
  store.markAccepted = async (input) => {
    store.calls.push(['markAccepted', input]);
    throw new Error('database unavailable');
  };
  let safeLogJobId;
  const result = await processNextDelivery(store, {
    store,
    workerId: 'worker-1',
    deliver: async () => ({ id: 'provider-message-accepted' }),
    logStateFailure: (jobId) => { safeLogJobId = jobId; }
  });
  assert.equal(result.outcome, 'state_update_failed');
  assert.equal(store.calls.some(([name]) => name === 'markRetry'), false);
  assert.equal(safeLogJobId, job.id);
});
