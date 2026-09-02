import { site } from './site';

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
  bodyBytes: 16_384,
} as const;

export const ALLOWED_ORIGINS = [
  site.url,
  'https://www.thabetrighi.com',
  'https://thabet-portfolio.righithabt.workers.dev',
  'http://localhost:4891',
  'http://127.0.0.1:4891',
] as const;

export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '0',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "frame-src https://challenges.cloudflare.com",
    "connect-src 'self' https://challenges.cloudflare.com",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
};

export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function getClientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) {
    const fetchSite = request.headers.get('Sec-Fetch-Site');
    return fetchSite === 'same-origin' || fetchSite === 'none' || !fetchSite;
  }

  try {
    const originUrl = new URL(origin);
    return ALLOWED_ORIGINS.some((allowed) => {
      const allowedUrl = new URL(allowed);
      return originUrl.origin === allowedUrl.origin;
    });
  } catch {
    return false;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactFields(
  name: string,
  email: string,
  message: string,
): string | null {
  if (!name || !email || !message) {
    return 'missing_fields';
  }

  if (name.length > CONTACT_LIMITS.name) {
    return 'name_too_long';
  }

  if (email.length > CONTACT_LIMITS.email || !EMAIL_REGEX.test(email)) {
    return 'invalid_email';
  }

  if (message.length > CONTACT_LIMITS.message) {
    return 'message_too_long';
  }

  return null;
}
