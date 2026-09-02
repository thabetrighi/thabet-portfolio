import { env } from 'cloudflare:workers';
import { requireAdminSession } from '../auth/session';
import { adminError } from '../api/response';

export async function requireAdminApi(request: Request): Promise<Response | null> {
  const session = await requireAdminSession(request);
  if (!session) {
    return adminError('unauthorized', 401);
  }

  const rateLimiter = env.ADMIN_RATE_LIMITER;
  if (rateLimiter?.limit) {
    const { success } = await rateLimiter.limit({ key: `admin:${session.id}` });
    if (!success) {
      return adminError('rate_limited', 429);
    }
  }

  return null;
}
