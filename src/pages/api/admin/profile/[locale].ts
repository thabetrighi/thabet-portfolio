import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import { loadProfile, saveProfile } from '../../../../lib/admin/github/content';
import type { ProfileConfig } from '../../../../lib/admin/types';
import { LOCALES } from '../../../../lib/admin/config';

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const locale = params.locale || 'en';
  if (!LOCALES.includes(locale as typeof LOCALES[number])) {
    return adminError('invalid_locale', 400);
  }

  try {
    const { data, sha } = await loadProfile(locale);
    return adminJson({ data, sha, locale });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

export const PUT: APIRoute = async ({ request, params }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const locale = params.locale || 'en';
  if (!LOCALES.includes(locale as typeof LOCALES[number])) {
    return adminError('invalid_locale', 400);
  }

  try {
    const body = await parseJsonBody<{ data: ProfileConfig; sha?: string }>(request);
    const result = await saveProfile(locale, body.data, body.sha);
    return adminJson({ success: true, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
