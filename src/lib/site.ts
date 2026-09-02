import siteConfig from '../../data/config/site.json';

export const site = {
  ...siteConfig,
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
  gaMeasurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID || '',
  cfBeaconToken: import.meta.env.PUBLIC_CF_BEACON_TOKEN || '',
} as const;
