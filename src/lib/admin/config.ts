/** Admin panel configuration — paths, limits, session settings */

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours
export const ADMIN_SESSION_KV_PREFIX = 'admin:session:';

export const GITHUB_PATHS = {
  site: 'data/config/site.json',
  social: 'data/config/social.json',
  profile: (locale: string) => `data/profile/${locale}.json`,
  article: (locale: string, slug: string) => `content/articles/${locale}/${slug}.md`,
  project: (locale: string, slug: string) => `content/projects/${locale}/${slug}.md`,
  articlesDir: (locale: string) => `content/articles/${locale}`,
  projectsDir: (locale: string) => `content/projects/${locale}`,
} as const;

export const LOCALES = ['ar', 'en', 'fr'] as const;
export type AdminLocale = (typeof LOCALES)[number];

export const DEPLOY_WORKFLOW_FILE = '.github/workflows/deploy.yml';

export const ADMIN_LIMITS = {
  loginAttemptsPerMinute: 10,
  apiRequestsPerMinute: 60,
  markdownMaxBytes: 100_000,
} as const;
