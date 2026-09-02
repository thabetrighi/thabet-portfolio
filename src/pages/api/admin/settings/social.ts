import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import { getSocialConfig, saveSocialConfig } from '../../../../lib/admin/content-source';
import { socialConfigSchema } from '../../../../lib/admin/schemas/config';
import type { SocialConfig } from '../../../../lib/admin/types';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const { data, sha, source } = await getSocialConfig();
    return adminJson({ data, sha, source });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const body = await parseJsonBody<{ data: SocialConfig; sha?: string }>(request);
    const parsed = socialConfigSchema.safeParse(body.data);
    if (!parsed.success) {
      return adminError(parsed.error.issues[0]?.message || 'invalid_data', 400);
    }
    const result = await saveSocialConfig(parsed.data, body.sha);
    return adminJson({ success: true, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
