import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../../lib/admin/auth/guard';
import { adminError, adminJson } from '../../../../lib/admin/api/response';
import { getLatestDeployRun, triggerDeploy } from '../../../../lib/admin/github/client';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const latestRun = await getLatestDeployRun();
    return adminJson({ latestRun });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const result = await triggerDeploy();
    const latestRun = await getLatestDeployRun();
    return adminJson({ ...result, latestRun });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
