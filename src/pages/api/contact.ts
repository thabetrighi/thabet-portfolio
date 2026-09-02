import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { buildContactEmailBody, EMAIL_FROM, EMAIL_TO } from '../../lib/email';

export const prerender = false;

interface ContactBody {
  name: string;
  email: string;
  message: string;
  'cf-turnstile-response'?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as ContactBody;
    const { name, email, message, 'cf-turnstile-response': turnstileToken } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({ error: 'Captcha required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      });
      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        return new Response(JSON.stringify({ error: 'Captcha verification failed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const emailBinding = env.EMAIL;
    if (!emailBinding?.send) {
      return new Response(JSON.stringify({ error: 'Email service unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const recipient = env.CONTACT_EMAIL || EMAIL_TO;
    const { text, html } = buildContactEmailBody(name.trim(), email.trim(), message.trim());

    await emailBinding.send({
      to: recipient,
      from: { email: EMAIL_FROM, name: 'Thabet Portfolio' },
      replyTo: { email: email.trim(), name: name.trim() },
      subject: `Portfolio contact: ${name.trim()}`,
      text,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
