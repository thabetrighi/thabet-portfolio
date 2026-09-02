import { defineMiddleware } from 'astro:middleware';
import { detectLocale } from './lib/locale-detection';
import { isValidLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './i18n/config';
import { applySecurityHeaders } from './lib/security';
import { requireAdminSession } from './lib/admin/auth/session';
import { CANONICAL_ORIGIN } from './lib/seo';

function detectLocaleFromRequest(context: Parameters<Parameters<typeof defineMiddleware>[0]>[0]) {
  const cookie = context.cookies.get(LOCALE_COOKIE)?.value;
  const acceptLanguage = context.request.headers.get('accept-language');
  const country = context.request.headers.get('cf-ipcountry');
  return detectLocale({ cookie, acceptLanguage, country });
}

function permanentRedirect(url: string): Response {
  return applySecurityHeaders(new Response(null, {
    status: 301,
    headers: { Location: url },
  }));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.url);
  const { pathname } = url;

  // Canonical host: www → apex (301), preserve path + query
  if (url.hostname === 'www.thabetrighi.com') {
    url.hostname = 'thabetrighi.com';
    url.protocol = 'https:';

    if (pathname === '/' || pathname === '') {
      const locale = detectLocaleFromRequest(context);
      url.pathname = `/${locale}`;
    }

    return permanentRedirect(url.toString());
  }

  // /sitemap.xml → sitemap index (canonical sitemap entry point)
  if (pathname === '/sitemap.xml') {
    return permanentRedirect(`${CANONICAL_ORIGIN}/sitemap-index.xml`);
  }

  // Admin panel auth guard
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await requireAdminSession(context.request);
    if (!session) {
      return applySecurityHeaders(context.redirect('/admin/login', 302));
    }
  }

  if (
    pathname.startsWith('/api/admin')
    && !pathname.startsWith('/api/admin/auth/login')
    && !pathname.startsWith('/api/admin/auth/logout')
    && !pathname.startsWith('/api/admin/auth/me')
  ) {
    const session = await requireAdminSession(context.request);
    if (!session) {
      return applySecurityHeaders(
        new Response(JSON.stringify({ error: 'unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Root → locale home (301 for SEO)
  if (pathname === '/' || pathname === '') {
    const locale = detectLocaleFromRequest(context);
    return permanentRedirect(`${CANONICAL_ORIGIN}/${locale}`);
  }

  if (isValidLocale(firstSegment)) {
    const existingCookie = context.cookies.get(LOCALE_COOKIE)?.value;
    if (existingCookie !== firstSegment) {
      context.cookies.set(LOCALE_COOKIE, firstSegment, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        httpOnly: false,
      });
    }
  }

  const response = await next();
  return applySecurityHeaders(response);
});
