import assert from 'node:assert/strict';
import { File } from 'node:buffer';
import { test } from 'node:test';
import {
  MAX_QUOTE_REQUEST_BYTES,
  buildQuoteEmail,
  formDataToQuoteSubmission,
  handleQuoteRequest,
  isSafeRedirectPath
} from './quoteEmail.mjs';

const correlationId = '00000000-0000-4000-8000-000000000001';
const createCorrelationId = () => correlationId;

test('formDataToQuoteSubmission extracts form fields and skips honeypot values', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('company', 'Example Co');
  formData.set('details', 'Need 500 rigid boxes');
  formData.set('website', '');

  const submission = await formDataToQuoteSubmission(formData);

  assert.equal(submission.source, 'Contact Page');
  assert.equal(submission.fields.name, 'Alex Buyer');
  assert.equal(submission.fields.email, 'alex@example.com');
  assert.equal(submission.fields.company, 'Example Co');
  assert.equal(submission.fields.details, 'Need 500 rigid boxes');
  assert.equal(submission.isSpam, false);
});

test('formDataToQuoteSubmission converts uploaded artwork into an email attachment', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 rigid boxes');
  formData.set('artwork', new File(['sample artwork'], 'dieline proof.pdf', { type: 'application/pdf' }));

  const submission = await formDataToQuoteSubmission(formData);
  const email = buildQuoteEmail(
    submission,
    {
      from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
      to: 'sales@apexpackagingsolutions.com'
    }
  );

  assert.equal(submission.files[0].name, 'dieline proof.pdf');
  assert.equal(email.attachments[0].filename, 'dieline proof.pdf');
  assert.equal(Buffer.from(email.attachments[0].content, 'base64').toString(), 'sample artwork');
  assert.match(email.text, /Uploaded Files: dieline proof.pdf/);
});

test('buildQuoteEmail escapes HTML and uses the client email as reply-to', () => {
  const email = buildQuoteEmail(
    {
      source: 'Home Quote Form',
      fields: {
        name: 'Ava <Buyer>',
        email: 'ava@example.com',
        phone: '+1 555 0100',
        city: 'Toronto',
        country: 'Canada',
        stateProvince: 'Ontario',
        shipmentAddress: '100 King St W',
        message: 'Need <strong>mailer boxes</strong>'
      },
      files: []
    },
    {
      from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
      to: 'sales@apexpackagingsolutions.com'
    }
  );

  assert.equal(email.to[0], 'sales@apexpackagingsolutions.com');
  assert.equal(email.from, 'Apex Packaging <sales@apexpackagingsolutions.com>');
  assert.equal(email.reply_to, 'ava@example.com');
  assert.equal(email.subject, 'New quote inquiry from Ava <Buyer>');
  assert.match(email.html, /Ava &lt;Buyer&gt;/);
  assert.match(email.html, /Need &lt;strong&gt;mailer boxes&lt;\/strong&gt;/);
  assert.match(email.html, /Shipment Address/);
  assert.match(email.text, /City: Toronto/);
  assert.match(email.text, /Country: Canada/);
  assert.match(email.text, /State \/ Province: Ontario/);
  assert.match(email.text, /Shipment Address: 100 King St W/);
  assert.match(email.text, /Home Quote Form/);
});

test('isSafeRedirectPath only allows same-site redirect paths', () => {
  assert.equal(isSafeRedirectPath('/thank-you'), true);
  assert.equal(isSafeRedirectPath('/?quote=sent#quote'), true);
  assert.equal(isSafeRedirectPath('https://bad.example'), false);
  assert.equal(isSafeRedirectPath('//bad.example'), false);
});

test('homepage quote follows the provider-accepted path and includes a correlation reference', async () => {
  const formData = new FormData();
  formData.set('source', 'Home Quote Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('message', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');

  let sentEmail;
  const request = new Request('https://example.com/api/quote', {
    method: 'POST',
    body: formData
  });

  const response = await handleQuoteRequest(request, {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async (_apiKey, email) => {
      sentEmail = email;
      return { id: 'email_123' };
    },
    createCorrelationId
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), `/thank-you?reference=${correlationId}`);
  assert.equal(sentEmail.to[0], 'sales@apexpackagingsolutions.com');
  assert.equal(sentEmail.reply_to, 'alex@example.com');
  assert.match(sentEmail.text, new RegExp(`Reference: ${correlationId}`));
});

