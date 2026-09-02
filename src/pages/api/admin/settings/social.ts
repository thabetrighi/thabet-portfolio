import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import { loadSocialConfig, saveSocialConfig } from '../../../../lib/admin/github/content';
import type { SocialConfig } from '../../../../lib/admin/types';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const { data, sha } = await loadSocialConfig();
    return adminJson({ data, sha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const body = await parseJsonBody<{ data: SocialConfig; sha?: string }>(request);
    const result = await saveSocialConfig(body.data, body.sha);
    return adminJson({ success: true, commitSha: result.commitSha });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
