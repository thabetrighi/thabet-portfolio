export interface DailyAnalytics {
  pageviews: number;
  visitorIds: string[];
  pages: Record<string, number>;
  referrers: Record<string, number>;
}

export interface AnalyticsSummary {
  today: {
    pageviews: number;
    visitors: number;
  };
  last7Days: {
    pageviews: number;
    visitors: number;
  };
  daily: Array<{
    date: string;
    pageviews: number;
    visitors: number;
  }>;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ source: string; views: number }>;
}

export interface CollectPayload {
  path: string;
  referrer?: string;
  visitorId: string;
}