test('handleQuoteRequest rejects submissions without human confirmation', async () => {
  const formData = new FormData();
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');

  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      throw new Error('Email should not be sent');
    },
    createCorrelationId
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    status: 'validation_failed',
    error: 'Please confirm that you are not a robot.',
    field: 'humanConfirmation',
    correlationId
  });
});

test('handleQuoteRequest returns JSON for the interactive RFQ flow', async () => {
  const formData = new FormData();
  formData.set('source', 'Interactive RFQ');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('product', 'Mailer Boxes');
  formData.set('finishes', 'Matte lamination');
  formData.append('finishes', 'Foil stamping');
  formData.set('postalCode', 'M5V 2T6');
  formData.set('humanConfirmation', 'confirmed');

  let sentEmail;
  const request = new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  });

  const response = await handleQuoteRequest(request, {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async (_apiKey, email) => {
      sentEmail = email;
      return { id: 'email_123' };
    },
    createCorrelationId
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    status: 'provider_accepted',
    message: 'Thank you. Your quote request has been submitted.',
    correlationId,
    attachmentOmitted: false,
    redirectTo: `/thank-you?reference=${correlationId}`
  });
  assert.match(sentEmail.text, /Finishes \/ Add-ons: Matte lamination, Foil stamping/);
  assert.match(sentEmail.text, /ZIP \/ Postal Code: M5V 2T6/);
});

test('contact quote shows a retryable failure outcome when the provider rejects delivery', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');

  let failureRecord;
  const request = new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  });

  const response = await handleQuoteRequest(request, {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      throw new Error('Provider rejected message');
    },
    onDeliveryFailure: async (failure) => {
      failureRecord = failure;
    },
    createCorrelationId
  });

  assert.equal(response.status, 502);
  const outcome = await response.json();
  assert.deepEqual(outcome, {
    ok: false,
    status: 'delivery_failed',
    error: 'We couldn’t submit your request. Please try again or contact us by email or phone.',
    correlationId
  });
  assert.deepEqual(failureRecord, {
    correlationId,
    stage: 'primary_delivery'
  });
  assert.doesNotMatch(JSON.stringify(outcome), /Provider rejected|alex@example\.com/);
  assert.doesNotMatch(JSON.stringify(failureRecord), /Provider rejected|alex@example\.com|fields/);
});

test('failed-delivery backup errors do not change the safe provider-failure response', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');

  const request = new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  });

  const response = await handleQuoteRequest(request, {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      throw new Error('Provider rejected message');
    },
    onDeliveryFailure: async () => {
      throw new Error('Backup path is not writable');
    },
    createCorrelationId
  });

  assert.equal(response.status, 502);
  assert.equal((await response.json()).status, 'delivery_failed');
});

test('handleQuoteRequest retries without attachments if the email provider rejects them', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');
  formData.set('artwork', new File(['sample artwork'], 'dieline.pdf', { type: 'application/pdf' }));

  const sentEmails = [];
  const request = new Request('https://example.com/api/quote', {
    method: 'POST',
    body: formData
  });

  const response = await handleQuoteRequest(request, {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async (_apiKey, email) => {
      sentEmails.push(email);
      if (email.attachments?.length) throw new Error('Provider rejected attachments');
      return { id: 'email_123' };
    },
    createCorrelationId
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), `/thank-you?reference=${correlationId}&artwork=omitted#artwork-omitted`);
  assert.equal(sentEmails.length, 2);
  assert.equal(sentEmails[0].attachments[0].filename, 'dieline.pdf');
  assert.equal(sentEmails[1].attachments, undefined);
  assert.match(sentEmails[1].text, /Attachment Delivery Note/);
  assert.match(sentEmails[1].text, /dieline.pdf/);
});

