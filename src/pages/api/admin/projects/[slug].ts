import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson } from '../../../../lib/admin/api/response';
import { deleteProject, getProject } from '../../../../lib/admin/content-source';
import { LOCALES } from '../../../../lib/admin/config';

export const prerender = false;

export const GET: APIRoute = async ({ request, params, url }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const locale = url.searchParams.get('locale') || 'en';
  const slug = params.slug;
  if (!slug || !LOCALES.includes(locale as typeof LOCALES[number])) {
    return adminError('invalid_request', 400);
  }

  try {
    const project = await getProject(locale, slug);
    return adminJson({ project });
  } catch (error) {
    return adminError((error as Error).message, 404);
  }
};

export const DELETE: APIRoute = async ({ request, params, url }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const locale = url.searchParams.get('locale') || 'en';
  const slug = params.slug;
  const sha = url.searchParams.get('sha');

  if (!slug || !sha || sha.startsWith('local:') || !LOCALES.includes(locale as typeof LOCALES[number])) {
    return adminError('invalid_request', 400);
  }

  try {
    const result = await deleteProject(locale, slug, sha);
    return adminJson({ success: true, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
