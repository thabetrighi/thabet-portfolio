export const locales = ['ar', 'en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
};

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
  fr: 'ltr',
};

export const LOCALE_COOKIE = 'preferred-locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Map country codes to preferred locale fallbacks */
export const countryLocaleHints: Record<string, Locale[]> = {
  DZ: ['ar', 'fr'],
  MA: ['ar', 'fr'],
  TN: ['ar', 'fr'],
  SA: ['ar'],
  AE: ['ar'],
  EG: ['ar'],
  FR: ['fr'],
  BE: ['fr'],
  CA: ['fr', 'en'],
  GB: ['en'],
  US: ['en'],
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, path = ''): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
