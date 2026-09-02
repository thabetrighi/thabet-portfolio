import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { buildContactEmailBody, EMAIL_FROM, EMAIL_TO } from '../../lib/email';
import {
  CONTACT_LIMITS,
  getClientIp,
  isAllowedOrigin,
  jsonResponse,
  validateContactFields,
} from '../../lib/security';
import { verifyTurnstileToken } from '../../lib/turnstile';

export const prerender = false;

interface ContactBody {
  name: string;
  email: string;
  message: string;
  website?: string;
  'cf-turnstile-response'?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405);
    }

    if (!isAllowedOrigin(request)) {
      return jsonResponse({ error: 'forbidden' }, 403);
    }

    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > CONTACT_LIMITS.bodyBytes) {
      return jsonResponse({ error: 'payload_too_large' }, 413);
    }

    const rateLimiter = env.CONTACT_RATE_LIMITER;
    if (rateLimiter?.limit) {
      const clientIp = getClientIp(request);
      const { success } = await rateLimiter.limit({ key: `contact:${clientIp}` });
      if (!success) {
        return jsonResponse({ error: 'rate_limited' }, 429);
      }
    }

    const body = (await request.json()) as ContactBody;
    const {
      name,
      email,
      message,
      website,
      'cf-turnstile-response': turnstileToken,
    } = body;

    // Honeypot — bots fill hidden fields
    if (website?.trim()) {
      return jsonResponse({ success: true }, 200);
    }

    const validationError = validateContactFields(
      name?.trim() ?? '',
      email?.trim() ?? '',
      message?.trim() ?? '',
    );
    if (validationError) {
      return jsonResponse({ error: validationError }, 400);
    }

    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET_KEY is not configured');
      return jsonResponse({ error: 'service_unavailable' }, 503);
    }

    if (!turnstileToken) {
      return jsonResponse({ error: 'captcha_required' }, 400);
    }

    const captchaValid = await verifyTurnstileToken(
      turnstileSecret,
      turnstileToken,
      getClientIp(request),
    );
    if (!captchaValid) {
      return jsonResponse({ error: 'captcha_failed' }, 403);
    }

    const emailBinding = env.EMAIL;
    if (!emailBinding?.send) {
      return jsonResponse({ error: 'service_unavailable' }, 503);
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const recipient = env.CONTACT_EMAIL || EMAIL_TO;
    const { text, html } = buildContactEmailBody(trimmedName, trimmedEmail, trimmedMessage);

    await emailBinding.send({
      to: recipient,
      from: { email: EMAIL_FROM, name: 'Thabet Portfolio' },
      replyTo: { email: trimmedEmail, name: trimmedName },
      subject: `Portfolio contact: ${trimmedName}`,
      text,
      html,
    });

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error('Contact form error:', error);
    return jsonResponse({ error: 'internal_error' }, 500);
  }
};
