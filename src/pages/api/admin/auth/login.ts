import type { APIRoute } from 'astro';
import { verifyTurnstileToken } from '../../../../lib/turnstile';
import { verifyAdminCredentials } from '../../../../lib/admin/auth/credentials';
import { isAdminAuthConfigured } from '../../../../lib/admin/auth/password';
import {
  buildSessionCookie,
  createAdminSession,
} from '../../../../lib/admin/auth/session';
import { adminError, adminJson, parseJsonBody } from '../../../../lib/admin/api/response';
import { getClientIp } from '../../../../lib/security';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface LoginBody {
  email: string;
  password: string;
  'cf-turnstile-response'?: string;
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminAuthConfigured()) {
    return adminError('admin_not_configured', 503);
  }

  const rateLimiter = env.ADMIN_LOGIN_RATE_LIMITER;
  if (rateLimiter?.limit) {
    const { success } = await rateLimiter.limit({ key: `login:${getClientIp(request)}` });
    if (!success) return adminError('rate_limited', 429);
  }

  const body = await parseJsonBody<LoginBody>(request);
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret) {
    return adminError('turnstile_not_configured', 503);
  }

  if (!body['cf-turnstile-response']) {
    return adminError('captcha_required', 400);
  }

  const captchaOk = await verifyTurnstileToken(
    turnstileSecret,
    body['cf-turnstile-response'],
    getClientIp(request),
  );
  if (!captchaOk) return adminError('captcha_failed', 403);

  const valid = await verifyAdminCredentials(body.email || '', body.password || '');
  if (!valid) return adminError('invalid_credentials', 401);

  const { token } = await createAdminSession();
  return adminJson(
    { success: true },
    200,
    { 'Set-Cookie': buildSessionCookie(token) },
  );
};
