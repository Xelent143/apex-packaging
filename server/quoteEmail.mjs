const RESEND_EMAILS_URL = 'https://api.resend.com/emails';
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

const FIELD_LABELS = {
  source: 'Source',
  product: 'Product',
  length: 'Length',
  width: 'Width',
  depth: 'Depth',
  unit: 'Unit',
  material: 'Material',
  printing: 'Printing',
  quantity: 'Quantity',
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  type: 'Project Type',
  details: 'Project Details',
  message: 'Message',
  attachmentNote: 'Attachment Delivery Note'
};

const INTERNAL_FIELDS = new Set(['redirectTo', 'website']);

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
    isSpam: Boolean(String(formData.get('website') || '').trim())
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
      isSpam: Boolean(String(body?.website || '').trim())
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
        <table style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table>
      </div>
    `,
    text: `New quote inquiry\nSource: ${submission.source}\n\n${textRows}`
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
  if (!options.apiKey) return jsonResponse({ error: 'Email service is not configured.' }, 503);

  const submission = await requestToQuoteSubmission(request);
  if (submission.isSpam) return redirectResponse('/thank-you');
  if (!isEmail(submission.fields.email || '')) return jsonResponse({ error: 'A valid email address is required.' }, 400);

  const email = buildQuoteEmail(submission, { from: options.from, to: options.to });
  try {
    await options.sendEmail(options.apiKey, email);
  } catch (error) {
    if (!email.attachments?.length) {
      await options.onDeliveryFailure?.(submission, error, email);
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
      } catch (fallbackError) {
        await options.onDeliveryFailure?.(submission, fallbackError, fallbackEmail);
      }
    }
  }

  const requestedRedirect = submission.redirectTo;
  return redirectResponse(isSafeRedirectPath(requestedRedirect) ? requestedRedirect : '/thank-you');
}

export function isSafeRedirectPath(value) {
  if (!value) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  return true;
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

function sanitizeFilename(value) {
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
