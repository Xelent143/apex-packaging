import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import Stripe from 'stripe';
import { parseAmountToCents } from './stripeCheckout.mjs';

const ALLOWED_CURRENCIES = new Set(['cad', 'usd']);
const MIN_AMOUNT_CENTS = 100;
const MAX_AMOUNT_CENTS = 100000000;
const DEFAULT_RECORDS_DIR = resolve(process.cwd(), 'data', 'private-payment-links');
const DEFAULT_SITE_URL = 'https://apexpackagingsolutions.com';
const DEFAULT_POLICIES = {
  terms: `${DEFAULT_SITE_URL}/terms-and-conditions`,
  refund: `${DEFAULT_SITE_URL}/refund-and-return-policy`,
  privacy: `${DEFAULT_SITE_URL}/privacy`
};

export function normalizePrivatePaymentRequest(input = {}) {
  const amountSource = input.amountCents ?? input.amount ?? '';
  const amountCents = Number.isInteger(amountSource)
    ? amountSource
    : parseAmountToCents(String(amountSource));
  const currency = String(input.currency || 'cad').trim().toLowerCase();
  const expiresAt = normalizeExpiry(input.expiresAt);

  return {
    amountCents,
    currency,
    quoteNumber: String(input.quoteNumber || input.invoiceNumber || '').trim(),
    customerEmail: String(input.customerEmail || input.email || '').trim(),
    customerName: String(input.customerName || input.name || '').trim(),
    company: String(input.company || '').trim(),
    description: String(input.description || '').trim(),
    expiresAt
  };
}

export function validatePrivatePaymentRequest(request) {
  if (!Number.isInteger(request.amountCents)) return 'Enter a valid approved payment amount.';
  if (request.amountCents < MIN_AMOUNT_CENTS) return 'Payment amount must be at least 1.00.';
  if (request.amountCents > MAX_AMOUNT_CENTS) return 'Payment amount is too large.';
  if (!ALLOWED_CURRENCIES.has(request.currency)) return 'Currency must be CAD or USD.';
  if (!isEmail(request.customerEmail)) return 'A valid customer email is required.';
  if (!request.quoteNumber) return 'Quote or invoice number is required.';
  if (!request.description) return 'Order description is required.';
  if (request.expiresAt === null) return 'Expiration must be a valid future date/time.';
  return '';
}

export async function createPrivatePaymentLink(input, options = {}) {
  const request = normalizePrivatePaymentRequest(input);
  const validationError = validatePrivatePaymentRequest(request);
  if (validationError) throw new Error(validationError);
  if (!options.secretKey) throw new Error('STRIPE_SECRET_KEY is required to generate a secure payment link.');

  const siteUrl = normalizeSiteUrl(options.siteUrl);
  const stripe = options.stripeClient || new Stripe(options.secretKey, {
    apiVersion: '2026-02-25.clover'
  });

  const paymentRequestId = options.paymentRequestId || `payreq_${randomBytes(18).toString('hex')}`;
  const record = {
    paymentRequestId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending',
    amountCents: request.amountCents,
    currency: request.currency,
    quoteNumber: request.quoteNumber,
    customerEmail: request.customerEmail,
    customerName: request.customerName,
    company: request.company,
    description: request.description,
    expiresAt: request.expiresAt || '',
    checkoutUrl: '',
    sessionId: '',
    paymentIntentId: '',
    paidAt: '',
    cancelledAt: '',
    expiredAt: '',
    lastEventType: '',
    policyUrls: {
      ...DEFAULT_POLICIES,
      ...(options.policyUrls || {})
    }
  };

  const session = await stripe.checkout.sessions.create(buildCheckoutSessionPayload(record, siteUrl));

  record.checkoutUrl = session.url || '';
  record.sessionId = session.id || '';
  record.paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : '';
  record.updatedAt = new Date().toISOString();

  await writePrivatePaymentRecord(record, { recordsDir: options.recordsDir });

  return {
    record,
    emailTemplate: formatPrivatePaymentEmail(record)
  };
}

export async function readPrivatePaymentRecord(paymentRequestId, options = {}) {
  const recordPath = getRecordPath(paymentRequestId, options.recordsDir);
  const contents = await readFile(recordPath, 'utf8');
  return JSON.parse(contents);
}

export async function updatePrivatePaymentRecord(paymentRequestId, changes, options = {}) {
  const record = await readPrivatePaymentRecord(paymentRequestId, options);
  const nextRecord = {
    ...record,
    ...changes,
    updatedAt: new Date().toISOString()
  };
  await writePrivatePaymentRecord(nextRecord, options);
  return nextRecord;
}

export async function updatePaymentRecordStatusBySession(session, status, options = {}) {
  const paymentRequestId = session?.metadata?.payment_request_id || await findPaymentRequestIdBySessionId(session?.id, options);
  if (!paymentRequestId) return null;

  const changes = {
    status,
    sessionId: session?.id || '',
    paymentIntentId: typeof session?.payment_intent === 'string' ? session.payment_intent : '',
    customerEmail: session?.customer_details?.email || session?.customer_email || '',
    lastEventType: options.eventType || ''
  };

  if (status === 'paid') changes.paidAt = new Date().toISOString();
  if (status === 'cancelled') changes.cancelledAt = new Date().toISOString();
  if (status === 'expired') changes.expiredAt = new Date().toISOString();

  return updatePrivatePaymentRecord(paymentRequestId, changes, options);
}

