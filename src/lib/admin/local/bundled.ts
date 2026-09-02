import siteJson from '../../../../data/config/site.json';
import socialJson from '../../../../data/config/social.json';
import profileAr from '../../../../data/profile/ar.json';
import profileEn from '../../../../data/profile/en.json';
import profileFr from '../../../../data/profile/fr.json';
import { parseMarkdown } from '../markdown';
import type {
  ArticleFrontmatter,
  MarkdownDocument,
  ProjectFrontmatter,
  ProfileConfig,
  SiteConfig,
  SocialConfig,
} from '../types';

const articleModules = import.meta.glob<string>(
  '../../../../content/articles/**/*.md',
  { query: '?raw', import: 'default', eager: true },
);

const projectModules = import.meta.glob<string>(
  '../../../../content/projects/**/*.md',
  { query: '?raw', import: 'default', eager: true },
);

const profiles: Record<string, ProfileConfig> = {
  ar: profileAr as ProfileConfig,
  en: profileEn as ProfileConfig,
  fr: profileFr as ProfileConfig,
};

function parseContentPath(path: string, type: 'articles' | 'projects'): { locale: string; slug: string } | null {
  const match = path.match(new RegExp(`${type}/([^/]+)/([^/]+)\\.md$`));
  if (!match) return null;
  return { locale: match[1]!, slug: match[2]!.replace(/\.md$/, '') };
}

function listMarkdown(type: 'articles' | 'projects', locale: string) {
  const modules = type === 'articles' ? articleModules : projectModules;
  const items: { slug: string; sha: string }[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const parsed = parseContentPath(path, type);
    if (!parsed || parsed.locale !== locale) continue;
    items.push({ slug: parsed.slug, sha: `local:${parsed.slug}` });
  }

  return items.sort((a, b) => a.slug.localeCompare(b.slug));
}

function loadMarkdown<T extends Record<string, unknown>>(
  type: 'articles' | 'projects',
  locale: string,
  slug: string,
): MarkdownDocument<T> | null {
  const modules = type === 'articles' ? articleModules : projectModules;

  for (const [path, raw] of Object.entries(modules)) {
    const parsed = parseContentPath(path, type);
    if (!parsed || parsed.locale !== locale || parsed.slug !== slug) continue;
    const doc = parseMarkdown<T>(raw);
    return {
      slug,
      locale,
      ...doc,
      sha: `local:${slug}`,
    };
  }

  return null;
}

export function loadLocalSiteConfig(): SiteConfig {
  return siteJson as SiteConfig;
}

export function loadLocalSocialConfig(): SocialConfig {
  return socialJson as SocialConfig;
}

export function loadLocalProfile(locale: string): ProfileConfig {
  const profile = profiles[locale];
  if (!profile) throw new Error(`profile ${locale} not found`);
  return profile;
}

export function listLocalArticles(locale: string) {
  return listMarkdown('articles', locale);
}

export function listLocalProjects(locale: string) {
  return listMarkdown('projects', locale);
}

export function loadLocalArticle(locale: string, slug: string) {
  return loadMarkdown<ArticleFrontmatter>('articles', locale, slug);
}

export function loadLocalProject(locale: string, slug: string) {
  return loadMarkdown<ProjectFrontmatter>('projects', locale, slug);
}
