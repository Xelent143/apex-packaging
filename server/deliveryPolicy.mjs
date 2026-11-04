const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];

export function nextRetryAt(attemptCount, now = new Date()) {
  const delay = RETRY_DELAYS_MS[Math.max(0, Number(attemptCount) - 1)];
  if (delay == null) return null;
  return new Date(now.getTime() + delay);
}

export function safeErrorDetails(error) {
  return {
    errorClass: classifyError(error),
    errorCode: normalizeErrorCode(error?.code || error?.status || '')
  };
}

export function classifyError(error) {
  if (error?.name === 'ProviderTimeoutError') return 'provider_timeout_unknown';
  if (error?.permanent === true) return 'provider_permanent_rejection';
  if (Number(error?.status) === 429) return 'provider_rate_limited';
  if (Number(error?.status) >= 400 && Number(error?.status) < 500) return 'provider_permanent_rejection';
  if (Number(error?.status) >= 500) return 'provider_transient_failure';
  return 'provider_transient_failure';
}

function normalizeErrorCode(value) {
  const normalized = String(value || '').replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 80);
  return normalized || null;
}
