import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactBody {
  name: string;
  email: string;
  message: string;
  'cf-turnstile-response'?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
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

    // Verify Turnstile token
    const turnstileSecret = (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env?.TURNSTILE_SECRET_KEY
      || import.meta.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret && turnstileToken) {
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

    // In production: send via Cloudflare Email Workers / Resend / etc.
    // Secrets stay server-side only.
    const contactEmail = (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env?.CONTACT_EMAIL
      || import.meta.env.CONTACT_EMAIL
      || 'contact@thabetrighi.com';

    // Log for dev; replace with actual email sending in production
    console.log('Contact form submission:', { name, email, message, to: contactEmail });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
