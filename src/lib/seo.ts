import { defaultLocale, getLocalizedPath, locales, type Locale } from '../i18n/config';
import { site } from './site';
import { socialLinks } from './social';

export const CANONICAL_ORIGIN = 'https://thabetrighi.com';

const OG_LOCALE: Record<Locale, string> = {
  ar: 'ar_DZ',
  en: 'en_US',
  fr: 'fr_FR',
};

export interface HreflangAlternate {
  locale: Locale;
  href: string;
}

/** Build absolute canonical URL on thabetrighi.com (no www, no query string). */
export function buildCanonicalUrl(pathOrUrl: string): string {
  const input = pathOrUrl.startsWith('http')
    ? new URL(pathOrUrl)
    : new URL(pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`, CANONICAL_ORIGIN);

  input.protocol = 'https:';
  input.hostname = 'thabetrighi.com';
  input.search = '';

  let pathname = input.pathname;
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return `${CANONICAL_ORIGIN}${pathname === '/' ? '' : pathname}`;
}

export function buildLocalizedCanonical(locale: Locale, path = ''): string {
  return buildCanonicalUrl(getLocalizedPath(locale, path));
}

/** Hreflang alternates for pages that exist in every locale. */
export function staticPageAlternates(path = ''): HreflangAlternate[] {
  return locales.map((locale) => ({
    locale,
    href: buildLocalizedCanonical(locale, path),
  }));
}

export function hreflangTags(alternates: HreflangAlternate[]): HreflangAlternate[] {
  const unique = new Map<string, HreflangAlternate>();
  for (const alt of alternates) {
    unique.set(alt.locale, alt);
  }
  return [...unique.values()];
}

export function getOgLocale(locale: Locale): string {
  return OG_LOCALE[locale];
}

export function getOgLocaleAlternates(locale: Locale, alternates: HreflangAlternate[]): string[] {
  return alternates
    .filter((alt) => alt.locale !== locale)
    .map((alt) => OG_LOCALE[alt.locale]);
}

export function buildPersonSchema(locale: Locale) {
  const sameAs = socialLinks.map((l) => l.url).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.fullName[locale],
    url: CANONICAL_ORIGIN,
    email: site.email,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebSiteSchema(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.fullName[locale],
    url: CANONICAL_ORIGIN,
    description,
    inLanguage: locale,
  };
}

export function buildBlogPostingSchema(options: {
  locale: Locale;
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  image?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: options.title,
    description: options.description,
    datePublished: options.publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: site.fullName[options.locale],
      url: CANONICAL_ORIGIN,
    },
    inLanguage: options.locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
    url: options.url,
  };

  if (options.image) {
    schema.image = buildCanonicalUrl(options.image);
  }

  return schema;
}

export function buildCreativeWorkSchema(options: {
  locale: Locale;
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: options.title,
    description: options.description,
    inLanguage: options.locale,
    url: options.url,
    author: {
      '@type': 'Person',
      name: site.fullName[options.locale],
      url: CANONICAL_ORIGIN,
    },
  };

  if (options.image) {
    schema.image = buildCanonicalUrl(options.image);
  }

  return schema;
}

export const SEO_DEFAULT_LOCALE = defaultLocale;
