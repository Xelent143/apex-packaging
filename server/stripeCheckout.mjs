const STRIPE_CHECKOUT_SESSIONS_URL = 'https://api.stripe.com/v1/checkout/sessions';
const MIN_AMOUNT_CENTS = 100;
const MAX_AMOUNT_CENTS = 100000000;
const ALLOWED_CURRENCIES = new Set(['cad', 'usd']);

export function formDataToCheckoutRequest(formData) {
  const amount = String(formData.get('amount') || '').trim();
  const currency = normalizeCurrency(formData.get('currency'));
  const quoteNumber = String(formData.get('quoteNumber') || '').trim();
  const customerEmail = String(formData.get('email') || '').trim();
  const customerName = String(formData.get('name') || '').trim();
  const company = String(formData.get('company') || '').trim();
  const website = String(formData.get('website') || '').trim();

  return {
    amountCents: parseAmountToCents(amount),
    currency,
    quoteNumber,
    customerEmail,
    customerName,
    company,
    isSpam: Boolean(website)
  };
}

export async function requestToCheckoutRequest(request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    return {
      amountCents: parseAmountToCents(body?.amount),
      currency: normalizeCurrency(body?.currency),
      quoteNumber: String(body?.quoteNumber || '').trim(),
      customerEmail: String(body?.email || '').trim(),
      customerName: String(body?.name || '').trim(),
      company: String(body?.company || '').trim(),
      isSpam: Boolean(String(body?.website || '').trim())
    };
  }

  return formDataToCheckoutRequest(await request.formData());
}

export async function handleCreateCheckoutSession(request, options) {
  if (!options.secretKey) return jsonResponse({ error: 'Stripe is not configured.' }, 503);

  const submission = await requestToCheckoutRequest(request);
  if (submission.isSpam) return redirectResponse('/payment-cancelled');

  const validationError = validateCheckoutRequest(submission);
  if (validationError) return jsonResponse({ error: validationError }, 400);

  const origin = getSiteOrigin(request, options.siteUrl);
  let session;
  try {
    session = await createStripeCheckoutSession(submission, {
      fetchImpl: options.fetchImpl || fetch,
      secretKey: options.secretKey,
      successUrl: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/pay?payment=cancelled`
    });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Stripe checkout could not be started.' }, 502);
  }

  if (!session.url) return jsonResponse({ error: 'Stripe did not return a checkout URL.' }, 502);
  return redirectResponse(session.url);
}

export async function createStripeCheckoutSession(submission, options) {
  const description = submission.quoteNumber
    ? `Apex Packaging approved quote ${submission.quoteNumber}`
    : 'Apex Packaging approved quote payment';

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', options.successUrl);
  params.set('cancel_url', options.cancelUrl);
  params.set('customer_email', submission.customerEmail);
  params.set('client_reference_id', submission.quoteNumber || submission.customerEmail);
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', submission.currency);
  params.set('line_items[0][price_data][unit_amount]', String(submission.amountCents));
  params.set('line_items[0][price_data][product_data][name]', 'Apex Packaging approved quote payment');
  params.set('line_items[0][price_data][product_data][description]', description);
  params.set('metadata[quote_number]', submission.quoteNumber || '');
  params.set('metadata[customer_name]', submission.customerName || '');
  params.set('metadata[company]', submission.company || '');
  params.set('metadata[customer_email]', submission.customerEmail);

  const response = await options.fetchImpl(STRIPE_CHECKOUT_SESSIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2026-02-25.clover'
    },
    body: params
  });

  const body = await response.json().catch(async () => ({ error: { message: await response.text() } }));
  if (!response.ok) {
    const message = body?.error?.message || `Stripe checkout failed with ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export function validateCheckoutRequest(submission) {
  if (!Number.isInteger(submission.amountCents)) return 'Enter a valid payment amount.';
  if (submission.amountCents < MIN_AMOUNT_CENTS) return 'Payment amount must be at least 1.00.';
  if (submission.amountCents > MAX_AMOUNT_CENTS) return 'Payment amount is too large.';
  if (!ALLOWED_CURRENCIES.has(submission.currency)) return 'Currency must be CAD or USD.';
  if (!isEmail(submission.customerEmail)) return 'A valid email address is required.';
  return '';
}

export function parseAmountToCents(value) {
  const normalized = String(value || '').replace(/,/g, '').trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return NaN;
  return Math.round(Number(normalized) * 100);
}

function normalizeCurrency(value) {
  const currency = String(value || 'cad').trim().toLowerCase();
  return ALLOWED_CURRENCIES.has(currency) ? currency : '';
}

function getSiteOrigin(request, siteUrl) {
  if (siteUrl) return String(siteUrl).replace(/\/+$/, '');
  const url = new URL(request.url);
  return url.origin;
}

function redirectResponse(location) {
  return new Response(null, {
    status: 303,
    headers: { Location: location }
  });
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}
