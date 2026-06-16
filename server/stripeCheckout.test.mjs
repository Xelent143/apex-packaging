import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import {
  createStripeCheckoutSession,
  formDataToCheckoutRequest,
  handleCreateCheckoutSession,
  parseAmountToCents,
  recordPaymentConsent,
  validateCheckoutRequest
} from './stripeCheckout.mjs';

test('parseAmountToCents converts decimal payment amounts safely', () => {
  assert.equal(parseAmountToCents('1'), 100);
  assert.equal(parseAmountToCents('1.23'), 123);
  assert.equal(parseAmountToCents('1,250.50'), 125050);
  assert.equal(Number.isNaN(parseAmountToCents('12.999')), true);
  assert.equal(Number.isNaN(parseAmountToCents('abc')), true);
});

test('formDataToCheckoutRequest extracts checkout fields', () => {
  const formData = new FormData();
  formData.set('amount', '1250.00');
  formData.set('currency', 'CAD');
  formData.set('quoteNumber', 'APS-1001');
  formData.set('email', 'buyer@example.com');
  formData.set('name', 'Alex Buyer');
  formData.set('company', 'Example Co');
  formData.set('policyConsent', 'on');

  const submission = formDataToCheckoutRequest(formData);

  assert.equal(submission.amountCents, 125000);
  assert.equal(submission.currency, 'cad');
  assert.equal(submission.quoteNumber, 'APS-1001');
  assert.equal(submission.customerEmail, 'buyer@example.com');
  assert.equal(submission.customerName, 'Alex Buyer');
  assert.equal(submission.company, 'Example Co');
  assert.equal(submission.policyConsent, 'on');
});

test('validateCheckoutRequest rejects invalid payment requests', () => {
  assert.equal(validateCheckoutRequest({
    amountCents: 125000,
    currency: 'cad',
    customerEmail: 'buyer@example.com',
    policyConsent: 'on'
  }), '');
  assert.match(validateCheckoutRequest({
    amountCents: 10,
    currency: 'cad',
    customerEmail: 'buyer@example.com',
    policyConsent: 'on'
  }), /at least/);
  assert.match(validateCheckoutRequest({
    amountCents: 125000,
    currency: '',
    customerEmail: 'buyer@example.com',
    policyConsent: 'on'
  }), /Currency/);
  assert.match(validateCheckoutRequest({
    amountCents: 125000,
    currency: 'cad',
    customerEmail: 'bad',
    policyConsent: 'on'
  }), /email/);
  assert.match(validateCheckoutRequest({
    amountCents: 125000,
    currency: 'cad',
    customerEmail: 'buyer@example.com',
    policyConsent: ''
  }), /agree/);
});

test('createStripeCheckoutSession posts expected session payload', async () => {
  let requestBody;
  const session = await createStripeCheckoutSession(
    {
      amountCents: 125000,
      currency: 'cad',
      quoteNumber: 'APS-1001',
      customerEmail: 'buyer@example.com',
      customerName: 'Alex Buyer',
      company: 'Example Co'
    },
    {
      secretKey: 'sk_test_123',
      successUrl: 'https://example.com/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: 'https://example.com/paynow?payment=cancelled',
      consentRecord: {
        consentId: 'consent_123',
        acceptedAt: '2026-06-16T12:00:00.000Z',
        ipAddress: '203.0.113.8',
        policyTermsUrl: 'https://apexpackagingsolutions.com/terms-and-conditions',
        policyRefundUrl: 'https://apexpackagingsolutions.com/refund-and-return-policy'
      },
      fetchImpl: async (_url, init) => {
        requestBody = new URLSearchParams(String(init.body));
        return Response.json({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' });
      }
    }
  );

  assert.equal(session.url, 'https://checkout.stripe.com/c/pay/cs_test_123');
  assert.equal(requestBody.get('mode'), 'payment');
  assert.equal(requestBody.get('customer_email'), 'buyer@example.com');
  assert.equal(requestBody.get('line_items[0][price_data][currency]'), 'cad');
  assert.equal(requestBody.get('line_items[0][price_data][unit_amount]'), '125000');
  assert.equal(requestBody.get('metadata[quote_number]'), 'APS-1001');
  assert.equal(requestBody.get('metadata[consent_id]'), 'consent_123');
  assert.equal(requestBody.get('metadata[consent_ip]'), '203.0.113.8');
});

test('recordPaymentConsent appends audit details to a jsonl file', async () => {
  const recordPath = join(tmpdir(), `apex-consent-${randomUUID()}.jsonl`);
  const request = new Request('https://apex.example/api/create-checkout-session', {
    headers: {
      'user-agent': 'Test Browser',
      'x-forwarded-for': '203.0.113.8, 127.0.0.1'
    }
  });
  const submission = {
    amountCents: 125000,
    currency: 'cad',
    quoteNumber: 'APS-1001',
    customerEmail: 'buyer@example.com',
    customerName: 'Alex Buyer',
    company: 'Example Co'
  };

  const record = await recordPaymentConsent(request, submission, { recordPath });
  const fileContents = await readFile(recordPath, 'utf8');
  const storedRecord = JSON.parse(fileContents.trim());

  assert.equal(record.consentId, storedRecord.consentId);
  assert.equal(storedRecord.email, 'buyer@example.com');
  assert.equal(storedRecord.ipAddress, '203.0.113.8');
  assert.equal(storedRecord.policyTermsUrl, 'https://apexpackagingsolutions.com/terms-and-conditions');
  assert.equal(storedRecord.policyRefundUrl, 'https://apexpackagingsolutions.com/refund-and-return-policy');
});

test('handleCreateCheckoutSession redirects to Stripe checkout', async () => {
  const formData = new FormData();
  formData.set('amount', '500.00');
  formData.set('currency', 'cad');
  formData.set('email', 'buyer@example.com');
  formData.set('policyConsent', 'on');

  const request = new Request('https://apex.example/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'x-forwarded-for': '203.0.113.9'
    },
    body: formData
  });

  const response = await handleCreateCheckoutSession(request, {
    secretKey: 'sk_test_123',
    siteUrl: 'https://apex.example',
    consentAuditPath: join(tmpdir(), `apex-consent-${randomUUID()}.jsonl`),
    fetchImpl: async () => Response.json({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' })
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), 'https://checkout.stripe.com/c/pay/cs_test_123');
});
