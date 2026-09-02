import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import {
  listArticles,
  loadArticle,
  saveArticle,
  suggestSlug,
} from '../../../../lib/admin/github/content';
import type { ArticleFrontmatter } from '../../../../lib/admin/types';
import { LOCALES } from '../../../../lib/admin/config';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const locale = url.searchParams.get('locale') || 'en';
  if (!LOCALES.includes(locale as typeof LOCALES[number])) {
    return adminError('invalid_locale', 400);
  }

  const slug = url.searchParams.get('slug');
  try {
    if (slug) {
      const article = await loadArticle(locale, slug);
      return adminJson({ article });
    }
    const articles = await listArticles(locale);
    return adminJson({ articles, locale });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

interface ArticleBody {
  locale: string;
  slug: string;
  previousSlug?: string;
  frontmatter: ArticleFrontmatter;
  body: string;
  sha?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const body = await parseJsonBody<ArticleBody>(request);
    const slug = body.slug || suggestSlug(body.frontmatter.title);
    const result = await saveArticle(
      body.locale,
      slug,
      body.frontmatter,
      body.body,
      body.sha,
      body.previousSlug,
    );
    return adminJson({ success: true, slug, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
