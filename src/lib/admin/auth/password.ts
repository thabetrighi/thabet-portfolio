import { env } from 'cloudflare:workers';
import { verifyPassword, timingSafeEqual } from './crypto';

const PASSWORD_SALT = 'thabet-portfolio-admin-v1';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const plainPassword = env.ADMIN_PASSWORD;
  const passwordHash = env.ADMIN_PASSWORD_HASH;

  if (passwordHash) {
    return verifyPassword(password, passwordHash, PASSWORD_SALT);
  }

  if (plainPassword) {
    return timingSafeEqual(password, plainPassword);
  }

  return false;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(env.ADMIN_PASSWORD || env.ADMIN_PASSWORD_HASH);
}
