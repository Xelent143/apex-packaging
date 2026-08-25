import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  createPrivatePaymentLink,
  formatAmount,
  handleStripeWebhook,
  normalizePrivatePaymentRequest,
  readPrivatePaymentRecord,
  validatePrivatePaymentRequest
} from './privatePaymentLinks.mjs';

test('normalizePrivatePaymentRequest parses approved amount input', () => {
  const request = normalizePrivatePaymentRequest({
    amount: '2,214.00',
    currency: 'CAD',
    quoteNumber: 'APS-2026-0048',
    email: 'buyer@example.com',
    name: 'Alex Buyer',
    company: 'Example Co',
    description: 'Approved quote for soap boxes'
  });

  assert.equal(request.amountCents, 221400);
  assert.equal(request.currency, 'cad');
  assert.equal(request.quoteNumber, 'APS-2026-0048');
  assert.equal(request.customerEmail, 'buyer@example.com');
});

test('validatePrivatePaymentRequest rejects missing required fields', () => {
  assert.equal(validatePrivatePaymentRequest({
    amountCents: 221400,
    currency: 'cad',
    quoteNumber: 'APS-2026-0048',
    customerEmail: 'buyer@example.com',
    description: 'Approved quote for soap boxes',
    expiresAt: ''
  }), '');

  assert.match(validatePrivatePaymentRequest({
    amountCents: 221400,
    currency: 'cad',
    quoteNumber: '',
    customerEmail: 'buyer@example.com',
    description: 'Approved quote for soap boxes',
    expiresAt: ''
  }), /Quote or invoice number/);

  assert.match(validatePrivatePaymentRequest({
    amountCents: 221400,
    currency: 'cad',
    quoteNumber: 'APS-2026-0048',
    customerEmail: 'buyer@example.com',
    description: '',
    expiresAt: ''
  }), /Order description/);
});

test('createPrivatePaymentLink stores pending payment request details', async () => {
  const recordsDir = await mkdtemp(join(tmpdir(), 'apex-private-links-'));
  let capturedPayload;

  const { record, emailTemplate } = await createPrivatePaymentLink({
    amount: '2214.00',
    currency: 'CAD',
    quoteNumber: 'APS-2026-0048',
    customerEmail: 'buyer@example.com',
    customerName: 'Alex Buyer',
    company: 'Example Co',
    description: 'Approved quote for soap boxes'
  }, {
    secretKey: 'sk_test_123',
    siteUrl: 'https://apex.example',
    recordsDir,
    stripeClient: {
      checkout: {
        sessions: {
          create: async (payload) => {
            capturedPayload = payload;
            return {
              id: 'cs_test_private_123',
              url: 'https://checkout.stripe.com/c/pay/cs_test_private_123',
              payment_intent: 'pi_test_123'
            };
          }
        }
      }
    }
  });

  assert.equal(record.status, 'pending');
  assert.equal(record.sessionId, 'cs_test_private_123');
  assert.equal(record.checkoutUrl, 'https://checkout.stripe.com/c/pay/cs_test_private_123');
  assert.equal(capturedPayload.client_reference_id, 'APS-2026-0048');
  assert.equal(capturedPayload.line_items[0].price_data.unit_amount, 221400);
  assert.equal(capturedPayload.metadata.payment_flow, 'private_link');
  assert.match(emailTemplate, /Secure Payment Link:/);
  assert.match(emailTemplate, /APS-2026-0048/);

  const storedRecord = await readPrivatePaymentRecord(record.paymentRequestId, { recordsDir });
  assert.equal(storedRecord.customerEmail, 'buyer@example.com');
  assert.equal(storedRecord.paymentIntentId, 'pi_test_123');
});

test('handleStripeWebhook marks payment requests as paid', async () => {
  const recordsDir = await mkdtemp(join(tmpdir(), 'apex-private-links-'));

  const { record } = await createPrivatePaymentLink({
    amount: '1500.00',
    currency: 'USD',
    quoteNumber: 'APS-2026-0055',
    customerEmail: 'buyer@example.com',
    customerName: 'Alex Buyer',
    description: 'Approved quote for rigid boxes'
  }, {
    secretKey: 'sk_test_123',
    siteUrl: 'https://apex.example',
    recordsDir,
    stripeClient: {
      checkout: {
        sessions: {
          create: async () => ({
            id: 'cs_test_private_paid',
            url: 'https://checkout.stripe.com/c/pay/cs_test_private_paid',
            payment_intent: 'pi_test_paid'
          })
        }
      }
    }
  });

  const response = await handleStripeWebhook(new Request('https://apex.example/api/stripe-webhook', {
    method: 'POST',
    body: '{}',
    headers: { 'stripe-signature': 'test-signature' }
  }), {
    secretKey: 'sk_test_123',
    webhookSecret: 'whsec_test_123',
    recordsDir,
    stripeClient: {
      webhooks: {
        constructEvent: () => ({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_test_private_paid',
              payment_intent: 'pi_test_paid',
              customer_email: 'buyer@example.com',
              metadata: { payment_request_id: record.paymentRequestId }
            }
          }
        })
      }
    }
  });

  assert.equal(response.status, 200);
  const updatedRecord = JSON.parse(await readFile(join(recordsDir, `${record.paymentRequestId}.json`), 'utf8'));
  assert.equal(updatedRecord.status, 'paid');
  assert.equal(updatedRecord.lastEventType, 'checkout.session.completed');
  assert.equal(updatedRecord.paymentIntentId, 'pi_test_paid');
});

test('formatAmount outputs a customer-friendly currency string', () => {
  assert.equal(formatAmount(221400, 'cad'), '$2,214.00');
});
