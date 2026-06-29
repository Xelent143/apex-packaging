import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildQuoteEmail,
  formDataToQuoteSubmission,
  handleQuoteRequest,
  isSafeRedirectPath
} from './quoteEmail.mjs';

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
  assert.match(email.text, /Home Quote Form/);
});

test('isSafeRedirectPath only allows same-site redirect paths', () => {
  assert.equal(isSafeRedirectPath('/thank-you'), true);
  assert.equal(isSafeRedirectPath('/?quote=sent#quote'), true);
  assert.equal(isSafeRedirectPath('https://bad.example'), false);
  assert.equal(isSafeRedirectPath('//bad.example'), false);
});

test('handleQuoteRequest sends email and redirects after success', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
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
    }
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/thank-you');
  assert.equal(sentEmail.to[0], 'sales@apexpackagingsolutions.com');
  assert.equal(sentEmail.reply_to, 'alex@example.com');
});

test('handleQuoteRequest records failed delivery and still redirects', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
  formData.set('redirectTo', '/thank-you');

  let failedSubmission;
  const request = new Request('https://example.com/api/quote', {
    method: 'POST',
    body: formData
  });

  const response = await handleQuoteRequest(request, {
    apiKey: 'test-key',
    from: 'Apex Packaging <sales@apexpackagingsolutions.com>',
    to: 'sales@apexpackagingsolutions.com',
    sendEmail: async () => {
      throw new Error('Provider rejected message');
    },
    onDeliveryFailure: async (submission, error) => {
      failedSubmission = { submission, error };
    }
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/thank-you');
  assert.equal(failedSubmission.submission.fields.email, 'alex@example.com');
  assert.match(failedSubmission.error.message, /Provider rejected message/);
});

test('handleQuoteRequest retries without attachments if the email provider rejects them', async () => {
  const formData = new FormData();
  formData.set('source', 'Contact Page');
  formData.set('name', 'Alex Buyer');
  formData.set('email', 'alex@example.com');
  formData.set('details', 'Need 500 boxes');
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
    }
  });

  assert.equal(response.status, 303);
  assert.equal(sentEmails.length, 2);
  assert.equal(sentEmails[0].attachments[0].filename, 'dieline.pdf');
  assert.equal(sentEmails[1].attachments, undefined);
  assert.match(sentEmails[1].text, /Attachment Delivery Note/);
  assert.match(sentEmails[1].text, /dieline.pdf/);
});