test('non-JavaScript provider failure returns an error page instead of a success redirect', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');

  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Referer: 'https://example.com/contact' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      throw new Error('Provider raw failure');
    },
    createCorrelationId
  });

  assert.equal(response.status, 502);
  assert.equal(response.headers.get('Location'), null);
  assert.match(response.headers.get('Content-Type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /We couldn’t submit your request\. Please try again or contact us by email or phone\./);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /mailto:sales@apexpackagingsolutions\.com/);
  assert.match(html, /tel:\+19055951634/);
  assert.doesNotMatch(html, /Provider raw failure|alex@example\.com/);
});

test('honeypot rejection does not send email or create an accepted or failure record', async () => {
  const formData = new FormData();
  formData.set('source', 'Home Quote Form');
  formData.set('name', 'Automated Submitter');
  formData.set('email', 'bot@example.com');
  formData.set('website', 'https://spam.example');
  formData.set('humanConfirmation', 'confirmed');

  let sendCalled = false;
  let failureRecordCalled = false;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      sendCalled = true;
    },
    onDeliveryFailure: async () => {
      failureRecordCalled = true;
    },
    createCorrelationId
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    status: 'rejected',
    error: 'We could not process this request. Please review the form and try again, or contact Apex directly.',
    correlationId
  });
  assert.equal(sendCalled, false);
  assert.equal(failureRecordCalled, false);
});

test('invalid contact-form email remains a validation outcome and is not sent', async () => {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'not-an-email');
  formData.set('humanConfirmation', 'confirmed');

  let sendCalled = false;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      sendCalled = true;
    },
    createCorrelationId
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    status: 'validation_failed',
    error: 'Enter a valid email address.',
    field: 'email',
    correlationId
  });
  assert.equal(sendCalled, false);
});

test('homepage and contact submissions require their visible project-details fields but not phone', async () => {
  for (const testCase of [
    { source: 'Home Quote Form', requiredField: 'message' },
    { source: 'Request Quote Contact Form', requiredField: 'details' }
  ]) {
    const formData = new FormData();
    formData.set('source', testCase.source);
    formData.set('name', 'Alex Buyer');
    formData.set('email', 'alex@example.com');
    formData.set('humanConfirmation', 'confirmed');

    let sendCalled = false;
    const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    }), {
      apiKey: 'test-key',
      from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
      to: 'sales@apexpackagingsolutions.com',
      sendEmail: async () => {
        sendCalled = true;
      },
      createCorrelationId
    });

    assert.equal(response.status, 400);
    assert.equal((await response.json()).field, testCase.requiredField);
    assert.equal(sendCalled, false);
  }
});

test('oversized artwork is omitted with disclosure and the non-JavaScript quote still submits', async () => {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');
  formData.set('artwork', new File([
    new Uint8Array((8 * 1024 * 1024) + 1)
  ], 'large-dieline.pdf', { type: 'application/pdf' }));

  let sentEmail;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async (_apiKey, email) => {
      sentEmail = email;
      return { id: 'email_oversized' };
    },
    createCorrelationId
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), `/thank-you?reference=${correlationId}&artwork=omitted#artwork-omitted`);
  assert.equal(sentEmail.attachments, undefined);
  assert.match(sentEmail.text, /Attachment Delivery Note/);
  assert.match(sentEmail.text, /large-dieline.pdf \(8\.0 MB\) - File is larger than 8\.0 MB and was not attached/);
});

test('unsupported artwork is omitted with explicit JSON disclosure', async () => {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('redirectTo', '/thank-you');
  formData.set('artwork', new File(['archive'], 'artwork.zip', { type: 'application/zip' }));

  let sentEmail;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async (_apiKey, email) => {
      sentEmail = email;
      return { id: 'email_unsupported' };
    },
    createCorrelationId
  });

  assert.equal(response.status, 200);
  const outcome = await response.json();
  assert.equal(outcome.attachmentOmitted, true);
  assert.equal(outcome.redirectTo, `/thank-you?reference=${correlationId}&artwork=omitted#artwork-omitted`);
  assert.equal(sentEmail.attachments, undefined);
  assert.match(sentEmail.text, /Unsupported file type/);
});

