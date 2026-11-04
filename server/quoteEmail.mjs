import { createHash, randomUUID } from 'node:crypto';
import { nextRetryAt, safeErrorDetails } from './deliveryPolicy.mjs';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';
export const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
export const MAX_QUOTE_REQUEST_BYTES = 10 * 1024 * 1024;
export const DEFAULT_PROVIDER_TIMEOUT_MS = 15_000;
const DELIVERY_FAILURE_MESSAGE = 'We couldn’t submit your request. Please try again or contact us by email or phone.';
const DELIVERY_UNCERTAIN_MESSAGE = 'We couldn’t confirm whether your request was submitted. Please contact us by email or phone and provide the reference below before trying again.';
const REQUEST_TOO_LARGE_MESSAGE = 'Your request is too large to submit. Artwork must be 8 MB or smaller. Please remove the file and try again, or email the artwork separately.';
const INVALID_REQUEST_MESSAGE = 'We could not read your request. Please review the form and try again, or contact Apex directly.';
const REJECTION_MESSAGE = 'We could not process this request. Please review the form and try again, or contact Apex directly.';
const SUBMISSION_SUCCESS_MESSAGE = 'Thank you. Your quote request has been submitted.';
const SUPPORTED_ARTWORK_EXTENSIONS = new Set(['.pdf', '.ai', '.eps', '.png', '.jpg', '.jpeg', '.webp']);
const SUPPORTED_ARTWORK_MIME_TYPES = new Set([
  '',
  'application/octet-stream',
  'application/pdf',
  'application/postscript',
  'application/illustrator',
  'application/vnd.adobe.illustrator',
  'application/x-illustrator',
  'image/x-eps',
  'image/png',
  'image/jpeg',
  'image/pjpeg',
  'image/webp'
]);

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
  const limitedRequest = await readLimitedRequest(request, MAX_QUOTE_REQUEST_BYTES);
  const contentType = limitedRequest.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const body = await limitedRequest.json();
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

    return formDataToQuoteSubmission(await limitedRequest.formData());
  } catch (error) {
    if (error instanceof QuoteRequestError) throw error;
    throw new QuoteRequestError(400, 'invalid_request', INVALID_REQUEST_MESSAGE);
  }
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

