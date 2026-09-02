import type { APIRoute } from 'astro';
import { requireAdminSession } from '../../../../lib/admin/auth/session';
import { isAdminAuthConfigured } from '../../../../lib/admin/auth/password';
import { isGitHubConfigured, getRepoStatus } from '../../../../lib/admin/github/client';
import { adminJson } from '../../../../lib/admin/api/response';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  const github = isGitHubConfigured() ? await getRepoStatus() : null;

  return adminJson({
    authenticated: Boolean(session),
    adminConfigured: isAdminAuthConfigured(),
    github,
    sessionExpiresAt: session?.expiresAt ?? null,
  });
};
