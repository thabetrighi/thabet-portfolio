import { GITHUB_PATHS } from '../config';
import { getFile, listDirectory, upsertFile, deleteFile } from './client';
import { parseMarkdown, slugify, stringifyMarkdown } from '../markdown';
import type {
  ArticleFrontmatter,
  MarkdownDocument,
  ProjectFrontmatter,
  ProfileConfig,
  SiteConfig,
  SocialConfig,
} from '../types';

export async function loadSiteConfig(): Promise<{ data: SiteConfig; sha?: string }> {
  const file = await getFile(GITHUB_PATHS.site);
  if (!file) throw new Error('site.json not found');
  return { data: JSON.parse(file.content) as SiteConfig, sha: file.sha };
}

export async function saveSiteConfig(data: SiteConfig, sha?: string) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  return upsertFile(GITHUB_PATHS.site, content, 'admin: update site config', sha);
}

export async function loadSocialConfig(): Promise<{ data: SocialConfig; sha?: string }> {
  const file = await getFile(GITHUB_PATHS.social);
  if (!file) throw new Error('social.json not found');
  return { data: JSON.parse(file.content) as SocialConfig, sha: file.sha };
}

export async function saveSocialConfig(data: SocialConfig, sha?: string) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  return upsertFile(GITHUB_PATHS.social, content, 'admin: update social links', sha);
}

export async function loadProfile(locale: string): Promise<{ data: ProfileConfig; sha?: string }> {
  const file = await getFile(GITHUB_PATHS.profile(locale));
  if (!file) throw new Error(`profile ${locale} not found`);
  return { data: JSON.parse(file.content) as ProfileConfig, sha: file.sha };
}

export async function saveProfile(locale: string, data: ProfileConfig, sha?: string) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  return upsertFile(GITHUB_PATHS.profile(locale), content, `admin: update profile (${locale})`, sha);
}

function fileNameToSlug(name: string): string {
  return name.replace(/\.md$/, '');
}

export async function listArticles(locale: string): Promise<{ slug: string; sha: string }[]> {
  const items = await listDirectory(GITHUB_PATHS.articlesDir(locale));
  return items.map((item) => ({ slug: fileNameToSlug(item.name), sha: item.sha }));
}

export async function loadArticle(
  locale: string,
  slug: string,
): Promise<MarkdownDocument<ArticleFrontmatter>> {
  const file = await getFile(GITHUB_PATHS.article(locale, slug));
  if (!file) throw new Error('Article not found');
  const parsed = parseMarkdown<ArticleFrontmatter>(file.content);
  return { slug, locale, ...parsed, sha: file.sha };
}

export async function saveArticle(
  locale: string,
  slug: string,
  frontmatter: ArticleFrontmatter,
  body: string,
  sha?: string,
  previousSlug?: string,
) {
  const content = stringifyMarkdown(frontmatter as Record<string, unknown>, body);
  const result = await upsertFile(
    GITHUB_PATHS.article(locale, slug),
    content,
    `admin: ${sha ? 'update' : 'create'} article ${slug} (${locale})`,
    sha,
  );

  if (previousSlug && previousSlug !== slug) {
    const oldFile = await getFile(GITHUB_PATHS.article(locale, previousSlug));
    if (oldFile) {
      await deleteFile(
        GITHUB_PATHS.article(locale, previousSlug),
        oldFile.sha,
        `admin: rename article ${previousSlug} → ${slug}`,
      );
    }
  }

  return result;
}

export async function deleteArticle(locale: string, slug: string, sha: string) {
  return deleteFile(
    GITHUB_PATHS.article(locale, slug),
    sha,
    `admin: delete article ${slug} (${locale})`,
  );
}

export async function listProjects(locale: string): Promise<{ slug: string; sha: string }[]> {
  const items = await listDirectory(GITHUB_PATHS.projectsDir(locale));
  return items.map((item) => ({ slug: fileNameToSlug(item.name), sha: item.sha }));
}

export async function loadProject(
  locale: string,
  slug: string,
): Promise<MarkdownDocument<ProjectFrontmatter>> {
  const file = await getFile(GITHUB_PATHS.project(locale, slug));
  if (!file) throw new Error('Project not found');
  const parsed = parseMarkdown<ProjectFrontmatter>(file.content);
  return { slug, locale, ...parsed, sha: file.sha };
}

export async function saveProject(
  locale: string,
  slug: string,
  frontmatter: ProjectFrontmatter,
  body: string,
  sha?: string,
) {
  const content = stringifyMarkdown(frontmatter as Record<string, unknown>, body);
  return upsertFile(
    GITHUB_PATHS.project(locale, slug),
    content,
    `admin: ${sha ? 'update' : 'create'} project ${slug} (${locale})`,
    sha,
  );
}

export async function deleteProject(locale: string, slug: string, sha: string) {
  return deleteFile(
    GITHUB_PATHS.project(locale, slug),
    sha,
    `admin: delete project ${slug} (${locale})`,
  );
}

export function suggestSlug(title: string): string {
  return slugify(title);
}
