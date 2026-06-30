import { defineConfig } from 'astro/config';

// Static output. Lead capture uses Netlify Forms (no-JS safe) plus a Netlify
// Function (netlify/functions/lead.js) that forwards to GoHighLevel when
// GHL_WEBHOOK_URL is set. No SSR adapter needed.
export default defineConfig({
  site: 'https://www.bluecoastpr.com',
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
