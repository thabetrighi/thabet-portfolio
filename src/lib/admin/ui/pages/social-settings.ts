import { api, setStatus, showToast } from '../client';
import { readPageConfig } from '../read-config';

interface SocialSettingsConfig {
  platforms: string[];
  successMsg: string;
  errorMsg: string;
}

export function initSocialSettingsPage() {
  const config = readPageConfig<SocialSettingsConfig>();
  const container = document.getElementById('links-container');

  function renderLinks(links: Array<{ platform: string; url: string }>) {
    if (!container) return;
    container.innerHTML = '';
    for (const platform of config.platforms) {
      const existing = links.find((l) => l.platform === platform) || { platform, url: '' };
      const field = document.createElement('div');
      field.className = 'adm-field';
      field.innerHTML = `
        <label class="adm-label">${platform}</label>
        <input class="adm-input" data-platform="${platform}" value="${existing.url || ''}" placeholder="https://..." />
      `;
      container.appendChild(field);
    }
  }

  async function load() {
    const { data, res } = await api('/api/admin/settings/social');
    if (!res.ok || !data.data) return;
    (document.getElementById('sha') as HTMLInputElement).value = data.sha || '';
    renderLinks(data.data.links || []);
  }

  document.getElementById('social-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!container) return;
    const links = [...container.querySelectorAll<HTMLInputElement>('input[data-platform]')].map((input) => ({
      platform: input.dataset.platform || '',
      url: input.value.trim(),
    }));
    const { res } = await api('/api/admin/settings/social', {
      method: 'PUT',
      body: JSON.stringify({
        sha: (document.getElementById('sha') as HTMLInputElement).value || undefined,
        data: { links },
      }),
    });
    const status = document.getElementById('form-status');
    if (res.ok) {
      showToast(config.successMsg, 'success');
      setStatus(status, config.successMsg, 'success');
      load();
    } else {
      setStatus(status, config.errorMsg, 'error');
    }
  });

  load().catch(() => setStatus(document.getElementById('form-status'), config.errorMsg, 'error'));
}
