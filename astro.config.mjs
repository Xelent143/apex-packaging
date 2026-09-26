import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const nonIndexableSitemapPaths = new Set([
  '/mock-stripe-checkout',
  '/pay',
  '/payment-cancelled',
  '/payment-success',
  '/paynow',
  '/thank-you'
]);
const redirectedSitemapPaths = new Set([
  '/blog/bakery-packaging-boxes-for-fresh-and-frozen-programs-2026-08-05',
  '/blog/custom-mailer-boxes-for-subscription-brands-2026-07-14',
  '/blog/custom-mailer-boxes-for-subscription-brands-2026-08-13',
  '/blog/apparel-packaging-for-ecommerce-and-retail-2026-08-04',
  '/blog/apparel-packaging-for-ecommerce-and-retail-2026-09-03'
]);

function isIndexableSitemapUrl(page) {
  const { pathname } = new URL(page);
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  return !nonIndexableSitemapPaths.has(normalizedPath) && !redirectedSitemapPaths.has(normalizedPath);
}

export default defineConfig({
  site: process.env.SITE_URL || 'https://apexpackagingsolutions.com',
  trailingSlash: 'never',
  prefetch: { defaultStrategy: 'viewport' },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      filter: isIndexableSitemapUrl
    })
  ],
  build: { assets: '_assets', inlineStylesheets: 'auto' }
});
