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
