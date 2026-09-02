const THEME_KEY = 'admin-theme';
const SIDEBAR_KEY = 'admin-sidebar-collapsed';

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

function isMobileSidebar() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function updateToggleIcon(toggle: HTMLElement | null, collapsed: boolean) {
  if (!toggle) return;
  toggle.classList.toggle('is-collapsed', collapsed);
  toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  toggle.setAttribute('aria-label', collapsed ? 'إظهار القائمة' : 'إخفاء القائمة');
}

export function initSidebar() {
  const layout = document.querySelector<HTMLElement>('.adm-layout');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-overlay');
  const toggle = document.getElementById('admin-menu-toggle');

  const closeMobile = () => {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    document.body.classList.remove('adm-nav-open');
    updateToggleIcon(toggle, true);
  };

  const setDesktopCollapsed = (collapsed: boolean) => {
    layout?.classList.toggle('is-sidebar-collapsed', collapsed);
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
    updateToggleIcon(toggle, collapsed);
  };

  if (!isMobileSidebar() && localStorage.getItem(SIDEBAR_KEY) === '1') {
    setDesktopCollapsed(true);
  } else if (!isMobileSidebar()) {
    updateToggleIcon(toggle, false);
  }

  toggle?.addEventListener('click', () => {
    if (isMobileSidebar()) {
      const willOpen = !sidebar?.classList.contains('is-open');
      sidebar?.classList.toggle('is-open', willOpen);
      overlay?.classList.toggle('is-open', willOpen);
      document.body.classList.toggle('adm-nav-open', willOpen);
      updateToggleIcon(toggle, !willOpen);
      return;
    }

    const collapsed = !layout?.classList.contains('is-sidebar-collapsed');
    setDesktopCollapsed(collapsed);
  });

  overlay?.addEventListener('click', closeMobile);
  sidebar?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobileSidebar()) closeMobile();
    });
  });

  window.matchMedia('(max-width: 900px)').addEventListener('change', (event) => {
    if (!event.matches) {
      closeMobile();
      const collapsed = localStorage.getItem(SIDEBAR_KEY) === '1';
      layout?.classList.toggle('is-sidebar-collapsed', collapsed);
      updateToggleIcon(toggle, collapsed);
    } else {
      layout?.classList.remove('is-sidebar-collapsed');
      updateToggleIcon(toggle, !sidebar?.classList.contains('is-open'));
    }
  });
}

export function initShell() {
  initTheme();
  initSidebar();

  document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('admin-logout-btn') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'same-origin' });
      window.location.href = '/admin/login';
    } catch {
      if (btn) btn.disabled = false;
    }
  });
}
