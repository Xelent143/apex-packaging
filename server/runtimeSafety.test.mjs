import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFallbackSubmissionKey } from './quoteEmail.mjs';
import {
  createQuoteSubmissionSession,
  getQuoteSubmissionSession,
  serializeQuoteSubmissionSession
} from './quoteSubmissionSession.mjs';
import { getRuntimeResponseHeaders } from './runtimeHeaders.mjs';

test('staging noindex is opt-in and production response headers remain unchanged', () => {
  assert.deepEqual(getRuntimeResponseHeaders({}), {});
  assert.deepEqual(getRuntimeResponseHeaders({ STAGING_NOINDEX: 'false' }), {});
  assert.deepEqual(getRuntimeResponseHeaders({ STAGING_NOINDEX: 'true' }), {
    'X-Robots-Tag': 'noindex, nofollow'
  });
});

test('quote submission session cookie is host-only, secure and recoverable', () => {
  const sessionId = createQuoteSubmissionSession();
  const serialized = serializeQuoteSubmissionSession(sessionId);
  assert.match(serialized, /^__Host-apex_quote_session=/);
  assert.match(serialized, /Path=\//);
  assert.match(serialized, /HttpOnly/);
  assert.match(serialized, /Secure/);
  assert.match(serialized, /SameSite=Lax/);
  assert.equal(getQuoteSubmissionSession(`other=1; ${serialized.split(';')[0]}`), sessionId);
  assert.equal(getQuoteSubmissionSession('__Host-apex_quote_session=invalid'), null);
});

test('non-JavaScript submission key is stable for a retry and changes with content or session', () => {
  const submission = {
    source: 'Request Quote Contact Form',
    fields: { email: 'synthetic@example.invalid', details: 'Synthetic mailer request' }
  };
  const first = createFallbackSubmissionKey('00000000-0000-4000-8000-000000000901', submission);
  assert.equal(first, createFallbackSubmissionKey('00000000-0000-4000-8000-000000000901', submission));
  assert.notEqual(first, createFallbackSubmissionKey('00000000-0000-4000-8000-000000000902', submission));
  assert.notEqual(first, createFallbackSubmissionKey('00000000-0000-4000-8000-000000000901', {
    ...submission,
    fields: { ...submission.fields, details: 'Different synthetic request' }
  }));
  assert.equal(createFallbackSubmissionKey('', submission), null);
});
