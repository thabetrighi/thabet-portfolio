import { defineMiddleware } from 'astro:middleware';
import { detectLocale } from './lib/locale-detection';
import { isValidLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './i18n/config';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Root redirect to detected locale
  if (pathname === '/' || pathname === '') {
    const cookie = context.cookies.get(LOCALE_COOKIE)?.value;
    const acceptLanguage = context.request.headers.get('accept-language');
    const country = context.request.headers.get('cf-ipcountry');

    const locale = detectLocale({ cookie, acceptLanguage, country });
    return context.redirect(`/${locale}`, 302);
  }

  // Set locale cookie when user navigates to a locale-prefixed URL
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

  return next();
});