export async function handleStripeWebhook(request, options = {}) {
  if (!options.secretKey) return jsonResponse({ error: 'Stripe secret key is not configured.' }, 503);
  if (!options.webhookSecret) return jsonResponse({ error: 'Stripe webhook secret is not configured.' }, 503);

  const signature = request.headers.get('stripe-signature') || '';
  const payload = await request.text();
  const stripe = options.stripeClient || new Stripe(options.secretKey, {
    apiVersion: '2026-02-25.clover'
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, options.webhookSecret);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Invalid Stripe signature.' }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    await updatePaymentRecordStatusBySession(event.data.object, 'paid', {
      recordsDir: options.recordsDir,
      eventType: event.type
    });
  }

  if (event.type === 'checkout.session.expired') {
    await updatePaymentRecordStatusBySession(event.data.object, 'expired', {
      recordsDir: options.recordsDir,
      eventType: event.type
    });
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    await updatePaymentRecordStatusBySession(event.data.object, 'cancelled', {
      recordsDir: options.recordsDir,
      eventType: event.type
    });
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentRequestId = event.data.object?.metadata?.payment_request_id;
    if (paymentRequestId) {
      await updatePrivatePaymentRecord(paymentRequestId, {
        status: 'cancelled',
        paymentIntentId: event.data.object.id || '',
        lastEventType: event.type
      }, { recordsDir: options.recordsDir });
    }
  }

  return jsonResponse({ received: true }, 200);
}

export function formatPrivatePaymentEmail(record) {
  const amount = formatAmount(record.amountCents, record.currency);
  const expiryLine = record.expiresAt
    ? `This link is intended for use before ${new Date(record.expiresAt).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}.`
    : 'This link is intended for your approved quote only.';

  return [
    'Subject: Secure Payment Link – APEX Packaging Solutions',
    '',
    `Hi ${record.customerName || 'there'},`,
    '',
    'Hope you are doing well.',
    '',
    'Thank you for confirming your order.',
    '',
    'Please use the secure payment link below to complete payment for your approved quotation:',
    '',
    `Secure Payment Link: ${record.checkoutUrl}`,
    `Quote / Invoice: ${record.quoteNumber}`,
    `Amount: ${amount}`,
    `Order Description: ${record.description}`,
    '',
    'Please review the policy pages before paying:',
    `Terms & Conditions: ${record.policyUrls.terms}`,
    `Refund & Return Policy: ${record.policyUrls.refund}`,
    `Privacy Policy: ${record.policyUrls.privacy}`,
    '',
    expiryLine,
    '',
    'Once payment has been completed, kindly let us know and we will proceed with the next stage of your order.',
    '',
    'Best regards,',
    'APEX Packaging Solutions'
  ].join('\n');
}

export function formatAmount(amountCents, currency) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: String(currency || 'cad').toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amountCents / 100);
}

function buildCheckoutSessionPayload(record, siteUrl) {
  const successUrl = new URL('/payment-success', siteUrl);
  successUrl.searchParams.set('payment_request_id', record.paymentRequestId);
  successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

  const cancelUrl = new URL('/payment-cancelled', siteUrl);
  cancelUrl.searchParams.set('payment_request_id', record.paymentRequestId);

  return {
    mode: 'payment',
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    customer_email: record.customerEmail,
    client_reference_id: record.quoteNumber,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: record.currency,
          unit_amount: record.amountCents,
          product_data: {
            name: 'Apex Packaging approved quote payment',
            description: `${record.quoteNumber}: ${record.description}`
          }
        }
      }
    ],
    metadata: {
      payment_flow: 'private_link',
      payment_request_id: record.paymentRequestId,
      quote_number: record.quoteNumber,
      customer_name: record.customerName || '',
      company: record.company || '',
      customer_email: record.customerEmail,
      description: record.description
    },
    expires_at: record.expiresAt ? Math.floor(new Date(record.expiresAt).getTime() / 1000) : undefined
  };
}

async function writePrivatePaymentRecord(record, options = {}) {
  const recordPath = getRecordPath(record.paymentRequestId, options.recordsDir);
  await mkdir(dirname(recordPath), { recursive: true });
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
}

async function findPaymentRequestIdBySessionId(sessionId, options = {}) {
  if (!sessionId) return '';
  const recordsDir = normalizeRecordsDir(options.recordsDir);

  let fileNames = [];
  try {
    fileNames = await readdir(recordsDir);
  } catch {
    return '';
  }

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.json')) continue;
    const contents = await readFile(join(recordsDir, fileName), 'utf8');
    const record = JSON.parse(contents);
    if (record.sessionId === sessionId) return record.paymentRequestId || fileName.replace(/\.json$/, '');
  }

  return '';
}

function getRecordPath(paymentRequestId, recordsDir = DEFAULT_RECORDS_DIR) {
  return resolve(normalizeRecordsDir(recordsDir), `${paymentRequestId}.json`);
}

function normalizeExpiry(value) {
  if (value == null || value === '') return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getTime() <= Date.now()) return null;
  return date.toISOString();
}

function normalizeSiteUrl(siteUrl) {
  return String(siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, '') || DEFAULT_SITE_URL;
}

function normalizeRecordsDir(recordsDir) {
  return recordsDir ? resolve(recordsDir) : DEFAULT_RECORDS_DIR;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
