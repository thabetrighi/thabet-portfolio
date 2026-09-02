// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://thabetrighi.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          ar: 'ar',
          en: 'en',
          fr: 'fr',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['ar', 'en', 'fr'],
    routing: 'manual',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
