import { env } from 'cloudflare:workers';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_KV_PREFIX,
  ADMIN_SESSION_TTL_SECONDS,
} from '../config';
import type { AdminSession } from '../types';
import { generateSessionToken, isSessionValid } from './crypto';

function getKv() {
  const kv = env.SESSION as KVNamespace | undefined;
  if (!kv) throw new Error('SESSION KV binding is not configured');
  return kv;
}

export async function createAdminSession(): Promise<{ token: string; session: AdminSession }> {
  const token = generateSessionToken();
  const now = Date.now();
  const session: AdminSession = {
    id: token,
    createdAt: now,
    expiresAt: now + ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  await getKv().put(`${ADMIN_SESSION_KV_PREFIX}${token}`, JSON.stringify(session), {
    expirationTtl: ADMIN_SESSION_TTL_SECONDS,
  });
  return { token, session };
}

export async function getAdminSession(token: string | null | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  const raw = await getKv().get(`${ADMIN_SESSION_KV_PREFIX}${token}`);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AdminSession;
    return isSessionValid(session) ? session : null;
  } catch {
    return null;
  }
}

export async function destroyAdminSession(token: string | null | undefined): Promise<void> {
  if (!token) return;
  await getKv().delete(`${ADMIN_SESSION_KV_PREFIX}${token}`);
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

export function buildSessionCookie(token: string, maxAge = ADMIN_SESSION_TTL_SECONDS): string {
  return `${ADMIN_SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function buildLogoutCookie(): string {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function requireAdminSession(request: Request): Promise<AdminSession | null> {
  const token = getSessionTokenFromRequest(request);
  return getAdminSession(token);
}
