export const site = {
  name: 'Thabet',
  fullName: {
    ar: 'ثابت',
    en: 'Thabet',
    fr: 'Thabet',
  },
  /** Optional logo path under /public — leave empty to use text name only */
  logo: '' as string,
  email: 'hello@thabet.dev',
  url: 'https://thabet.dev',
  github: 'https://github.com/thabet',
  linkedin: 'https://linkedin.com/in/thabet',
  twitter: 'https://x.com/thabet',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
} as const;