test('declared oversized request bodies are rejected before provider delivery', async () => {
  let sendCalled = false;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': String(MAX_QUOTE_REQUEST_BYTES + 1)
    },
    body: '{}'
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      sendCalled = true;
    },
    createCorrelationId
  });

  assert.equal(response.status, 413);
  assert.equal((await response.json()).status, 'request_too_large');
  assert.equal(sendCalled, false);
});

test('chunked oversized request bodies are rejected while streaming', async () => {
  let chunksSent = 0;
  const body = new ReadableStream({
    pull(controller) {
      if (chunksSent >= 11) {
        controller.close();
        return;
      }
      chunksSent += 1;
      controller.enqueue(new Uint8Array(1024 * 1024));
    }
  });
  let sendCalled = false;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/octet-stream'
    },
    body,
    duplex: 'half'
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      sendCalled = true;
    },
    createCorrelationId
  });

  assert.equal(response.status, 413);
  assert.equal((await response.json()).status, 'request_too_large');
  assert.equal(sendCalled, false);
  assert.ok(chunksSent <= 11);
});

test('malformed or unsupported request bodies receive a controlled rejection', async () => {
  let sendCalled = false;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/octet-stream'
    },
    body: 'not form data'
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      sendCalled = true;
    },
    createCorrelationId
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    status: 'invalid_request',
    error: 'We could not read your request. Please review the form and try again, or contact Apex directly.',
    correlationId,
    retryAllowed: true
  });
  assert.equal(sendCalled, false);
});

test('provider timeout is reported as uncertain without an automatic retry', async () => {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');

  let sendCount = 0;
  let providerAborted = false;
  let failureRecord;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async (_apiKey, _email, operation) => {
      sendCount += 1;
      return new Promise((_resolve, reject) => {
        operation.signal.addEventListener('abort', () => {
          providerAborted = true;
          reject(new Error('Mock provider aborted'));
        }, { once: true });
      });
    },
    providerTimeoutMs: 5,
    minimumProviderTimeoutMs: 1,
    onDeliveryFailure: async (record) => {
      failureRecord = record;
    },
    createCorrelationId
  });

  assert.equal(response.status, 504);
  assert.deepEqual(await response.json(), {
    ok: false,
    status: 'delivery_uncertain',
    error: 'We couldn’t confirm whether your request was submitted. Please contact us by email or phone and provide the reference below before trying again.',
    correlationId,
    retryAllowed: false
  });
  assert.equal(sendCount, 1);
  assert.equal(providerAborted, true);
  assert.deepEqual(failureRecord, { correlationId, stage: 'provider_timeout_unknown' });
});

test('an attachment provider timeout does not trigger a possibly duplicate fallback send', async () => {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');
  formData.set('artwork', new File(['artwork'], 'dieline.pdf', { type: 'application/pdf' }));

  let sendCount = 0;
  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      sendCount += 1;
      return new Promise(() => {});
    },
    providerTimeoutMs: 5,
    minimumProviderTimeoutMs: 1,
    createCorrelationId
  });

  assert.equal(response.status, 504);
  assert.equal((await response.json()).status, 'delivery_uncertain');
  assert.equal(sendCount, 1);
});

test('non-JavaScript timeout response prevents an uncertain retry', async () => {
  const formData = new FormData();
  formData.set('source', 'Request Quote Contact Form');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('humanConfirmation', 'confirmed');

  const response = await handleQuoteRequest(new Request('https://example.com/api/quote', {
    method: 'POST',
    headers: { Referer: 'https://example.com/contact' },
    body: formData
  }), {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => new Promise(() => {}),
    providerTimeoutMs: 5,
    minimumProviderTimeoutMs: 1,
    createCorrelationId
  });

  assert.equal(response.status, 504);
  const html = await response.text();
  assert.match(html, /couldn’t confirm whether your request was submitted/);
  assert.doesNotMatch(html, /Return to the form and try again/);
  assert.match(html, new RegExp(correlationId));
});