export async function sendQuoteEmail(apiKey, email, operation = {}) {
  const response = await fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(operation.idempotencyKey ? { 'Idempotency-Key': operation.idempotencyKey } : {})
    },
    body: JSON.stringify(email),
    signal: operation.signal
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Resend email failed with ${response.status}: ${body}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function handleQuoteRequest(request, options) {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const correlationId = options.createCorrelationId?.() || randomUUID();
  if (!options.apiKey && !options.enquiryStore) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'delivery_failed',
      error: DELIVERY_FAILURE_MESSAGE,
      correlationId
    }, 503, options);
  }

  let submission;
  try {
    submission = await requestToQuoteSubmission(request);
  } catch (error) {
    if (!(error instanceof QuoteRequestError)) throw error;
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: error.outcomeStatus,
      error: error.publicMessage,
      correlationId,
      retryAllowed: true
    }, error.httpStatus, options);
  }
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

  if (!submission.fields.name) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'validation_failed',
      error: 'Enter your name.',
      field: 'name',
      correlationId
    }, 400, options);
  }

  const requiredDetailsField = requiredProjectDetailsField(submission.source);
  if (requiredDetailsField && !submission.fields[requiredDetailsField]) {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'validation_failed',
      error: 'Tell us briefly what packaging you need.',
      field: requiredDetailsField,
      correlationId
    }, 400, options);
  }

  const skippedFiles = submission.files.filter((file) => file.skipped);
  if (skippedFiles.length) {
    submission.fields.attachmentNote = 'The customer submitted the quote request without the artwork file. Ask them to email it separately and match it using the reference.';
  }
  const email = buildQuoteEmail(submission, { from: options.from, to: options.to });
  if (options.enquiryStore) {
    return handleDurableQuoteRequest(request, wantsJson, submission, email, skippedFiles, options);
  }
  let providerAccepted = false;
  let attachmentOmitted = skippedFiles.length > 0;
  try {
    await sendEmailWithTimeout(options, email);
    providerAccepted = true;
  } catch (error) {
    if (error instanceof ProviderTimeoutError) {
      await safeRecordDeliveryFailure(options, {
        correlationId,
        stage: 'provider_timeout_unknown'
      });
      return outcomeResponse(request, wantsJson, {
        ok: false,
        status: 'delivery_uncertain',
        error: DELIVERY_UNCERTAIN_MESSAGE,
        correlationId,
        retryAllowed: false
      }, 504, options);
    }
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
        await sendEmailWithTimeout(options, fallbackEmail);
        providerAccepted = true;
        attachmentOmitted = true;
      } catch (fallbackError) {
        if (fallbackError instanceof ProviderTimeoutError) {
          await safeRecordDeliveryFailure(options, {
            correlationId,
            stage: 'attachment_fallback_timeout_unknown'
          });
          return outcomeResponse(request, wantsJson, {
            ok: false,
            status: 'delivery_uncertain',
            error: DELIVERY_UNCERTAIN_MESSAGE,
            correlationId,
            retryAllowed: false
          }, 504, options);
        }
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

async function handleDurableQuoteRequest(request, wantsJson, submission, email, skippedFiles, options) {
  const originalCorrelationId = submission.correlationId;
  const hasAttachment = Boolean(email.attachments?.length);
  const initialArtworkStatus = skippedFiles.length
    ? 'omitted'
    : hasAttachment ? (options.apiKey ? 'received_ephemeral' : 'omitted') : 'none';
  const retryEmail = hasAttachment
    ? buildQuoteEmail({
        ...submission,
        fields: {
          ...submission.fields,
          attachmentNote: 'The enquiry was recorded, but artwork delivery was not confirmed. Ask the customer to email the file separately and match it using the reference.'
        },
        files: submission.files.map(({ content, ...file }) => file)
      }, { from: options.from, to: options.to })
    : email;

  let record;
  try {
    record = await options.enquiryStore.recordEnquiry({
      correlationId: originalCorrelationId,
      submissionKey: request.headers.get('idempotency-key')
        || createFallbackSubmissionKey(options.submissionSessionId, submission),
      submission,
      deliveryEmail: retryEmail,
      provider: options.providerName || 'configured_email_provider',
      artworkStatus: initialArtworkStatus,
      maxAttempts: options.maxDeliveryAttempts || 5,
      retentionDueAt: options.retentionDueAt?.(submission) || null
    });
  } catch {
    return outcomeResponse(request, wantsJson, {
      ok: false,
      status: 'storage_failed',
      error: DELIVERY_FAILURE_MESSAGE,
      correlationId: originalCorrelationId,
      retryAllowed: true
    }, 503, options);
  }

  const correlationId = record.correlationId;
  if (record.duplicate) {
    return durableSuccessResponse(request, wantsJson, submission, correlationId, {
      attachmentState: artworkResponseState(record.artworkStatus)
    });
  }

  if (!options.apiKey) {
    return durableSuccessResponse(request, wantsJson, submission, correlationId, {
      attachmentState: artworkResponseState(initialArtworkStatus)
    });
  }

  try {
    const started = await options.enquiryStore.startDelivery?.({
      jobId: record.jobId,
      workerId: `request-${correlationId}`,
      leaseMs: Number(options.deliveryLeaseMs || 60_000),
      now: new Date()
    });
    if (started === false) {
      return durableSuccessResponse(request, wantsJson, submission, correlationId, {
        attachmentState: artworkResponseState(initialArtworkStatus)
      });
    }
  } catch {
    return durableSuccessResponse(request, wantsJson, submission, correlationId, {
      attachmentState: artworkResponseState(initialArtworkStatus)
    });
  }

  const startedAt = new Date();
  let providerResult;
  try {
    providerResult = await sendEmailWithTimeout({
      ...options,
      idempotencyKey: record.deliveryIdempotencyKey || `quote/${record.jobId}/v1`
    }, email);
  } catch (error) {
    const details = safeErrorDetails(error);
    const finishedAt = new Date();
    if (error instanceof ProviderTimeoutError) {
      await safeDurableStatusUpdate(options, correlationId, () => options.enquiryStore.markUncertain({
          jobId: record.jobId,
          ...details,
          artworkStatus: hasAttachment ? 'delivery_unconfirmed' : initialArtworkStatus,
          startedAt,
          finishedAt
        }));
      return durableSuccessResponse(request, wantsJson, submission, correlationId, {
        attachmentState: hasAttachment ? 'unconfirmed' : artworkResponseState(initialArtworkStatus)
      });
    }

    const retryAt = details.errorClass === 'provider_permanent_rejection'
      ? null
      : nextRetryAt(1, finishedAt);
    if (retryAt) {
      await safeDurableStatusUpdate(options, correlationId, () => options.enquiryStore.markRetry({
        jobId: record.jobId,
        ...details,
        nextAttemptAt: retryAt,
        artworkStatus: hasAttachment ? 'omitted' : initialArtworkStatus,
        startedAt,
        finishedAt
      }));
    } else {
      await safeDurableStatusUpdate(options, correlationId, () => options.enquiryStore.markFailed({
        jobId: record.jobId,
        ...details,
        artworkStatus: hasAttachment ? 'omitted' : initialArtworkStatus,
        startedAt,
        finishedAt
      }));
    }
    return durableSuccessResponse(request, wantsJson, submission, correlationId, {
      attachmentState: hasAttachment ? 'omitted' : artworkResponseState(initialArtworkStatus)
    });
  }

  const acceptedUpdateSucceeded = await safeDurableStatusUpdate(
    options,
    correlationId,
    () => options.enquiryStore.markAccepted({
      jobId: record.jobId,
      providerMessageId: providerResult?.id || null,
      artworkStatus: hasAttachment ? 'provider_accepted' : initialArtworkStatus,
      startedAt,
      finishedAt: new Date()
    })
  );
  return durableSuccessResponse(request, wantsJson, submission, correlationId, {
    status: acceptedUpdateSucceeded ? 'provider_accepted' : 'enquiry_recorded',
    attachmentState: skippedFiles.length ? 'omitted' : null
  });
}

export function createFallbackSubmissionKey(sessionId, submission) {
  const normalizedSessionId = String(sessionId || '').trim();
  if (!/^[a-zA-Z0-9-]{20,128}$/.test(normalizedSessionId)) return null;
  const fields = Object.fromEntries(
    Object.entries(submission?.fields || {})
      .filter(([key]) => key !== 'attachmentNote')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)])
  );
  const fingerprint = createHash('sha256')
    .update(JSON.stringify({ sessionId: normalizedSessionId, source: submission?.source || '', fields }))
    .digest('hex');
  return `quote/nonjs/${fingerprint}`;
}

