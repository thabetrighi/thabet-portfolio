import { adminUi } from './strings';

const SEGMENT_LABELS: Record<string, string> = {
  articles: adminUi.nav.articles,
  projects: adminUi.nav.projects,
  settings: adminUi.sections.settings,
  site: adminUi.nav.site,
  social: adminUi.nav.social,
  profile: adminUi.nav.profile,
  deploy: adminUi.nav.deploy,
  edit: 'تعديل',
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildAdminBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: adminUi.nav.dashboard, href: '/admin' },
  ];

  const normalized = pathname.replace(/\/$/, '') || '/admin';
  if (normalized === '/admin') return crumbs;

  const parts = normalized.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  let acc = '/admin';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    acc += `/${part}`;
    const isLast = i === parts.length - 1;
    crumbs.push({
      label: SEGMENT_LABELS[part] || part,
      href: isLast ? undefined : acc,
    });
  }

  return crumbs;
}
