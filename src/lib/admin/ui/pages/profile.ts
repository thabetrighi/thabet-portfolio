import { api, setStatus, showToast } from '../client';
import { getEditorContent, mountProfileJsonEditor } from '../json-editor';
import { readPageConfig } from '../read-config';

interface ProfileConfig {
  locale: string;
  successMsg: string;
  errorMsg: string;
  savingMsg: string;
  saveLabel: string;
}

export function initProfilePage() {
  const config = readPageConfig<ProfileConfig>();
  const select = document.getElementById('locale-select') as HTMLSelectElement | null;
  let profileData: Record<string, unknown> | null = null;

  document.querySelectorAll('.adm-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.adm-tab').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const id = (tab as HTMLElement).dataset.tab;
      document.getElementById('panel-about')?.classList.toggle('hidden', id !== 'about');
      document.getElementById('panel-editor')?.classList.toggle('hidden', id !== 'editor');
    });
  });

  select?.addEventListener('change', () => {
    window.location.href = `/admin/profile?locale=${select.value}`;
  });

  function field<T extends HTMLElement>(id: string) {
    return document.getElementById(id) as T;
  }

  function syncAboutToProfile() {
    if (!profileData) return;
    profileData.about = {
      summary: field<HTMLTextAreaElement>('aboutSummary').value,
      extended: field<HTMLTextAreaElement>('aboutExtended').value,
    };
    profileData.resume = {
      ...(profileData.resume as Record<string, unknown>),
      profile: field<HTMLTextAreaElement>('resumeProfile').value,
    };
  }

  function syncProfileToAbout() {
    const about = profileData?.about as { summary?: string; extended?: string } | undefined;
    const resume = profileData?.resume as { profile?: string } | undefined;
    field<HTMLTextAreaElement>('aboutSummary').value = about?.summary || '';
    field<HTMLTextAreaElement>('aboutExtended').value = about?.extended || '';
    field<HTMLTextAreaElement>('resumeProfile').value = resume?.profile || '';
  }

  async function load() {
    const { data, res } = await api(`/api/admin/profile/${config.locale}`);
    if (!res.ok || !data.data) {
      setStatus(document.getElementById('form-status'), config.errorMsg, 'error');
      return;
    }

    profileData = data.data;
    field<HTMLInputElement>('sha').value = data.sha || '';
    syncProfileToAbout();

    const editorEl = document.getElementById('profile-json-editor');
    if (editorEl) {
      mountProfileJsonEditor(editorEl, profileData, (json) => {
        profileData = json as Record<string, unknown>;
        syncProfileToAbout();
      });
    }
  }

  document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = field<HTMLButtonElement>('save-btn');
    const status = document.getElementById('form-status');
    saveBtn.disabled = true;
    saveBtn.textContent = config.savingMsg;

    const editorJson = getEditorContent();
    if (editorJson) profileData = editorJson as Record<string, unknown>;
    syncAboutToProfile();

    try {
      const { res } = await api(`/api/admin/profile/${config.locale}`, {
        method: 'PUT',
        body: JSON.stringify({
          sha: field<HTMLInputElement>('sha').value || undefined,
          data: profileData,
        }),
      });

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

  load().catch(() => setStatus(document.getElementById('form-status'), config.errorMsg, 'error'));
}
