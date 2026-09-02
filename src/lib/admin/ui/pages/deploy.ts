import { api, setStatus, showToast } from '../client';
import { readPageConfig } from '../read-config';

interface DeployConfig {
  deployLabel: string;
  deployingLabel: string;
  successMsg: string;
  errorMsg: string;
}

export function initDeployPage() {
  const config = readPageConfig<DeployConfig>();
  const info = document.getElementById('deploy-info');
  const status = document.getElementById('deploy-status');
  const link = document.getElementById('deploy-link') as HTMLAnchorElement | null;
  const btn = document.getElementById('deploy-btn') as HTMLButtonElement | null;

  async function refresh() {
    const { data } = await api('/api/admin/deploy');
    if (data.latestRun && info && link) {
      info.textContent = `آخر نشر: ${data.latestRun.status} / ${data.latestRun.conclusion || 'pending'} — ${new Date(data.latestRun.createdAt).toLocaleString('ar')}`;
      link.href = data.latestRun.htmlUrl;
      link.style.display = 'inline-flex';
    } else if (info) {
      info.textContent = 'لا يوجد نشر سابق أو workflow غير مضبوط بعد';
    }
  }

  btn?.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = config.deployingLabel;
    const { res, data } = await api('/api/admin/deploy', { method: 'POST' });
    if (res.ok) showToast(config.successMsg, 'success');
    setStatus(status, data.message || (res.ok ? config.successMsg : config.errorMsg), res.ok ? 'success' : 'error');
    btn.disabled = false;
    btn.textContent = config.deployLabel;
    refresh();
  });

  refresh().catch(() => {
    if (info) info.textContent = 'تعذّر تحميل حالة النشر';
  });
}
