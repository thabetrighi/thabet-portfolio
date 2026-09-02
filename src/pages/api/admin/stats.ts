import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../lib/admin/auth/guard';
import { adminError, adminJson } from '../../../lib/admin/api/response';
import { getDashboardStats } from '../../../lib/admin/content-source';
import { getRepoStatus, getLatestDeployRun } from '../../../lib/admin/github/client';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const stats = await getDashboardStats();
    const github = await getRepoStatus();
    const latestRun = await getLatestDeployRun();

    return adminJson({
      ...stats,
      github,
      deploy: latestRun,
    });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
