import type { APIRoute } from 'astro';
import { handleQuoteRequest, sendQuoteEmail } from '../../../server/quoteEmail.mjs';

const defaultQuoteRecipient = 'sales@apexpackagingsolutions.com';
const defaultQuoteSender = 'Apex Packaging <sales@apexpackagingsolutions.com>';

export const POST: APIRoute = async ({ request }) => {
  return handleQuoteRequest(request, {
    apiKey: import.meta.env.RESEND_API_KEY || '',
    from: import.meta.env.QUOTE_FROM_EMAIL || defaultQuoteSender,
    to: import.meta.env.QUOTE_TO_EMAIL || defaultQuoteRecipient,
    sendEmail: sendQuoteEmail
  });
};
