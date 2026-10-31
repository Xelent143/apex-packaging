import { randomUUID } from 'node:crypto';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const DELIVERY_FAILURE_MESSAGE = 'We couldn’t submit your request. Please try again or contact us by email or phone.';
const REJECTION_MESSAGE = 'We could not process this request. Please review the form and try again, or contact Apex directly.';
const SUBMISSION_SUCCESS_MESSAGE = 'Thank you. Your quote request has been submitted.';

const FIELD_LABELS = {
  source: 'Source',
  product: 'Product',
  length: 'Length',
  width: 'Width',
  depth: 'Depth',
  unit: 'Unit',
  material: 'Material',
  printing: 'Printing',
  finishes: 'Finishes / Add-ons',
  productContents: 'Product / Contents',
  quantity: 'Quantity',
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  city: 'City',
  country: 'Country',
  postalCode: 'ZIP / Postal Code',
  privacyConsent: 'Privacy Consent',
  stateProvince: 'State / Province',
  shipmentAddress: 'Shipment Address',
  type: 'Project Type',
  details: 'Project Details',
  message: 'Message',
  attachmentNote: 'Attachment Delivery Note'
};

const INTERNAL_FIELDS = new Set(['redirectTo', 'website', 'humanConfirmation']);

export async function formDataToQuoteSubmission(formData) {
  const fields = {};
  const files = [];

  for (const [key, value] of formData.entries()) {
    if (INTERNAL_FIELDS.has(key)) continue;

    if (isFormFile(value)) {
      if (value.name) files.push(await fileToEmailAttachment(key, value));
      continue;
    }

    const text = String(value).trim();
    if (!text) continue;

    if (fields[key]) fields[key] = `${fields[key]}, ${text}`;
    else fields[key] = text;
  }

  return {
    source: fields.source || 'Website Quote Form',
    fields,
    files,
    redirectTo: String(formData.get('redirectTo') || ''),
    isSpam: Boolean(String(formData.get('website') || '').trim()),
    isHumanConfirmed: String(formData.get('humanConfirmation') || '') === 'confirmed'
  };
}

export async function requestToQuoteSubmission(request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    const fields = {};
    for (const [key, value] of Object.entries(body || {})) {
      if (INTERNAL_FIELDS.has(key) || value == null) continue;
      const text = String(value).trim();
      if (text) fields[key] = text;
    }
    return {
      source: fields.source || 'Website Quote Form',
      fields,
      files: [],
      redirectTo: String(body?.redirectTo || ''),
      isSpam: Boolean(String(body?.website || '').trim()),
      isHumanConfirmed: String(body?.humanConfirmation || '') === 'confirmed'
    };
  }

  return formDataToQuoteSubmission(await request.formData());
}

export function buildQuoteEmail(submission, options) {
  const rows = Object.entries(submission.fields)
    .filter(([key]) => key !== 'source')
    .map(([key, value]) => ({
      label: FIELD_LABELS[key] || humanizeFieldName(key),
      value
    }));

  if (submission.files.length) {
    rows.push({
      label: 'Uploaded Files',
      value: submission.files.map(formatUploadedFileSummary).join(', ')
    });
  }

  const clientName = submission.fields.name || 'Website visitor';
  const clientEmail = submission.fields.email || '';
  const subject = `New quote inquiry from ${clientName}`;
  const referenceHtml = submission.correlationId
    ? `<p style="margin:0 0 16px;"><strong>Reference:</strong> ${escapeHtml(submission.correlationId)}</p>`
    : '';
  const referenceText = submission.correlationId ? `Reference: ${submission.correlationId}\n` : '';

  const htmlRows = rows
    .map(({ label, value }) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:700;background:#f7f7f7;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border:1px solid #e5e5e5;">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
      </tr>
    `)
    .join('');

  const textRows = rows.map(({ label, value }) => `${label}: ${value}`).join('\n');
  const email = {
    from: options.from,
    to: [options.to],
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;color:#171717;line-height:1.5;">
        <h2 style="margin:0 0 12px;">New quote inquiry</h2>
        <p style="margin:0 0 16px;"><strong>Source:</strong> ${escapeHtml(submission.source)}</p>
        ${referenceHtml}
        <table style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table>
      </div>
    `,
    text: `New quote inquiry\nSource: ${submission.source}\n${referenceText}\n${textRows}`
  };

  if (isEmail(clientEmail)) email.reply_to = clientEmail;
  const attachments = submission.files
    .filter((file) => file.content)
    .map((file) => ({
      filename: file.name,
      content: file.content
    }));
  if (attachments.length) email.attachments = attachments;

  return email;
}

