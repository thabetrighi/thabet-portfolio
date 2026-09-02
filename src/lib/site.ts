export const site = {
  name: 'Thabet',
  fullName: {
    ar: 'ثابت',
    en: 'Thabet',
    fr: 'Thabet',
  },
  /** Optional logo path under /public — leave empty to use text name only */
  logo: '' as string,
  email: 'contact@thabetrighi.com',
  url: 'https://thabetrighi.com',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
} as const;
