import siteConfig from '../../data/config/site.json';

export const site = {
  ...siteConfig,
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
} as const;
