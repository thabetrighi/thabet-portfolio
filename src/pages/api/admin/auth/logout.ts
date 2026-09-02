import type { APIRoute } from 'astro';
import {
  buildLogoutCookie,
  destroyAdminSession,
  getSessionTokenFromRequest,
} from '../../../../lib/admin/auth/session';
import { adminJson } from '../../../../lib/admin/api/response';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) {
    const token = getSessionTokenFromRequest(request);
    await destroyAdminSession(token);
    return adminJson({ success: true }, 200, { 'Set-Cookie': buildLogoutCookie() });
  }

  const token = getSessionTokenFromRequest(request);
  await destroyAdminSession(token);
  return adminJson({ success: true }, 200, { 'Set-Cookie': buildLogoutCookie() });
};
