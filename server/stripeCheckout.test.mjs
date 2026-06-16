import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createStripeCheckoutSession,
  formDataToCheckoutRequest,
  handleCreateCheckoutSession,
  parseAmountToCents,
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

  const submission = formDataToCheckoutRequest(formData);

  assert.equal(submission.amountCents, 125000);
  assert.equal(submission.currency, 'cad');
  assert.equal(submission.quoteNumber, 'APS-1001');
  assert.equal(submission.customerEmail, 'buyer@example.com');
  assert.equal(submission.customerName, 'Alex Buyer');
  assert.equal(submission.company, 'Example Co');
});

test('validateCheckoutRequest rejects invalid payment requests', () => {
  assert.equal(validateCheckoutRequest({
    amountCents: 125000,
    currency: 'cad',
    customerEmail: 'buyer@example.com'
  }), '');
  assert.match(validateCheckoutRequest({
    amountCents: 10,
    currency: 'cad',
    customerEmail: 'buyer@example.com'
  }), /at least/);
  assert.match(validateCheckoutRequest({
    amountCents: 125000,
    currency: '',
    customerEmail: 'buyer@example.com'
  }), /Currency/);
  assert.match(validateCheckoutRequest({
    amountCents: 125000,
    currency: 'cad',
    customerEmail: 'bad'
  }), /email/);
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
      cancelUrl: 'https://example.com/pay?payment=cancelled',
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
});

test('handleCreateCheckoutSession redirects to Stripe checkout', async () => {
  const formData = new FormData();
  formData.set('amount', '500.00');
  formData.set('currency', 'cad');
  formData.set('email', 'buyer@example.com');

  const request = new Request('https://apex.example/api/create-checkout-session', {
    method: 'POST',
    body: formData
  });

  const response = await handleCreateCheckoutSession(request, {
    secretKey: 'sk_test_123',
    siteUrl: 'https://apex.example',
    fetchImpl: async () => Response.json({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' })
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), 'https://checkout.stripe.com/c/pay/cs_test_123');
});
