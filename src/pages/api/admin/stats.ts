import type { APIRoute } from 'astro';
import { requireAdminApi } from '../../../lib/admin/auth/guard';
import { adminJson } from '../../../lib/admin/api/response';
import { getDashboardStats } from '../../../lib/admin/content-source';
import { getRepoStatus, getLatestDeployRun } from '../../../lib/admin/github/client';
import { readStatsCache, writeStatsCache } from '../../../lib/admin/stats-cache';
import { getAnalyticsSummary } from '../../../lib/analytics/store';
import type { GitHubRepoStatus, GitHubWorkflowRun } from '../../../lib/admin/types';
import { site } from '../../../lib/site';

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

interface StatsPayload {
  articles: Record<string, number>;
  projects: Record<string, number>;
  totals: { articles: number; projects: number };
  github: GitHubRepoStatus;
  deploy: GitHubWorkflowRun | null;
  githubError?: string;
  analytics: Awaited<ReturnType<typeof getAnalyticsSummary>>;
  tracking: {
    ga4: boolean;
    cloudflare: boolean;
    gaDashboardUrl?: string;
  };
}

async function buildFreshStats(): Promise<StatsPayload> {
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

  let analytics = {
    today: { pageviews: 0, visitors: 0 },
    last7Days: { pageviews: 0, visitors: 0 },
    daily: [],
    topPages: [],
    topReferrers: [],
  };

  try {
    analytics = await getAnalyticsSummary();
  } catch {
    // analytics optional
  }

  const gaId = site.gaMeasurementId;

  return {
    ...stats,
    github,
    deploy,
    githubError,
    analytics,
    tracking: {
      ga4: Boolean(gaId),
      cloudflare: Boolean(site.cfBeaconToken),
      gaDashboardUrl: gaId ? 'https://analytics.google.com/' : undefined,
    },
  };
}

export const GET: APIRoute = async ({ request, url }) => {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const forceRefresh = url.searchParams.get('refresh') === '1';

  if (!forceRefresh) {
    const cached = await readStatsCache<StatsPayload>();
    if (cached) {
      return adminJson({
        ...cached.data,
        meta: {
          cached: true,
          cachedAt: cached.cachedAt,
          expiresAt: cached.expiresAt,
        },
      });
    }
  }

  const data = await buildFreshStats();
  await writeStatsCache(data);

  return adminJson({
    ...data,
    meta: {
      cached: false,
      cachedAt: Date.now(),
      expiresAt: Date.now() + 120_000,
    },
  });
};
