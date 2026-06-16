import type { APIRoute } from 'astro';
import { handleCreateCheckoutSession } from '../../../server/stripeCheckout.mjs';

export const POST: APIRoute = async ({ request, site }) => {
  return handleCreateCheckoutSession(request, {
    secretKey: import.meta.env.STRIPE_SECRET_KEY || '',
    siteUrl: site?.toString() || import.meta.env.SITE_URL || ''
  });
};