async function safeDurableStatusUpdate(options, correlationId, operation) {
  try {
    await operation();
    return true;
  } catch {
    options.logDeliveryStateFailure?.(correlationId);
    return false;
  }
}

function durableSuccessResponse(request, wantsJson, submission, correlationId, options = {}) {
  const requestedRedirect = submission.redirectTo;
  const redirectTarget = addReferenceToPath(
    isSafeRedirectPath(requestedRedirect) ? requestedRedirect : '/thank-you',
    correlationId,
    options.attachmentState
  );
  if (wantsJson) {
    return jsonResponse({
      ok: true,
      status: options.status || 'enquiry_recorded',
      message: SUBMISSION_SUCCESS_MESSAGE,
      correlationId,
      attachmentOmitted: options.attachmentState === 'omitted',
      artworkDeliveryUnconfirmed: options.attachmentState === 'unconfirmed',
      redirectTo: redirectTarget
    }, 200);
  }
  return redirectResponse(redirectTarget);
}

function artworkResponseState(artworkStatus) {
  if (artworkStatus === 'omitted') return 'omitted';
  if (artworkStatus === 'delivery_unconfirmed') return 'unconfirmed';
  return null;
}

export function isSafeRedirectPath(value) {
  if (!value) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  return true;
}

function addReferenceToPath(path, correlationId, attachmentState = null) {
  const url = new URL(path, 'https://apex.invalid');
  url.searchParams.set('reference', correlationId);
  const normalizedArtworkState = attachmentState === true ? 'omitted' : attachmentState;
  if (normalizedArtworkState === 'omitted' || normalizedArtworkState === 'unconfirmed') {
    url.searchParams.set('artwork', normalizedArtworkState);
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
  const retryLink = body.retryAllowed === false
    ? ''
    : `<p><a href="${escapeHtml(retryPath)}">Return to the form and try again</a></p>`;

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
      ${retryLink}
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

  if (!isSupportedArtworkFile(attachment)) {
    attachment.skipped = 'Unsupported file type. Supported artwork files are PDF, AI, EPS, PNG, JPG, JPEG, and WEBP.';
    return attachment;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  attachment.content = bytes.toString('base64');
  return attachment;
}

async function readLimitedRequest(request, maxBytes) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new QuoteRequestError(413, 'request_too_large', REQUEST_TOO_LARGE_MESSAGE);
  }

  if (!request.body) return request;

  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel('Quote request exceeds the allowed size.');
        throw new QuoteRequestError(413, 'request_too_large', REQUEST_TOO_LARGE_MESSAGE);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total);
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body
  });
}

export async function sendEmailWithTimeout(options, email) {
  const timeoutMs = normalizeProviderTimeout(
    options.providerTimeoutMs,
    options.minimumProviderTimeoutMs
  );
  const controller = new AbortController();
  let timer;
  const providerOperation = Promise.resolve().then(() => options.sendEmail(
    options.apiKey,
    email,
    { signal: controller.signal, timeoutMs, idempotencyKey: options.idempotencyKey }
  ));
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new ProviderTimeoutError());
      controller.abort();
    }, timeoutMs);
  });

  try {
    return await Promise.race([providerOperation, deadline]);
  } finally {
    clearTimeout(timer);
  }
}

function normalizeProviderTimeout(value, minimum = 5_000) {
  const timeout = Number(value || DEFAULT_PROVIDER_TIMEOUT_MS);
  if (!Number.isFinite(timeout)) return DEFAULT_PROVIDER_TIMEOUT_MS;
  return Math.min(Math.max(timeout, Math.max(1, Number(minimum) || 5_000)), 30_000);
}

function requiredProjectDetailsField(source) {
  if (source === 'Home Quote Form') return 'message';
  if (source === 'Request Quote Contact Form') return 'details';
  return '';
}

function isSupportedArtworkFile(file) {
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
  return SUPPORTED_ARTWORK_EXTENSIONS.has(extension)
    && SUPPORTED_ARTWORK_MIME_TYPES.has(file.type.toLowerCase());
}

class QuoteRequestError extends Error {
  constructor(httpStatus, outcomeStatus, publicMessage) {
    super(outcomeStatus);
    this.httpStatus = httpStatus;
    this.outcomeStatus = outcomeStatus;
    this.publicMessage = publicMessage;
  }
}

export class ProviderTimeoutError extends Error {
  constructor() {
    super('provider_timeout');
    this.name = 'ProviderTimeoutError';
  }
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
