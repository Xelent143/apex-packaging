import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://apexpackagingsolutions.com',
  trailingSlash: 'never',
  prefetch: { defaultStrategy: 'viewport' },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({ changefreq: 'weekly', lastmod: new Date() })
  ],
  build: { assets: '_assets', inlineStylesheets: 'auto' }
});
