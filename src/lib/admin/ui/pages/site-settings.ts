import { api, setStatus, showToast } from '../client';
import { readPageConfig } from '../read-config';

interface SiteSettingsConfig {
  successMsg: string;
  errorMsg: string;
  savingMsg: string;
  saveLabel: string;
  sourceGithub: string;
  sourceLocal: string;
}

function field<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

export function initSiteSettingsPage() {
  const config = readPageConfig<SiteSettingsConfig>();
  const form = document.getElementById('site-form');
  const status = document.getElementById('form-status');
  const saveBtn = field<HTMLButtonElement>('save-btn');
  const sourceBadge = document.getElementById('source-badge');

  async function load() {
    const { data, res } = await api('/api/admin/settings/site');
    if (!res.ok || !data.data) {
      setStatus(status, config.errorMsg, 'error');
      return;
    }

    if (sourceBadge) {
      sourceBadge.textContent = data.source === 'github' ? config.sourceGithub : config.sourceLocal;
      sourceBadge.className = `adm-badge ${data.source === 'github' ? 'adm-badge--success' : 'adm-badge--warning'}`;
    }

    field<HTMLInputElement>('sha').value = data.sha || '';
    field<HTMLInputElement>('name').value = data.data.name || '';
    field<HTMLInputElement>('email').value = data.data.email || '';
    field<HTMLInputElement>('url').value = data.data.url || '';
    field<HTMLInputElement>('logo').value = data.data.logo || '';
    field<HTMLInputElement>('fullNameAr').value = data.data.fullName?.ar || '';
    field<HTMLInputElement>('fullNameEn').value = data.data.fullName?.en || '';
    field<HTMLInputElement>('fullNameFr').value = data.data.fullName?.fr || '';
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = config.savingMsg;

    const payload = {
      sha: field<HTMLInputElement>('sha').value || undefined,
      data: {
        name: field<HTMLInputElement>('name').value,
        email: field<HTMLInputElement>('email').value,
        url: field<HTMLInputElement>('url').value,
        logo: field<HTMLInputElement>('logo').value,
        fullName: {
          ar: field<HTMLInputElement>('fullNameAr').value,
          en: field<HTMLInputElement>('fullNameEn').value,
          fr: field<HTMLInputElement>('fullNameFr').value,
        },
      },
    };

    try {
      const { res } = await api('/api/admin/settings/site', { method: 'PUT', body: JSON.stringify(payload) });
      if (res.ok) {
        showToast(config.successMsg, 'success');
        setStatus(status, config.successMsg, 'success');
        await load();
      } else {
        setStatus(status, config.errorMsg, 'error');
      }
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = config.saveLabel;
    }
  });

  load().catch(() => setStatus(status, config.errorMsg, 'error'));
}
