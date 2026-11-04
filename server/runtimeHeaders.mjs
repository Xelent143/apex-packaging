export function getRuntimeResponseHeaders(environment = {}) {
  return environment.STAGING_NOINDEX === 'true'
    ? { 'X-Robots-Tag': 'noindex, nofollow' }
    : {};
}
