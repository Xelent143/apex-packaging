import assert from 'node:assert/strict';
import test from 'node:test';
import { permanentRedirects, redirectedSitemapPaths } from '../redirects.mjs';

const retainedBakeryArticle = '/blog/bakery-packaging-boxes-for-fresh-and-frozen-programs-2026-09-04';
const retiredBakeryArticles = [
  '/blog/bakery-packaging-boxes-for-fresh-and-frozen-programs-material-selection-guide-2026-10-04',
  '/blog/bakery-packaging-boxes-for-fresh-and-frozen-programs-procurement-checklist-2026-08-05',
  '/blog/bakery-packaging-boxes-for-fresh-and-frozen-programs-shipping-and-damage-guide-2026-11-03'
];

test('D02 bakery duplicates redirect directly to the retained article', () => {
  for (const path of retiredBakeryArticles) {
    assert.equal(permanentRedirects.get(path), retainedBakeryArticle);
    assert.equal(redirectedSitemapPaths.has(path), true);
  }

  assert.equal(permanentRedirects.has(retainedBakeryArticle), false);
});

const retainedCorrugatedArticle = '/blog/corrugated-shipping-boxes-for-heavy-ecommerce-orders-2026-09-14';
const retiredCorrugatedArticles = [
  '/blog/corrugated-shipping-boxes-for-heavy-ecommerce-orders-cost-and-moq-guide-2026-08-15',
  '/blog/corrugated-shipping-boxes-for-heavy-ecommerce-orders-procurement-checklist-2026-07-16',
  '/blog/corrugated-shipping-boxes-for-heavy-ecommerce-orders-shipping-and-damage-guide-2026-10-14'
];

test('D04 corrugated duplicates redirect directly to the retained article', () => {
  for (const path of retiredCorrugatedArticles) {
    assert.equal(permanentRedirects.get(path), retainedCorrugatedArticle);
    assert.equal(redirectedSitemapPaths.has(path), true);
  }

  assert.equal(permanentRedirects.has(retainedCorrugatedArticle), false);
});

const retainedSubscriptionMailerArticle = '/blog/custom-mailer-boxes-for-subscription-brands-2026-09-12';
const retiredSubscriptionMailerArticles = [
  '/blog/custom-mailer-boxes-for-subscription-brands-cost-and-moq-guide-2026-08-13',
  '/blog/custom-mailer-boxes-for-subscription-brands-procurement-checklist-2026-07-14',
  '/blog/custom-mailer-boxes-for-subscription-brands-shipping-and-damage-guide-2026-10-12'
];

test('D08 subscription-mailer duplicates redirect directly to the retained article', () => {
  for (const path of retiredSubscriptionMailerArticles) {
    assert.equal(permanentRedirects.get(path), retainedSubscriptionMailerArticle);
    assert.equal(redirectedSitemapPaths.has(path), true);
  }

  assert.equal(permanentRedirects.has(retainedSubscriptionMailerArticle), false);
});
