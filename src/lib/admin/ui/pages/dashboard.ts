import { api } from '../client';
import { readPageConfig } from '../read-config';

interface DashboardConfig {
  connected: string;
  disconnected: string;
  lastDeploy: string;
}

export function initDashboardPage() {
  const { connected, disconnected, lastDeploy } = readPageConfig<DashboardConfig>();

  async function loadDashboard() {
    const { data } = await api('/api/admin/stats');

    const articlesEl = document.getElementById('stat-articles');
    const projectsEl = document.getElementById('stat-projects');
    const articlesMeta = document.getElementById('stat-articles-meta');
    const projectsMeta = document.getElementById('stat-projects-meta');
    const githubEl = document.getElementById('github-status');
    const deployEl = document.getElementById('deploy-status');
    const statGithub = document.getElementById('stat-github');
    const statDeploy = document.getElementById('stat-deploy');

    if (articlesEl) articlesEl.textContent = String(data.totals?.articles ?? 0);
    if (projectsEl) projectsEl.textContent = String(data.totals?.projects ?? 0);
    if (articlesMeta) {
      articlesMeta.textContent = `AR ${data.articles?.ar ?? 0} · EN ${data.articles?.en ?? 0} · FR ${data.articles?.fr ?? 0}`;
    }
    if (projectsMeta) {
      projectsMeta.textContent = `AR ${data.projects?.ar ?? 0} · EN ${data.projects?.en ?? 0} · FR ${data.projects?.fr ?? 0}`;
    }

    if (data.github?.connected) {
      if (githubEl) {
        githubEl.innerHTML = `<span class="adm-badge adm-badge--success">${connected}</span> ${data.github.owner}/${data.github.repo}`;
      }
      if (statGithub) statGithub.innerHTML = '<span class="adm-badge adm-badge--success">متصل</span>';
    } else if (data.githubError) {
      if (githubEl) githubEl.innerHTML = `<span class="adm-badge adm-badge--warning">${data.githubError}</span>`;
      if (statGithub) statGithub.innerHTML = '<span class="adm-badge adm-badge--warning">خطأ</span>';
    } else {
      if (githubEl) githubEl.innerHTML = `<span class="adm-badge adm-badge--warning">${disconnected}</span>`;
      if (statGithub) statGithub.innerHTML = '<span class="adm-badge adm-badge--warning">غير متصل</span>';
    }

    if (data.deploy && deployEl && statDeploy) {
      const label = `${data.deploy.status} — ${data.deploy.conclusion || 'pending'}`;
      deployEl.textContent = `${lastDeploy}: ${label}`;
      statDeploy.textContent = label;
    }
  }

  loadDashboard().catch(() => {
    const githubEl = document.getElementById('github-status');
    if (githubEl) githubEl.textContent = 'تعذّر تحميل البيانات';
  });
}
