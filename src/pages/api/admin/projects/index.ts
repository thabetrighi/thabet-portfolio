import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson } from '../../../../lib/admin/api/response';
import { invalidateStatsCache } from '../../../../lib/admin/stats-cache';
import { parseValidatedJsonBody } from '../../../../lib/admin/validation';
import { projectSaveSchema } from '../../../../lib/admin/schemas/content';
import {
  getProjectsList,
  getProject,
  saveProject,
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
      const project = await getProject(locale, slug);
      return adminJson({ project });
    }
    const { projects, source } = await getProjectsList(locale);
    return adminJson({ projects, locale, source });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const parsed = await parseValidatedJsonBody(request, projectSaveSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const frontmatter = {
    ...body.frontmatter,
    github: body.frontmatter.github || undefined,
    demo: body.frontmatter.demo || undefined,
    translationOf: body.frontmatter.translationOf || undefined,
  };

  try {
    const result = await saveProject(
      body.locale,
      body.slug,
      frontmatter,
      body.body,
      body.sha,
    );
    await invalidateStatsCache();
    return adminJson({
      success: true,
      slug: body.slug,
      commitSha: result.commitSha,
      contentSha: result.contentSha,
    });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