export async function sendQuoteEmail(apiKey, email) {
  const response = await fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed with ${response.status}: ${body}`);
  }

  return response.json();
}

export async function handleQuoteRequest(request, options) {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const correlationId = options.createCorrelationId?.() || randomUUID();
  if (!options.apiKey) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'delivery_failed',
      error: DELIVERY_FAILURE_MESSAGE,
      correlationId
    }, 503, options);
  }

  const submission = await requestToQuoteSubmission(request);
  submission.correlationId = correlationId;
  if (submission.isSpam) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'rejected',
      error: REJECTION_MESSAGE,
      correlationId
    }, 400, options);
  }
  if (!submission.isHumanConfirmed) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'validation_failed',
      error: 'Please confirm that you are not a robot.',
      field: 'humanConfirmation',
      correlationId
    }, 400, options);
  }
  if (!isEmail(submission.fields.email || '')) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'validation_failed',
      error: 'Enter a valid email address.',
      field: 'email',
      correlationId
    }, 400, options);
  }

  const email = buildQuoteEmail(submission, { from: options.from, to: options.to });
  let providerAccepted = false;
  let attachmentOmitted = false;
  try {
    await options.sendEmail(options.apiKey, email);
    providerAccepted = true;
  } catch {
    if (!email.attachments?.length) {
      await safeRecordDeliveryFailure(options, {
        correlationId,
        stage: 'primary_delivery'
      });
    } else {
      const fallbackEmail = buildQuoteEmail(
        {
          ...submission,
          fields: {
            ...submission.fields,
            attachmentNote: 'One or more uploaded files were received but could not be attached to this email. Ask the customer to reply with the file if it is not visible.'
          },
          files: submission.files.map(({ content, ...file }) => file)
        },
        { from: options.from, to: options.to }
      );
      try {
        await options.sendEmail(options.apiKey, fallbackEmail);
        providerAccepted = true;
        attachmentOmitted = true;
      } catch {
        await safeRecordDeliveryFailure(options, {
          correlationId,
          stage: 'attachment_fallback_delivery'
        });
      }
    }
  }

  if (!providerAccepted) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'delivery_failed',
      error: DELIVERY_FAILURE_MESSAGE,
      correlationId
    }, 502, options);
  }

  const requestedRedirect = submission.redirectTo;
  const redirectTarget = addReferenceToPath(
    isSafeRedirectPath(requestedRedirect) ? requestedRedirect : '/thank-you',
    correlationId,
    attachmentOmitted
  );
  if (wantsJson) {
    return jsonResponse({
      ok: true,
      status: 'provider_accepted',
      message: SUBMISSION_SUCCESS_MESSAGE,
      correlationId,
      attachmentOmitted,
      redirectTo: redirectTarget
    }, 200);
  }
  return redirectResponse(redirectTarget);
}

export function isSafeRedirectPath(value) {
  if (!value) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  return true;
}

function addReferenceToPath(path, correlationId, attachmentOmitted = false) {
  const url = new URL(path, 'https://apex.invalid');
  url.searchParams.set('reference', correlationId);
  if (attachmentOmitted) {
    url.searchParams.set('artwork', 'omitted');
    url.hash = 'artwork-omitted';
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

function outcomeResponse(request, wantsJson, body, status, options) {
  if (wantsJson) return jsonResponse(body, status);
  return htmlOutcomeResponse(request, body, status, options);
}

function htmlOutcomeResponse(request, body, status, options) {
  const retryPath = getSafeRetryPath(request);
  const contactEmail = options.contactEmail || 'sales@apexpackagingsolutions.com';
  const contactPhone = options.contactPhone || '905 595 1634';
  const contactPhoneHref = options.contactPhoneHref || 'tel:+19055951634';
  const title = body.status === 'validation_failed' ? 'Check your quote request' : 'Quote request not submitted';
  const message = escapeHtml(body.error || DELIVERY_FAILURE_MESSAGE);
  const reference = escapeHtml(body.correlationId || '');

  return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${escapeHtml(title)} — Apex Packaging Solutions</title>
  </head>
  <body style="font-family:Arial,sans-serif;max-width:44rem;margin:4rem auto;padding:0 1.25rem;line-height:1.6;color:#171717;">
    <main>
      <h1>${escapeHtml(title)}</h1>
      <p>${message}</p>
      <p><small>Reference: ${reference}</small></p>
      <p><a href="${escapeHtml(retryPath)}">Return to the form and try again</a></p>
      <p>Contact Apex directly at <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a> or <a href="${escapeHtml(contactPhoneHref)}">${escapeHtml(contactPhone)}</a>.</p>
    </main>
  </body>
</html>`, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function getSafeRetryPath(request) {
  const fallback = '/contact';
  const referer = request.headers.get('referer');
  if (!referer) return fallback;
  try {
    const requestUrl = new URL(request.url);
    const refererUrl = new URL(referer);
    if (requestUrl.origin !== refererUrl.origin) return fallback;
    if (!['/', '/contact'].includes(refererUrl.pathname)) return fallback;
    return `${refererUrl.pathname}${refererUrl.hash}`;
  } catch {
    return fallback;
  }
}

async function safeRecordDeliveryFailure(options, failure) {
  try {
    await options.onDeliveryFailure?.(failure);
  } catch {
    console.error(`Quote delivery failure backup failed [${failure.correlationId}]`);
  }
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
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

function humanizeFieldName(key) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function isFormFile(value) {
  return value && typeof value === 'object' && typeof value.arrayBuffer === 'function' && 'name' in value && 'size' in value;
}

async function fileToEmailAttachment(field, file) {
  const attachment = {
    field,
    name: sanitizeFilename(file.name || 'uploaded-file'),
    size: Number(file.size || 0),
    type: String(file.type || '')
  };

  if (!attachment.size) return attachment;

  if (attachment.size > MAX_ATTACHMENT_BYTES) {
    attachment.skipped = `File is larger than ${formatBytes(MAX_ATTACHMENT_BYTES)} and was not attached.`;
    return attachment;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  attachment.content = bytes.toString('base64');
  return attachment;
}

function formatUploadedFileSummary(file) {
  const base = `${file.name} (${formatBytes(file.size)})`;
  return file.skipped ? `${base} - ${file.skipped}` : base;
}

export function sanitizeFilename(value) {
  return String(value).replace(/[^\w.\- ()]/g, '_').slice(0, 160) || 'uploaded-file';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}
