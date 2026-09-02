const THEME_KEY = 'admin-theme';

export function getTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  });
}

export function initTheme() {
  applyTheme(getTheme());
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });
}

export function initSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-overlay');
  const toggle = document.getElementById('admin-menu-toggle');

  const close = () => {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    document.body.classList.remove('adm-nav-open');
  };

  toggle?.addEventListener('click', () => {
    const open = sidebar?.classList.toggle('is-open');
    overlay?.classList.toggle('is-open', Boolean(open));
    document.body.classList.toggle('adm-nav-open', Boolean(open));
  });

  overlay?.addEventListener('click', close);
  sidebar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

export function initShell() {
  initTheme();
  initSidebar();

  document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = '/admin/login';
  });
}
