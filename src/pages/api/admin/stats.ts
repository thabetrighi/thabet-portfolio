import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../lib/admin/auth/guard';
import { adminJson } from '../../../lib/admin/api/response';
import { getDashboardStats } from '../../../lib/admin/content-source';
import { getRepoStatus, getLatestDeployRun } from '../../../lib/admin/github/client';
import type { GitHubRepoStatus, GitHubWorkflowRun } from '../../../lib/admin/types';

export const prerender = false;

const emptyStats = {
  articles: { ar: 0, en: 0, fr: 0 },
  projects: { ar: 0, en: 0, fr: 0 },
  totals: { articles: 0, projects: 0 },
};

const emptyGithub: GitHubRepoStatus = {
  connected: false,
  owner: '',
  repo: '',
  branch: 'main',
  defaultBranch: 'main',
};

export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  let stats = emptyStats;
  let github = emptyGithub;
  let deploy: GitHubWorkflowRun | null = null;
  let githubError: string | undefined;

  try {
    stats = await getDashboardStats();
  } catch {
    githubError = 'تعذّر تحميل إحصائيات المحتوى';
  }

  try {
    github = await getRepoStatus();
    if (github.connected) {
      deploy = await getLatestDeployRun();
    }
  } catch {
    githubError = githubError || 'تعذّر الاتصال بـ GitHub';
  }

  return adminJson({
    ...stats,
    github,
    deploy,
    githubError,
  });
};
