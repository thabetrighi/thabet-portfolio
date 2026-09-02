/** Shared admin panel client utilities — bundled with page scripts (no global race). */

export async function api(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('unauthorized');
  }

  return { res, data };
}

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    container.className = 'adm-toasts';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `adm-toast adm-toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

export function setStatus(el: HTMLElement | null, message: string, type: 'success' | 'error' | 'info') {
  if (!el) return;
  el.textContent = message;
  el.className = `adm-alert adm-alert--${type}`;
  el.classList.remove('hidden');
}

export function renderSkeletonRows(table: HTMLElement | null, cols: number, rows = 4) {
  if (!table) return;
  table.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="${cols}"><div class="adm-skeleton" style="width:${55 + i * 10}%"></div></td>`;
    table.appendChild(tr);
  }
}

export function formatDate(value?: string) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value;
  }
}

export function qs<T extends HTMLElement>(selector: string, parent: ParentNode = document) {
  const el = parent.querySelector(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el as T;
}

export function qsv<T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
  selector: string,
) {
  return qs<T>(selector);
}
