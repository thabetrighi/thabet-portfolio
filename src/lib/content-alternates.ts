import { getArticleCollection, getProjectCollection } from './content';
import { getCollection } from 'astro:content';
import { buildLocalizedCanonical, type HreflangAlternate } from './seo';
import { locales, type Locale } from '../i18n/config';

export interface ContentAlternate {
  locale: Locale;
  slug: string;
}

export async function findArticleAlternates(
  locale: Locale,
  slug: string,
  translationOf?: string,
): Promise<ContentAlternate[]> {
  const alternates: ContentAlternate[] = [];

  for (const loc of locales) {
    const collection = getArticleCollection(loc);
    const articles = await getCollection(collection);
    const match = articles.find(
      (a) =>
        !a.data.draft
        && (a.id === slug || a.data.translationOf === slug || (translationOf && a.id === translationOf)),
    );
    if (match) {
      alternates.push({ locale: loc, slug: match.id });
    }
  }

  return alternates;
}

export async function findProjectAlternates(
  locale: Locale,
  slug: string,
  translationOf?: string,
): Promise<ContentAlternate[]> {
  const alternates: ContentAlternate[] = [];

  for (const loc of locales) {
    const collection = getProjectCollection(loc);
    const projects = await getCollection(collection);
    const match = projects.find(
      (p) =>
        !p.data.draft
        && (p.id === slug || p.data.translationOf === slug || (translationOf && p.id === translationOf)),
    );
    if (match) {
      alternates.push({ locale: loc, slug: match.id });
    }
  }

  return alternates;
}

export function toHreflangAlternates(
  alternates: ContentAlternate[],
  contentType: 'articles' | 'work',
): HreflangAlternate[] {
  return alternates.map((alt) => ({
    locale: alt.locale,
    href: buildLocalizedCanonical(alt.locale, `${contentType}/${alt.slug}`),
  }));
}
