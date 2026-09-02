import { api, formatDate, renderSkeletonRows } from '../client';
import { readPageConfig } from '../read-config';

interface ArticlesIndexConfig {
  editLabel: string;
  noData: string;
  sourceGithub: string;
  sourceLocal: string;
}

export function initArticlesIndexPage() {
  const { editLabel, noData, sourceGithub, sourceLocal } = readPageConfig<ArticlesIndexConfig>();
  const select = document.getElementById('locale-select') as HTMLSelectElement | null;
  const table = document.getElementById('articles-table');
  const search = document.getElementById('search-input') as HTMLInputElement | null;
  const sourceBadge = document.getElementById('source-badge');
  let allArticles: Array<Record<string, string>> = [];

  function renderArticles(items: Array<Record<string, string>>) {
    if (!table) return;
    table.innerHTML = '';
    if (!items.length) {
      table.innerHTML = `<tr class="adm-table-empty"><td colspan="5">${noData}</td></tr>`;
      return;
    }
    for (const article of items) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${article.title}</strong></td>
        <td><code>${article.slug}</code></td>
        <td>${article.category || '—'}</td>
        <td>${formatDate(article.publishedAt)}</td>
        <td><a class="adm-btn adm-btn--secondary adm-btn--sm" href="/admin/articles/edit?locale=${select?.value}&slug=${article.slug}">${editLabel}</a></td>
      `;
      table.appendChild(row);
    }
  }

  async function loadArticles() {
    renderSkeletonRows(table, 5);
    const { data } = await api(`/api/admin/articles?locale=${select?.value}`);
    allArticles = data.articles || [];
    if (sourceBadge) {
      sourceBadge.textContent = data.source === 'github' ? sourceGithub : sourceLocal;
      sourceBadge.className = `adm-badge ${data.source === 'github' ? 'adm-badge--success' : 'adm-badge--warning'}`;
    }
    renderArticles(allArticles);
  }

  search?.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    renderArticles(allArticles.filter((a) =>
      a.title.toLowerCase().includes(q)
      || a.slug.toLowerCase().includes(q)
      || (a.category || '').toLowerCase().includes(q),
    ));
  });

  select?.addEventListener('change', () => {
    window.location.href = `/admin/articles?locale=${select.value}`;
  });

  loadArticles().catch(() => {
    if (table) table.innerHTML = '<tr class="adm-table-empty"><td colspan="5">تعذّر تحميل المقالات</td></tr>';
  });
}
