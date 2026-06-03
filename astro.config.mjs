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
  vite: {
    preview: {
      allowedHosts: ['apex-packaging-production.up.railway.app']
    }
  },
  build: { assets: '_assets', inlineStylesheets: 'auto' }
});
