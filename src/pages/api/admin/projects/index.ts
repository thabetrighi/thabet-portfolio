import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import {
  getProjectsList,
  getProject,
  saveProject,
  suggestSlug,
} from '../../../../lib/admin/content-source';
import type { ProjectFrontmatter } from '../../../../lib/admin/types';
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

interface ProjectBody {
  locale: string;
  slug: string;
  frontmatter: ProjectFrontmatter;
  body: string;
  sha?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const body = await parseJsonBody<ProjectBody>(request);
    const slug = body.slug || suggestSlug(body.frontmatter.title);
    const result = await saveProject(
      body.locale,
      slug,
      body.frontmatter,
      body.body,
      body.sha,
    );
    return adminJson({ success: true, slug, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
