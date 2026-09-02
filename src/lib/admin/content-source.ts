import {
  deleteArticle,
  deleteProject,
  listArticles,
  listProjects,
  loadArticle,
  loadProfile,
  loadProject,
  loadSiteConfig,
  loadSocialConfig,
  saveArticle,
  saveProfile,
  saveProject,
  saveSiteConfig,
  saveSocialConfig,
  suggestSlug,
} from './github/content';
import { isGitHubConfigured } from './github/client';
import {
  listLocalArticles,
  listLocalProjects,
  loadLocalArticle,
  loadLocalProfile,
  loadLocalProject,
  loadLocalSiteConfig,
  loadLocalSocialConfig,
} from './local/bundled';
import type {
  ArticleFrontmatter,
  MarkdownDocument,
  ProjectFrontmatter,
  ProfileConfig,
  SiteConfig,
  SocialConfig,
} from './types';

export interface ArticleListItem {
  slug: string;
  sha: string;
  title: string;
  category?: string;
  publishedAt?: string;
  readingTime?: number;
  source: 'github' | 'local';
}

export interface ProjectListItem {
  slug: string;
  sha: string;
  title: string;
  order?: number;
  source: 'github' | 'local';
}

export async function getSiteConfig(): Promise<{ data: SiteConfig; sha?: string; source: 'github' | 'local' }> {
  if (isGitHubConfigured()) {
    try {
      const { data, sha } = await loadSiteConfig();
      return { data, sha, source: 'github' };
    } catch {
      // fallback to bundled content
    }
  }
  return { data: loadLocalSiteConfig(), source: 'local' };
}

export async function getSocialConfig(): Promise<{ data: SocialConfig; sha?: string; source: 'github' | 'local' }> {
  if (isGitHubConfigured()) {
    try {
      const { data, sha } = await loadSocialConfig();
      return { data, sha, source: 'github' };
    } catch {
      // fallback to bundled content
    }
  }
  return { data: loadLocalSocialConfig(), source: 'local' };
}

export async function getProfile(locale: string): Promise<{ data: ProfileConfig; sha?: string; source: 'github' | 'local' }> {
  if (isGitHubConfigured()) {
    try {
      const { data, sha } = await loadProfile(locale);
      return { data, sha, source: 'github' };
    } catch {
      // fallback to bundled content
    }
  }
  return { data: loadLocalProfile(locale), source: 'local' };
}

async function enrichArticles(locale: string, items: { slug: string; sha: string }[], source: 'github' | 'local') {
  const articles: ArticleListItem[] = [];

  for (const item of items) {
    try {
      const article = source === 'github'
        ? await loadArticle(locale, item.slug)
        : loadLocalArticle(locale, item.slug);
      if (!article) continue;
      articles.push({
        slug: item.slug,
        sha: item.sha,
        title: String(article.frontmatter.title || item.slug),
        category: article.frontmatter.category ? String(article.frontmatter.category) : undefined,
        publishedAt: article.frontmatter.publishedAt ? String(article.frontmatter.publishedAt) : undefined,
        readingTime: typeof article.frontmatter.readingTime === 'number'
          ? article.frontmatter.readingTime
          : Number(article.frontmatter.readingTime) || undefined,
        source,
      });
    } catch {
      articles.push({ slug: item.slug, sha: item.sha, title: item.slug, source });
    }
  }

  return articles;
}

async function enrichProjects(locale: string, items: { slug: string; sha: string }[], source: 'github' | 'local') {
  const projects: ProjectListItem[] = [];

  for (const item of items) {
    try {
      const project = source === 'github'
        ? await loadProject(locale, item.slug)
        : loadLocalProject(locale, item.slug);
      if (!project) continue;
      projects.push({
        slug: item.slug,
        sha: item.sha,
        title: String(project.frontmatter.title || item.slug),
        order: typeof project.frontmatter.order === 'number'
          ? project.frontmatter.order
          : Number(project.frontmatter.order) || undefined,
        source,
      });
    } catch {
      projects.push({ slug: item.slug, sha: item.sha, title: item.slug, source });
    }
  }

  return projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getArticlesList(locale: string) {
  if (isGitHubConfigured()) {
    try {
      const items = await listArticles(locale);
      const articles = await enrichArticles(locale, items, 'github');
      return { articles, source: 'github' as const };
    } catch {
      // fallback
    }
  }

  const items = listLocalArticles(locale);
  const articles = await enrichArticles(locale, items, 'local');
  return { articles, source: 'local' as const };
}

export async function getProjectsList(locale: string) {
  if (isGitHubConfigured()) {
    try {
      const items = await listProjects(locale);
      const projects = await enrichProjects(locale, items, 'github');
      return { projects, source: 'github' as const };
    } catch {
      // fallback
    }
  }

  const items = listLocalProjects(locale);
  const projects = await enrichProjects(locale, items, 'local');
  return { projects, source: 'local' as const };
}

export async function getArticle(locale: string, slug: string): Promise<MarkdownDocument<ArticleFrontmatter>> {
  if (isGitHubConfigured()) {
    try {
      return await loadArticle(locale, slug);
    } catch {
      // fallback
    }
  }

  const article = loadLocalArticle(locale, slug);
  if (!article) throw new Error('Article not found');
  return article;
}

export async function getProject(locale: string, slug: string): Promise<MarkdownDocument<ProjectFrontmatter>> {
  if (isGitHubConfigured()) {
    try {
      return await loadProject(locale, slug);
    } catch {
      // fallback
    }
  }

  const project = loadLocalProject(locale, slug);
  if (!project) throw new Error('Project not found');
  return project;
}

export async function getDashboardStats() {
  const locales = ['ar', 'en', 'fr'] as const;
  const articles: Record<string, number> = {};
  const projects: Record<string, number> = {};

  for (const locale of locales) {
    try {
      const articleList = await getArticlesList(locale);
      articles[locale] = articleList.articles.length;
    } catch {
      articles[locale] = 0;
    }

    try {
      const projectList = await getProjectsList(locale);
      projects[locale] = projectList.projects.length;
    } catch {
      projects[locale] = 0;
    }
  }

  return {
    articles,
    projects,
    totals: {
      articles: Object.values(articles).reduce((sum, n) => sum + n, 0),
      projects: Object.values(projects).reduce((sum, n) => sum + n, 0),
    },
  };
}

export {
  saveArticle,
  saveProject,
  saveSiteConfig,
  saveSocialConfig,
  saveProfile,
  deleteArticle,
  deleteProject,
  suggestSlug,
};
