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

function isIndexableSitemapUrl(page) {
  const { pathname } = new URL(page);
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  return !nonIndexableSitemapPaths.has(normalizedPath);
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
