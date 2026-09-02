import { api, renderSkeletonRows } from '../client';
import { readPageConfig } from '../read-config';

interface ProjectsIndexConfig {
  editLabel: string;
  noData: string;
  sourceGithub: string;
  sourceLocal: string;
}

export function initProjectsIndexPage() {
  const { editLabel, noData, sourceGithub, sourceLocal } = readPageConfig<ProjectsIndexConfig>();
  const select = document.getElementById('locale-select') as HTMLSelectElement | null;
  const table = document.getElementById('projects-table');
  const search = document.getElementById('search-input') as HTMLInputElement | null;
  const sourceBadge = document.getElementById('source-badge');
  let allProjects: Array<Record<string, string | number>> = [];

  function renderProjects(items: Array<Record<string, string | number>>) {
    if (!table) return;
    table.innerHTML = '';
    if (!items.length) {
      table.innerHTML = `<tr class="adm-table-empty"><td colspan="4">${noData}</td></tr>`;
      return;
    }
    for (const project of items) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${project.title}</strong></td>
        <td><code>${project.slug}</code></td>
        <td>${project.order ?? '—'}</td>
        <td><a class="adm-btn adm-btn--secondary adm-btn--sm" href="/admin/projects/edit?locale=${select?.value}&slug=${project.slug}">${editLabel}</a></td>
      `;
      table.appendChild(row);
    }
  }

  async function loadProjects() {
    renderSkeletonRows(table, 4);
    const { data } = await api(`/api/admin/projects?locale=${select?.value}`);
    allProjects = data.projects || [];
    if (sourceBadge) {
      sourceBadge.textContent = data.source === 'github' ? sourceGithub : sourceLocal;
      sourceBadge.className = `adm-badge ${data.source === 'github' ? 'adm-badge--success' : 'adm-badge--warning'}`;
    }
    renderProjects(allProjects);
  }

  search?.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    renderProjects(allProjects.filter((p) =>
      String(p.title).toLowerCase().includes(q) || String(p.slug).toLowerCase().includes(q),
    ));
  });

  select?.addEventListener('change', () => {
    window.location.href = `/admin/projects?locale=${select.value}`;
  });

  loadProjects().catch(() => {
    if (table) table.innerHTML = '<tr class="adm-table-empty"><td colspan="4">تعذّر تحميل المشاريع</td></tr>';
  });
}
