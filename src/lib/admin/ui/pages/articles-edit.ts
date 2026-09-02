import { api } from '../client';
import { readPageConfig } from '../read-config';
import { articleSaveSchema } from '../../schemas/content';
import { sanitizeSlug } from '../../validation';
import { initMarkdownEditor } from '../markdown-editor';
import { openPublishPreview } from '../publish-preview';
import {
  bindSlugFromTitle,
  clearFieldErrors,
  showFieldError,
  translateValidationError,
  validateWithSchema,
} from '../form-validation';

interface EditConfig {
  locale: string;
  slug: string;
  isNew: boolean;
  saveLabel: string;
  savingLabel: string;
  successMsg: string;
  errorMsg: string;
  confirmDelete: string;
}

function showStatus(message: string, ok: boolean) {
  const status = document.getElementById('form-status');
  if (!status) return;
  status.textContent = message;
  status.className = `adm-alert ${ok ? 'adm-alert--success' : 'adm-alert--error'}`;
  status.classList.remove('hidden');
}

function field<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

function buildPayload() {
  return {
    locale: readPageConfig<EditConfig>().locale,
    slug: field<HTMLInputElement>('slug').value.trim(),
    previousSlug: field<HTMLInputElement>('previousSlug').value || undefined,
    sha: field<HTMLInputElement>('sha').value || undefined,
    frontmatter: {
      title: field<HTMLInputElement>('title').value.trim(),
      excerpt: field<HTMLTextAreaElement>('excerpt').value.trim(),
      category: field<HTMLInputElement>('category').value.trim(),
      publishedAt: field<HTMLInputElement>('publishedAt').value,
      readingTime: Number(field<HTMLInputElement>('readingTime').value),
      tags: field<HTMLInputElement>('tags').value.split(',').map((t) => t.trim()).filter(Boolean),
      cover: field<HTMLInputElement>('cover').value.trim() || undefined,
      translationOf: field<HTMLInputElement>('translationOf').value.trim() || undefined,
      draft: field<HTMLInputElement>('draft').checked,
    },
    body: field<HTMLTextAreaElement>('body').value,
  };
}

export function initArticlesEditPage() {
  const config = readPageConfig<EditConfig>();
  const form = document.getElementById('article-form');
  const saveBtn = field<HTMLButtonElement>('save-btn');
  const deleteBtn = field<HTMLButtonElement>('delete-btn');
  const previewBtn = field<HTMLButtonElement>('preview-btn');

  const mdRoot = document.querySelector<HTMLElement>('[data-md-root="body"]');
  const mdEditor = mdRoot ? initMarkdownEditor(mdRoot) : null;

  const titleInput = field<HTMLInputElement>('title');
  const slugInput = field<HTMLInputElement>('slug');
  bindSlugFromTitle(titleInput, slugInput, config.isNew);

  titleInput.addEventListener('blur', () => {
    if (!slugInput.value && titleInput.value) {
      slugInput.value = sanitizeSlug(titleInput.value);
    }
  });

  async function loadArticle() {
    if (config.isNew) return;
    const { data } = await api(`/api/admin/articles?locale=${config.locale}&slug=${config.slug}`);
    const { article } = data;
    if (!article) return;

    field<HTMLInputElement>('sha').value = article.sha || '';
    field<HTMLInputElement>('title').value = article.frontmatter.title || '';
    field<HTMLInputElement>('slug').value = article.slug || '';
    field<HTMLTextAreaElement>('excerpt').value = article.frontmatter.excerpt || '';
    field<HTMLInputElement>('category').value = article.frontmatter.category || '';
    field<HTMLInputElement>('publishedAt').value = String(article.frontmatter.publishedAt).slice(0, 10);
    field<HTMLInputElement>('readingTime').value = String(article.frontmatter.readingTime || 5);
    field<HTMLInputElement>('tags').value = (article.frontmatter.tags || []).join(', ');
    field<HTMLInputElement>('cover').value = article.frontmatter.cover || '';
    field<HTMLInputElement>('translationOf').value = article.frontmatter.translationOf || '';
    const body = article.body || '';
    if (mdEditor) mdEditor.setValue(body);
    else field<HTMLTextAreaElement>('body').value = body;
    field<HTMLInputElement>('draft').checked = Boolean(article.frontmatter.draft);
  }

  function validateForm() {
    clearFieldErrors(form!);
    const payload = buildPayload();
    const result = validateWithSchema(articleSaveSchema, payload);
    if (!result.ok) {
      if (result.field) {
        const fieldId = result.field.startsWith('frontmatter.')
          ? result.field.replace('frontmatter.', '')
          : result.field;
        showFieldError(fieldId, result.message);
      }
      showStatus(result.message, false);
      return null;
    }
    return result.data;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = config.savingLabel;
    }

    try {
      const { res, data } = await api('/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showStatus(config.successMsg, true);
        if (config.isNew) {
          window.location.href = `/admin/articles/edit?locale=${config.locale}&slug=${data.slug}`;
        } else {
          field<HTMLInputElement>('sha').value = '';
          field<HTMLInputElement>('previousSlug').value = data.slug;
        }
      } else {
        showStatus(translateValidationError(data.error) || config.errorMsg, false);
      }
    } catch {
      showStatus(config.errorMsg, false);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = config.saveLabel;
      }
    }
  });

  previewBtn?.addEventListener('click', () => {
    const payload = buildPayload();
    openPublishPreview(
      {
        title: payload.frontmatter.title,
        excerpt: payload.frontmatter.excerpt,
        category: payload.frontmatter.category,
        publishedAt: payload.frontmatter.publishedAt,
        tags: payload.frontmatter.tags,
      },
      payload.body,
      'article',
    );
  });

  deleteBtn?.addEventListener('click', async () => {
    if (!confirm(config.confirmDelete)) return;
    const sha = field<HTMLInputElement>('sha').value;
    const { res } = await api(`/api/admin/articles/${config.slug}?locale=${config.locale}&sha=${sha}`, { method: 'DELETE' });
    if (res.ok) window.location.href = `/admin/articles?locale=${config.locale}`;
  });

  loadArticle();
}
