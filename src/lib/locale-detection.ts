import {
  type Locale,
  defaultLocale,
  isValidLocale,
  countryLocaleHints,
  locales,
} from '../i18n/config';

function parseAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  const preferences = header
    .split(',')
    .map((part) => {
      const [lang, qPart] = part.trim().split(';q=');
      const q = qPart ? parseFloat(qPart) : 1;
      const code = lang.split('-')[0].toLowerCase();
      return { code, q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of preferences) {
    if (isValidLocale(code)) return code;
  }
  return null;
}

function localeFromCountry(country: string | null, browserLocale: Locale | null): Locale | null {
  if (!country) return null;
  const hints = countryLocaleHints[country.toUpperCase()];
  if (!hints?.length) return null;

  if (browserLocale && hints.includes(browserLocale)) {
    return browserLocale;
  }
  return hints[0];
}

export function detectLocale(options: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  const { cookie, acceptLanguage, country } = options;

  if (cookie && isValidLocale(cookie)) {
    return cookie;
  }

  const browserLocale = parseAcceptLanguage(acceptLanguage ?? null);
  if (browserLocale) return browserLocale;

  const geoLocale = localeFromCountry(country ?? null, browserLocale);
  if (geoLocale) return geoLocale;

  return defaultLocale;
}

export function getAlternateLocales(current: Locale): Locale[] {
  return locales.filter((l) => l !== current);
}
