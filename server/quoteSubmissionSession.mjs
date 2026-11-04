import { randomUUID } from 'node:crypto';

const COOKIE_NAME = '__Host-apex_quote_session';
const SESSION_PATTERN = /^[a-zA-Z0-9-]{20,128}$/;

export function createQuoteSubmissionSession() {
  return randomUUID();
}

export function getQuoteSubmissionSession(cookieHeader = '') {
  for (const part of String(cookieHeader).split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    if (name !== COOKIE_NAME) continue;
    const value = decodeURIComponent(part.slice(separator + 1).trim());
    return SESSION_PATTERN.test(value) ? value : null;
  }
  return null;
}

export function serializeQuoteSubmissionSession(sessionId) {
  if (!SESSION_PATTERN.test(String(sessionId || ''))) throw new Error('Invalid quote submission session.');
  return `${COOKIE_NAME}=${encodeURIComponent(sessionId)}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`;
}
