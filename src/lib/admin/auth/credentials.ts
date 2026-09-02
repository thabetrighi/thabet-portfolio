import { env } from 'cloudflare:workers';
import { verifyAdminPassword } from './password';
import { timingSafeEqual } from './crypto';

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const configuredEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  const submittedEmail = email.trim().toLowerCase();

  if (configuredEmail && !timingSafeEqual(submittedEmail, configuredEmail)) {
    return false;
  }

  return verifyAdminPassword(password);
}

export function getAdminEmailHint(): string | null {
  return env.ADMIN_EMAIL?.trim() || null;
}
