import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import { getProfile, saveProfile } from '../../../../lib/admin/content-source';
import { profileConfigSchema } from '../../../../lib/admin/schemas/config';
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
    const { data, sha, source } = await getProfile(locale);
    return adminJson({ data, sha, locale, source });
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
    const parsed = profileConfigSchema.safeParse(body.data);
    if (!parsed.success) {
      return adminError(parsed.error.issues[0]?.message || 'invalid_data', 400);
    }
    const result = await saveProfile(locale, parsed.data, body.sha);
    return adminJson({ success: true, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
