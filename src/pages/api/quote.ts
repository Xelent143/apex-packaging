import type { APIRoute } from 'astro';
import { handleQuoteRequest, sendQuoteEmail } from '../../../server/quoteEmail.mjs';
import { sendSmtpEmail } from '../../../server/smtpEmail.mjs';

const defaultQuoteRecipient = 'sales@apexpackagingsolutions.com';
const defaultQuoteSender = 'Apex Packaging <sales@apexpackagingsolutions.com>';

export const POST: APIRoute = async ({ request }) => {
  return handleQuoteRequest(request, {
    apiKey: import.meta.env.RESEND_API_KEY || (import.meta.env.SMTP_PASS ? 'smtp-configured' : ''),
    from: import.meta.env.SMTP_PASS
      ? import.meta.env.SMTP_FROM || import.meta.env.QUOTE_FROM_EMAIL || defaultQuoteSender
      : import.meta.env.RESEND_FROM || import.meta.env.QUOTE_FROM_EMAIL || defaultQuoteSender,
    to: import.meta.env.QUOTE_TO_EMAIL || defaultQuoteRecipient,
    sendEmail: import.meta.env.SMTP_PASS ? sendViaSmtp : sendQuoteEmail
  });
};

function sendViaSmtp(_apiKey: string, email: Parameters<typeof sendSmtpEmail>[1]) {
  return sendSmtpEmail(
    {
      host: import.meta.env.SMTP_HOST || 'smtp.hostinger.com',
      port: import.meta.env.SMTP_PORT || '465',
      username: import.meta.env.SMTP_USER || defaultQuoteRecipient,
      password: import.meta.env.SMTP_PASS,
      envelopeFrom: import.meta.env.SMTP_USER || defaultQuoteRecipient
    },
    email
  );
}
