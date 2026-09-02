import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson } from '../../../../lib/admin/api/response';
import { parseValidatedJsonBody } from '../../../../lib/admin/validation';
import { articleSaveSchema } from '../../../../lib/admin/schemas/content';
import {
  getArticlesList,
  getArticle,
  saveArticle,
} from '../../../../lib/admin/content-source';
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
      const article = await getArticle(locale, slug);
      return adminJson({ article });
    }
    const { articles, source } = await getArticlesList(locale);
    return adminJson({ articles, locale, source });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const parsed = await parseValidatedJsonBody(request, articleSaveSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const frontmatter = {
    ...body.frontmatter,
    cover: body.frontmatter.cover || undefined,
    translationOf: body.frontmatter.translationOf || undefined,
  };

  try {
    const result = await saveArticle(
      body.locale,
      body.slug,
      frontmatter,
      body.body,
      body.sha,
      body.previousSlug || undefined,
    );
    return adminJson({ success: true, slug: body.slug, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
