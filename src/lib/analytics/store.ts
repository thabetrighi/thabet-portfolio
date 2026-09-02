import { env } from 'cloudflare:workers';
import {
  ANALYTICS_KV_PREFIX,
  ANALYTICS_MAX_TOP_ITEMS,
  ANALYTICS_MAX_VISITOR_IDS,
  ANALYTICS_RETENTION_DAYS,
} from './config';
import type { AnalyticsSummary, CollectPayload, DailyAnalytics } from './types';

function getKv(): KVNamespace {
  const kv = env.SESSION as KVNamespace | undefined;
  if (!kv) throw new Error('SESSION KV binding is not configured');
  return kv;
}

function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function storageKey(date: string): string {
  return `${ANALYTICS_KV_PREFIX}${date}`;
}

function emptyDaily(): DailyAnalytics {
  return {
    pageviews: 0,
    visitorIds: [],
    pages: {},
    referrers: {},
  };
}

function normalizePath(path: string): string {
  const trimmed = path.split('?')[0]?.split('#')[0] || '/';
  if (trimmed.length > 200) return trimmed.slice(0, 200);
  return trimmed || '/';
}

function normalizeReferrer(referrer?: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (!host || host === 'thabetrighi.com') return null;
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

function bumpCounter(map: Record<string, number>, key: string) {
  map[key] = (map[key] || 0) + 1;
}

function topPages(map: Record<string, number>, limit = ANALYTICS_MAX_TOP_ITEMS) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([path, views]) => ({ path, views }));
}

function topReferrers(map: Record<string, number>, limit = ANALYTICS_MAX_TOP_ITEMS) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([source, views]) => ({ source, views }));
}

async function readDay(date: string): Promise<DailyAnalytics> {
  const raw = await getKv().get(storageKey(date));
  if (!raw) return emptyDaily();
  try {
    const parsed = JSON.parse(raw) as DailyAnalytics;
    return {
      pageviews: parsed.pageviews || 0,
      visitorIds: Array.isArray(parsed.visitorIds) ? parsed.visitorIds : [],
      pages: parsed.pages || {},
      referrers: parsed.referrers || {},
    };
  } catch {
    return emptyDaily();
  }
}

async function writeDay(date: string, data: DailyAnalytics): Promise<void> {
  await getKv().put(storageKey(date), JSON.stringify(data), {
    expirationTtl: ANALYTICS_RETENTION_DAYS * 24 * 60 * 60,
  });
}

export async function recordPageView(payload: CollectPayload): Promise<void> {
  const date = dayKey();
  const daily = await readDay(date);
  const path = normalizePath(payload.path);
  const referrer = normalizeReferrer(payload.referrer);
  const visitorId = payload.visitorId.slice(0, 64);

  daily.pageviews += 1;
  bumpCounter(daily.pages, path);

  if (referrer) {
    bumpCounter(daily.referrers, referrer);
  }

  if (visitorId && !daily.visitorIds.includes(visitorId) && daily.visitorIds.length < ANALYTICS_MAX_VISITOR_IDS) {
    daily.visitorIds.push(visitorId);
  }

  await writeDay(date, daily);
}

function aggregateDays(days: DailyAnalytics[]) {
  const pages: Record<string, number> = {};
  const referrers: Record<string, number> = {};
  let pageviews = 0;
  let visitors = 0;

  for (const day of days) {
    pageviews += day.pageviews;
    visitors += day.visitorIds.length;
    for (const [path, count] of Object.entries(day.pages)) {
      pages[path] = (pages[path] || 0) + count;
    }
    for (const [source, count] of Object.entries(day.referrers)) {
      referrers[source] = (referrers[source] || 0) + count;
    }
  }

  return { pageviews, visitors, pages, referrers };
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const dates: string[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - i);
    dates.push(dayKey(date));
  }

  const days = await Promise.all(dates.map((date) => readDay(date)));
  const today = days[days.length - 1] || emptyDaily();
  const week = aggregateDays(days);

  return {
    today: {
      pageviews: today.pageviews,
      visitors: today.visitorIds.length,
    },
    last7Days: {
      pageviews: week.pageviews,
      visitors: week.visitors,
    },
    daily: dates.map((date, index) => ({
      date,
      pageviews: days[index]?.pageviews || 0,
      visitors: days[index]?.visitorIds.length || 0,
    })),
    topPages: topPages(week.pages),
    topReferrers: topReferrers(week.referrers),
  };
}
