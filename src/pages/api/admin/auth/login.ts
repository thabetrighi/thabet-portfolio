import type { APIRoute } from 'astro';
import { verifyTurnstileToken } from '../../../../lib/turnstile';
import { verifyAdminCredentials } from '../../../../lib/admin/auth/credentials';
import { isAdminAuthConfigured } from '../../../../lib/admin/auth/password';
import {
  buildSessionCookie,
  createAdminSession,
} from '../../../../lib/admin/auth/session';
import { adminError, adminJson, adminRedirect, parseLoginBody } from '../../../../lib/admin/api/response';
import { getClientIp } from '../../../../lib/security';
import { env } from 'cloudflare:workers';

export const prerender = false;

function wantsHtmlRedirect(request: Request, body: { redirect?: string }): boolean {
  return body.redirect === '1'
    || request.headers.get('accept')?.includes('text/html') === true;
}

function loginErrorResponse(
  request: Request,
  body: { redirect?: string },
  code: string,
  status: number,
): Response {
  if (wantsHtmlRedirect(request, body)) {
    return adminRedirect(`/admin/login?error=${encodeURIComponent(code)}`);
  }
  return adminError(code, status);
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminAuthConfigured()) {
    return loginErrorResponse(request, {}, 'admin_not_configured', 503);
  }

  const rateLimiter = env.ADMIN_LOGIN_RATE_LIMITER;
  if (rateLimiter?.limit) {
    const { success } = await rateLimiter.limit({ key: `login:${getClientIp(request)}` });
    if (!success) return loginErrorResponse(request, {}, 'rate_limited', 429);
  }

  const body = await parseLoginBody(request);
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret) {
    return loginErrorResponse(request, body, 'turnstile_not_configured', 503);
  }

  if (!body['cf-turnstile-response']) {
    return loginErrorResponse(request, body, 'captcha_required', 400);
  }

  const captchaOk = await verifyTurnstileToken(
    turnstileSecret,
    body['cf-turnstile-response'],
    getClientIp(request),
  );
  if (!captchaOk) return loginErrorResponse(request, body, 'captcha_failed', 403);

  const valid = await verifyAdminCredentials(body.email || '', body.password || '');
  if (!valid) return loginErrorResponse(request, body, 'invalid_credentials', 401);

  const { token } = await createAdminSession();

  if (wantsHtmlRedirect(request, body)) {
    return adminRedirect('/admin', 302, { 'Set-Cookie': buildSessionCookie(token) });
  }

  return adminJson(
    { success: true },
    200,
    { 'Set-Cookie': buildSessionCookie(token) },
  );
};
