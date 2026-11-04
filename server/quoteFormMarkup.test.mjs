import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const homepagePath = new URL('../src/pages/index.astro', import.meta.url);
const contactPath = new URL('../src/pages/contact.astro', import.meta.url);
const feedbackPath = new URL('../src/components/forms/QuoteFormFeedback.astro', import.meta.url);

test('homepage and contact forms align required and optional field markup', async () => {
  const [homepage, contact] = await Promise.all([
    readFile(homepagePath, 'utf8'),
    readFile(contactPath, 'utf8')
  ]);

  assert.match(homepage, /<input required[^>]+name="name"/);
  assert.match(homepage, /<input required[^>]+name="email"/);
  assert.match(homepage, /<textarea required[^>]+name="message"/);
  assert.match(homepage, /<input class="[^"]+" name="phone"[^>]+Contact Number \(Optional\)/);

  assert.match(contact, /<input required[^>]+name="name"/);
  assert.match(contact, /<input required[^>]+name="email"/);
  assert.match(contact, /<textarea\s+required[\s\S]+?name="details"/);
  assert.match(contact, /<input type="tel"[^>]+name="phone"[^>]+Contact Number \(Optional\)/);
});

test('both artwork controls expose file guidance and an accessible live warning', async () => {
  const [homepage, contact] = await Promise.all([
    readFile(homepagePath, 'utf8'),
    readFile(contactPath, 'utf8')
  ]);

  for (const page of [homepage, contact]) {
    assert.match(page, /PDF, AI, EPS, PNG, JPG, JPEG or WEBP\. Maximum 8 MB\./);
    assert.match(page, /data-max-bytes="8388608"/);
    assert.match(page, /data-supported-extensions="\.pdf,\.ai,\.eps,\.png,\.jpg,\.jpeg,\.webp"/);
    assert.match(page, /data-supported-mime-types=/);
    assert.match(page, /data-artwork-email=\{siteConfig\.email\}/);
    assert.match(page, /role="status" aria-live="polite" data-artwork-warning/);
  }
});

test('enhancement script prevents duplicate handlers and preserves explicit retry control', async () => {
  const feedback = await readFile(feedbackPath, 'utf8');

  assert.match(feedback, /if \(form\.dataset\.quoteEnhanced === 'true'\) continue/);
  assert.match(feedback, /if \(submissionInFlight\) return/);
  assert.match(feedback, /retry\.classList\.toggle\('hidden', outcome\.retryAllowed === false\)/);
  assert.match(feedback, /form\.requestSubmit\(\)/);
  assert.match(feedback, /email the artwork separately to \$\{artworkEmail\}/);
});
