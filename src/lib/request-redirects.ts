import { LOCALE_COOKIE } from '../i18n/config';
import { detectLocale } from './locale-detection';
import { applySecurityHeaders } from './security';
import { CANONICAL_ORIGIN } from './seo';

function getCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const escaped = name.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function detectLocaleFromRequest(request: Request): string {
  const cookie = getCookieValue(request.headers.get('cookie'), LOCALE_COOKIE);
  return detectLocale({
    cookie,
    acceptLanguage: request.headers.get('accept-language'),
    country: request.headers.get('cf-ipcountry'),
  });
}

function permanentRedirect(url: string): Response {
  return applySecurityHeaders(new Response(null, {
    status: 301,
    headers: { Location: url },
  }));
}

/** Server-side redirects that must run before static assets (www, root, sitemap, trailing slash). */
export function resolveRequestRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const { pathname } = url;

  if (url.hostname === 'www.thabetrighi.com') {
    url.hostname = 'thabetrighi.com';
    url.protocol = 'https:';
    if (pathname === '/' || pathname === '') {
      url.pathname = `/${detectLocaleFromRequest(request)}`;
    }
    return permanentRedirect(url.toString());
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    url.pathname = pathname.slice(0, -1);
    return permanentRedirect(url.toString());
  }

  if (pathname === '/sitemap.xml') {
    return permanentRedirect(`${CANONICAL_ORIGIN}/sitemap-index.xml`);
  }

  if (pathname === '/' || pathname === '') {
    return permanentRedirect(`${CANONICAL_ORIGIN}/${detectLocaleFromRequest(request)}`);
  }

  return null;
}
