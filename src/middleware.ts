import { defineMiddleware } from 'astro:middleware';
import { isValidLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './i18n/config';
import { applySecurityHeaders } from './lib/security';
import { requireAdminSession } from './lib/admin/auth/session';
import { resolveRequestRedirect } from './lib/request-redirects';

export const onRequest = defineMiddleware(async (context, next) => {
  const redirect = resolveRequestRedirect(context.request);
  if (redirect) return redirect;

  const { pathname } = new URL(context.url);

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
