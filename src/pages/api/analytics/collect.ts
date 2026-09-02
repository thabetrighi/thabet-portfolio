import type { APIRoute } from 'astro';
import { recordPageView } from '../../../lib/analytics/store';
import { isAllowedOrigin } from '../../../lib/security';

export const prerender = false;

const VISITOR_ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/;
const PATH_REGEX = /^\/[a-zA-Z0-9/_.-]*$/;

function isBot(request: Request): boolean {
  if (request.headers.get('cf-verified-bot') === 'true') return true;
  const ua = request.headers.get('user-agent')?.toLowerCase() || '';
  return /bot|crawl|spider|slurp|headless|preview/.test(ua);
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request) || isBot(request)) {
    return new Response(null, { status: 204 });
  }

  let body: { path?: string; referrer?: string; visitorId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const path = body.path || '/';
  const visitorId = body.visitorId || '';

  if (!VISITOR_ID_REGEX.test(visitorId) || !PATH_REGEX.test(path)) {
    return new Response(null, { status: 400 });
  }

  if (path.startsWith('/admin') || path.startsWith('/api/')) {
    return new Response(null, { status: 204 });
  }

  try {
    await recordPageView({
      path,
      referrer: body.referrer,
      visitorId,
    });
  } catch {
    return new Response(null, { status: 204 });
  }

  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  });
};
