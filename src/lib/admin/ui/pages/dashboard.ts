import { api } from '../client';
import { readPageConfig } from '../read-config';

interface DashboardConfig {
  connected: string;
  disconnected: string;
  lastDeploy: string;
  todayViews: string;
  todayVisitors: string;
  weekViews: string;
  weekVisitors: string;
  topPages: string;
  topReferrers: string;
  trackingGa4: string;
  trackingCf: string;
  trackingInternal: string;
  openGa: string;
  cachedStats: string;
  refreshStats: string;
  noVisitorData: string;
}

function renderTopList(
  container: HTMLElement | null,
  items: Array<{ path?: string; source?: string; views: number }>,
  emptyLabel: string,
  key: 'path' | 'source',
) {
  if (!container) return;
  if (!items?.length) {
    container.innerHTML = `<p class="adm-muted-text">${emptyLabel}</p>`;
    return;
  }

  container.innerHTML = `
    <ul class="adm-top-list">
      ${items.map((item) => `
        <li>
          <span class="adm-top-list__label">${item[key] || '—'}</span>
          <span class="adm-top-list__value">${item.views.toLocaleString('ar')}</span>
        </li>
      `).join('')}
    </ul>
  `;
}

export function initDashboardPage() {
  const config = readPageConfig<DashboardConfig>();
  const refreshBtn = document.getElementById('refresh-stats-btn');

  async function loadDashboard(force = false) {
    const endpoint = force ? '/api/admin/stats?refresh=1' : '/api/admin/stats';
    const { data } = await api(endpoint);

    const articlesEl = document.getElementById('stat-articles');
    const projectsEl = document.getElementById('stat-projects');
    const articlesMeta = document.getElementById('stat-articles-meta');
    const projectsMeta = document.getElementById('stat-projects-meta');
    const githubEl = document.getElementById('github-status');
    const deployEl = document.getElementById('deploy-status');
    const statGithub = document.getElementById('stat-github');
    const statDeploy = document.getElementById('stat-deploy');
    const cacheBadge = document.getElementById('stats-cache-badge');

    if (articlesEl) articlesEl.textContent = String(data.totals?.articles ?? 0);
    if (projectsEl) projectsEl.textContent = String(data.totals?.projects ?? 0);
    if (articlesMeta) {
      articlesMeta.textContent = `AR ${data.articles?.ar ?? 0} · EN ${data.articles?.en ?? 0} · FR ${data.articles?.fr ?? 0}`;
    }
    if (projectsMeta) {
      projectsMeta.textContent = `AR ${data.projects?.ar ?? 0} · EN ${data.projects?.en ?? 0} · FR ${data.projects?.fr ?? 0}`;
    }

    const todayViews = document.getElementById('stat-today-views');
    const todayVisitors = document.getElementById('stat-today-visitors');
    const weekViews = document.getElementById('stat-week-views');
    const weekVisitors = document.getElementById('stat-week-visitors');
    const trackingBadges = document.getElementById('tracking-badges');
    const gaLink = document.getElementById('ga-dashboard-link') as HTMLAnchorElement | null;

    if (todayViews) todayViews.textContent = String(data.analytics?.today?.pageviews ?? 0);
    if (todayVisitors) todayVisitors.textContent = String(data.analytics?.today?.visitors ?? 0);
    if (weekViews) weekViews.textContent = String(data.analytics?.last7Days?.pageviews ?? 0);
    if (weekVisitors) weekVisitors.textContent = String(data.analytics?.last7Days?.visitors ?? 0);

    renderTopList(
      document.getElementById('top-pages-list'),
      data.analytics?.topPages || [],
      config.noVisitorData,
      'path',
    );
    renderTopList(
      document.getElementById('top-referrers-list'),
      data.analytics?.topReferrers || [],
      config.noVisitorData,
      'source',
    );

    if (trackingBadges) {
      const badges: string[] = [`<span class="adm-badge adm-badge--accent">${config.trackingInternal}</span>`];
      if (data.tracking?.ga4) badges.push(`<span class="adm-badge adm-badge--success">${config.trackingGa4}</span>`);
      if (data.tracking?.cloudflare) badges.push(`<span class="adm-badge adm-badge--success">${config.trackingCf}</span>`);
      trackingBadges.innerHTML = badges.join(' ');
    }

    if (gaLink) {
      if (data.tracking?.gaDashboardUrl) {
        gaLink.href = data.tracking.gaDashboardUrl;
        gaLink.classList.remove('hidden');
      } else {
        gaLink.classList.add('hidden');
      }
    }

    if (data.github?.connected) {
      if (githubEl) {
        githubEl.innerHTML = `<span class="adm-badge adm-badge--success">${config.connected}</span> ${data.github.owner}/${data.github.repo}`;
      }
      if (statGithub) statGithub.innerHTML = '<span class="adm-badge adm-badge--success">متصل</span>';
    } else if (data.githubError) {
      if (githubEl) githubEl.innerHTML = `<span class="adm-badge adm-badge--warning">${data.githubError}</span>`;
      if (statGithub) statGithub.innerHTML = '<span class="adm-badge adm-badge--warning">خطأ</span>';
    } else {
      if (githubEl) githubEl.innerHTML = `<span class="adm-badge adm-badge--warning">${config.disconnected}</span>`;
      if (statGithub) statGithub.innerHTML = '<span class="adm-badge adm-badge--warning">غير متصل</span>';
    }

    if (data.deploy && deployEl && statDeploy) {
      const label = `${data.deploy.status} — ${data.deploy.conclusion || 'pending'}`;
      deployEl.textContent = label;
      statDeploy.textContent = label;
    } else if (deployEl) {
      deployEl.textContent = '—';
    }

    if (cacheBadge) {
      cacheBadge.textContent = data.meta?.cached ? config.cachedStats : '';
      cacheBadge.classList.toggle('hidden', !data.meta?.cached);
    }
  }

  refreshBtn?.addEventListener('click', async () => {
    refreshBtn.setAttribute('disabled', 'true');
    try {
      await loadDashboard(true);
    } finally {
      refreshBtn.removeAttribute('disabled');
    }
  });

  loadDashboard().catch(() => {
    const githubEl = document.getElementById('github-status');
    if (githubEl) githubEl.textContent = 'تعذّر تحميل البيانات';
  });
}
