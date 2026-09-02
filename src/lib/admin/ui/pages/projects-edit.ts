import { api } from '../client';
import { readPageConfig } from '../read-config';
import { projectSaveSchema } from '../../schemas/content';
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
    sha: (() => {
      const value = field<HTMLInputElement>('sha').value.trim();
      return value && !value.startsWith('local:') ? value : undefined;
    })(),
    frontmatter: {
      title: field<HTMLInputElement>('title').value.trim(),
      excerpt: field<HTMLTextAreaElement>('excerpt').value.trim(),
      problem: field<HTMLTextAreaElement>('problem').value.trim(),
      solution: field<HTMLTextAreaElement>('solution').value.trim(),
      role: field<HTMLInputElement>('role').value.trim(),
      result: field<HTMLInputElement>('result').value.trim(),
      technologies: field<HTMLInputElement>('technologies').value.split(',').map((t) => t.trim()).filter(Boolean),
      cover: field<HTMLInputElement>('cover').value.trim(),
      order: Number(field<HTMLInputElement>('order').value),
      featured: field<HTMLInputElement>('featured').checked,
      github: field<HTMLInputElement>('github').value.trim() || undefined,
      demo: field<HTMLInputElement>('demo').value.trim() || undefined,
      translationOf: field<HTMLInputElement>('translationOf').value.trim() || undefined,
      draft: field<HTMLInputElement>('draft').checked,
    },
    body: field<HTMLTextAreaElement>('body').value,
  };
}

export function initProjectsEditPage() {
  const config = readPageConfig<EditConfig>();
  const form = document.getElementById('project-form');
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

  async function loadProject() {
    if (config.isNew) return;
    const { data } = await api(`/api/admin/projects?locale=${config.locale}&slug=${config.slug}`);
    const { project } = data;
    if (!project) return;

    field<HTMLInputElement>('sha').value = project.sha || '';
    field<HTMLInputElement>('title').value = project.frontmatter.title || '';
    field<HTMLInputElement>('slug').value = project.slug || '';
    field<HTMLTextAreaElement>('excerpt').value = project.frontmatter.excerpt || '';
    field<HTMLTextAreaElement>('problem').value = project.frontmatter.problem || '';
    field<HTMLTextAreaElement>('solution').value = project.frontmatter.solution || '';
    field<HTMLInputElement>('role').value = project.frontmatter.role || '';
    field<HTMLInputElement>('result').value = project.frontmatter.result || '';
    field<HTMLInputElement>('technologies').value = (project.frontmatter.technologies || []).join(', ');
    field<HTMLInputElement>('cover').value = project.frontmatter.cover || '';
    field<HTMLInputElement>('order').value = String(project.frontmatter.order || 1);
    field<HTMLInputElement>('github').value = project.frontmatter.github || '';
    field<HTMLInputElement>('demo').value = project.frontmatter.demo || '';
    field<HTMLInputElement>('translationOf').value = project.frontmatter.translationOf || '';
    const body = project.body || '';
    if (mdEditor) mdEditor.setValue(body);
    else field<HTMLTextAreaElement>('body').value = body;
    field<HTMLInputElement>('featured').checked = project.frontmatter.featured !== false;
    field<HTMLInputElement>('draft').checked = Boolean(project.frontmatter.draft);
  }

  function validateForm() {
    clearFieldErrors(form!);
    const payload = buildPayload();
    const result = validateWithSchema(projectSaveSchema, payload);
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
      const { res, data } = await api('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showStatus(config.successMsg, true);
        if (config.isNew) {
          window.location.href = `/admin/projects/edit?locale=${config.locale}&slug=${data.slug}`;
        } else if (data.contentSha) {
          field<HTMLInputElement>('sha').value = data.contentSha;
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
        problem: payload.frontmatter.problem,
        solution: payload.frontmatter.solution,
        technologies: payload.frontmatter.technologies,
      },
      payload.body,
      'project',
    );
  });

  deleteBtn?.addEventListener('click', async () => {
    if (!confirm(config.confirmDelete)) return;
    const sha = field<HTMLInputElement>('sha').value;
    const { res } = await api(`/api/admin/projects/${config.slug}?locale=${config.locale}&sha=${sha}`, { method: 'DELETE' });
    if (res.ok) window.location.href = `/admin/projects?locale=${config.locale}`;
  });

  loadProject();
}
