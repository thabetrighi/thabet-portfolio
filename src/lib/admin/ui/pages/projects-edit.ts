import { api } from '../client';
import { readPageConfig } from '../read-config';

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

export function initProjectsEditPage() {
  const config = readPageConfig<EditConfig>();
  const form = document.getElementById('project-form');
  const saveBtn = field<HTMLButtonElement>('save-btn');
  const deleteBtn = field<HTMLButtonElement>('delete-btn');

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
    field<HTMLTextAreaElement>('body').value = project.body || '';
    field<HTMLInputElement>('featured').checked = project.frontmatter.featured !== false;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = config.savingLabel;
    }

    const payload = {
      locale: config.locale,
      slug: field<HTMLInputElement>('slug').value,
      sha: field<HTMLInputElement>('sha').value || undefined,
      frontmatter: {
        title: field<HTMLInputElement>('title').value,
        excerpt: field<HTMLTextAreaElement>('excerpt').value,
        problem: field<HTMLTextAreaElement>('problem').value,
        solution: field<HTMLTextAreaElement>('solution').value,
        role: field<HTMLInputElement>('role').value,
        result: field<HTMLInputElement>('result').value,
        technologies: field<HTMLInputElement>('technologies').value.split(',').map((t) => t.trim()).filter(Boolean),
        cover: field<HTMLInputElement>('cover').value,
        order: Number(field<HTMLInputElement>('order').value),
        featured: field<HTMLInputElement>('featured').checked,
        github: field<HTMLInputElement>('github').value || undefined,
        demo: field<HTMLInputElement>('demo').value || undefined,
      },
      body: field<HTMLTextAreaElement>('body').value,
    };

    try {
      const { res, data } = await api('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showStatus(config.successMsg, true);
        if (config.isNew) window.location.href = `/admin/projects/edit?locale=${config.locale}&slug=${data.slug}`;
      } else {
        showStatus(data.error || config.errorMsg, false);
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

  deleteBtn?.addEventListener('click', async () => {
    if (!confirm(config.confirmDelete)) return;
    const sha = field<HTMLInputElement>('sha').value;
    const { res } = await api(`/api/admin/projects/${config.slug}?locale=${config.locale}&sha=${sha}`, { method: 'DELETE' });
    if (res.ok) window.location.href = `/admin/projects?locale=${config.locale}`;
  });

  loadProject();
}
