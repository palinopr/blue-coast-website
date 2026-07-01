import { defineConfig } from 'astro/config';

// Sitio estático. Captura de leads: Netlify Forms (funciona sin JS) más una
// Netlify Function (netlify/functions/lead.mjs) que reenvía a GoHighLevel
// cuando GHL_WEBHOOK_URL está configurado. Sin adaptador SSR.
// compressHTML: true — el modo 'jsx' de Astro 7 puede pegar palabras alrededor
// de <em>/<a> en línea en textos en español.
export default defineConfig({
  site: 'https://www.bluecoastpr.com',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
