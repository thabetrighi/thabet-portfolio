import type { z } from 'zod';
import { ADMIN_LIMITS } from './config';
import { adminError } from './api/response';
import { formatZodError } from './schemas/content';

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function parseValidatedJsonBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  const lengthHeader = request.headers.get('content-length');
  if (lengthHeader && Number(lengthHeader) > ADMIN_LIMITS.markdownMaxBytes * 2) {
    return { ok: false, response: adminError('payload_too_large', 413) };
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: adminError('invalid_json', 400) };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return { ok: false, response: adminError(formatZodError(result.error), 400) };
  }

  return { ok: true, data: result.data };
}
