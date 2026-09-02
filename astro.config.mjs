// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://thabetrighi.com',
  trailingSlash: 'never',
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const url = page.toLowerCase();
        return !url.includes('/admin')
          && !url.includes('/404')
          && !url.includes('www.thabetrighi.com');
      },
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
