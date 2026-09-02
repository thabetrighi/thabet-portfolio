import { renderMarkdown } from './markdown';

export interface PreviewMeta {
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  tags?: string[];
  problem?: string;
  solution?: string;
  technologies?: string[];
}

export function openPublishPreview(meta: PreviewMeta, body: string, type: 'article' | 'project') {
  const existing = document.getElementById('adm-publish-preview');
  existing?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'adm-publish-preview';
  overlay.className = 'adm-modal-overlay is-open';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'معاينة قبل النشر');

  const modal = document.createElement('div');
  modal.className = 'adm-modal adm-modal--wide';

  const header = document.createElement('div');
  header.className = 'adm-modal__header';
  header.innerHTML = `
    <div>
      <h2 class="adm-modal__title">معاينة قبل النشر</h2>
      <p class="adm-modal__subtitle">${type === 'article' ? 'مقال' : 'مشروع'} — كما سيظهر للزوار</p>
    </div>
    <button type="button" class="adm-btn adm-btn--secondary adm-btn--sm" data-close>إغلاق</button>
  `;

  const bodyEl = document.createElement('div');
  bodyEl.className = 'adm-modal__body';

  const metaHtml = buildMetaHtml(meta, type);
  const contentHtml = body.trim()
    ? renderMarkdown(body)
    : '<p class="adm-md-editor__empty">لا يوجد محتوى</p>';

  bodyEl.innerHTML = `
    <article class="adm-preview-article">
      <header class="adm-preview-article__header">
        <h1 class="adm-preview-article__title">${escapeHtml(meta.title || 'بدون عنوان')}</h1>
        ${metaHtml}
        ${meta.excerpt ? `<p class="adm-preview-article__excerpt">${escapeHtml(meta.excerpt)}</p>` : ''}
      </header>
      <div class="adm-prose adm-preview-article__content">${contentHtml}</div>
    </article>
  `;

  modal.appendChild(header);
  modal.appendChild(bodyEl);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function close() {
    overlay.remove();
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || (e.target as HTMLElement).closest('[data-close]')) close();
  });

  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMetaHtml(meta: PreviewMeta, type: 'article' | 'project'): string {
  const parts: string[] = [];

  if (type === 'article') {
    if (meta.category) parts.push(`<span class="adm-preview-tag">${escapeHtml(meta.category)}</span>`);
    if (meta.publishedAt) parts.push(`<span>${escapeHtml(meta.publishedAt)}</span>`);
    if (meta.tags?.length) {
      parts.push(meta.tags.map((t) => `<span class="adm-preview-tag adm-preview-tag--muted">${escapeHtml(t)}</span>`).join(''));
    }
  } else {
    if (meta.technologies?.length) {
      parts.push(meta.technologies.map((t) => `<span class="adm-preview-tag">${escapeHtml(t)}</span>`).join(''));
    }
    if (meta.problem) parts.push(`<p><strong>المشكلة:</strong> ${escapeHtml(meta.problem)}</p>`);
    if (meta.solution) parts.push(`<p><strong>الحل:</strong> ${escapeHtml(meta.solution)}</p>`);
  }

  if (!parts.length) return '';
  return `<div class="adm-preview-article__meta">${parts.join('')}</div>`;
}
