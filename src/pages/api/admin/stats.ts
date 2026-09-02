import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../lib/admin/auth/guard';
import { adminError, adminJson } from '../../../lib/admin/api/response';
import { getDashboardStats } from '../../../lib/admin/content-source';
import { getRepoStatus, getLatestDeployRun, GitHubError } from '../../../lib/admin/github/client';
import type { GitHubRepoStatus, GitHubWorkflowRun } from '../../../lib/admin/types';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  try {
    const stats = await getDashboardStats();

    let github: GitHubRepoStatus = {
      connected: false,
      owner: '',
      repo: '',
      branch: 'main',
      defaultBranch: 'main',
    };
    let deploy: GitHubWorkflowRun | null = null;
    let githubError: string | undefined;

    try {
      github = await getRepoStatus();
      if (github.connected) {
        deploy = await getLatestDeployRun();
      }
    } catch (error) {
      githubError = error instanceof GitHubError
        ? 'تعذّر الاتصال بـ GitHub'
        : 'خطأ في جلب بيانات GitHub';
    }

    return adminJson({
      ...stats,
      github,
      deploy,
      githubError,
    });
  } catch (error) {
    return adminError((error as Error).message, 500);
  }
};
