import { env } from 'cloudflare:workers';

export const ADMIN_STATS_CACHE_KEY = 'admin:stats:cache:v1';
export const ADMIN_STATS_CACHE_TTL_SECONDS = 120;

export interface CachedStatsEnvelope<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

function getKv(): KVNamespace {
  const kv = env.SESSION as KVNamespace | undefined;
  if (!kv) throw new Error('SESSION KV binding is not configured');
  return kv;
}

export async function readStatsCache<T>(): Promise<CachedStatsEnvelope<T> | null> {
  try {
    const raw = await getKv().get(ADMIN_STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedStatsEnvelope<T>;
    if (!parsed?.expiresAt || parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeStatsCache<T>(data: T): Promise<void> {
  const now = Date.now();
  const envelope: CachedStatsEnvelope<T> = {
    data,
    cachedAt: now,
    expiresAt: now + ADMIN_STATS_CACHE_TTL_SECONDS * 1000,
  };

  await getKv().put(ADMIN_STATS_CACHE_KEY, JSON.stringify(envelope), {
    expirationTtl: ADMIN_STATS_CACHE_TTL_SECONDS + 60,
  });
}

export async function invalidateStatsCache(): Promise<void> {
  try {
    await getKv().delete(ADMIN_STATS_CACHE_KEY);
  } catch {
    // ignore
  }
}
