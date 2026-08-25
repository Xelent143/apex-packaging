import type { APIRoute } from 'astro';
import { handleStripeWebhook } from '../../../server/privatePaymentLinks.mjs';

export const POST: APIRoute = async ({ request }) => {
  return handleStripeWebhook(request, {
    secretKey: import.meta.env.STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET || '',
    recordsDir: import.meta.env.PRIVATE_PAYMENT_RECORDS_DIR || undefined
  });
};
