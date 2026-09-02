/**
 * Shared admin panel client utilities
 */
(function () {
  const THEME_KEY = 'admin-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function initTheme() {
    applyTheme(getTheme());
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
      });
    });
  }

  async function api(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      window.location.href = '/admin/login';
      throw new Error('unauthorized');
    }

    return { res, data };
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('admin-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'admin-toast-container';
      container.className = 'admin-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = `admin-alert admin-alert-${type}`;
    el.classList.remove('hidden');
  }

  function renderSkeletonRows(table, cols, rows = 4) {
    table.innerHTML = '';
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="${cols}"><div class="admin-skeleton" style="height:1.25rem;width:${60 + i * 8}%"></div></td>`;
      table.appendChild(tr);
    }
  }

  function initSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('admin-overlay');
    const toggle = document.getElementById('admin-menu-toggle');
    const close = () => {
      sidebar?.classList.remove('is-open');
      overlay?.classList.remove('is-visible');
      document.body.classList.remove('admin-nav-open');
    };
    toggle?.addEventListener('click', () => {
      sidebar?.classList.toggle('is-open');
      overlay?.classList.toggle('is-visible');
      document.body.classList.toggle('admin-nav-open');
    });
    overlay?.addEventListener('click', close);
    sidebar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  }

  function formatDate(value) {
    if (!value) return '—';
    try {
      return new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date(value));
    } catch {
      return value;
    }
  }

  window.AdminUI = {
    api,
    showToast,
    setStatus,
    renderSkeletonRows,
    initTheme,
    initSidebar,
    formatDate,
    applyTheme,
    getTheme,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initSidebar();
    });
  } else {
    initTheme();
    initSidebar();
  }
})();
