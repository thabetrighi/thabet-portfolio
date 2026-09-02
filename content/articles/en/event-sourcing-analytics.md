---
title: Why I Prefer Event Sourcing for Analytics Pipelines
excerpt: Event sourcing isn't just a buzzword — it's a practical pattern for building analytics systems that need to handle late-arriving data and schema changes gracefully.
category: Architecture
publishedAt: 2025-11-15
readingTime: 8
tags:
  - Event Sourcing
  - Analytics
  - Architecture
cover: /images/articles/event-sourcing.svg
---

When we started building our analytics platform, the conventional wisdom was to use a star schema with nightly ETL jobs. That worked for the first six months. Then we hit three problems simultaneously.

## The late data problem

Mobile clients would buffer events offline and send them hours later. Our nightly ETL would miss these entirely, creating gaps in daily reports that customers noticed immediately.

## The schema evolution problem

Product teams wanted to add new event properties weekly. Altering fact tables in a star schema meant downtime and backfills that took days.

## Why events first

With event sourcing, every piece of data enters as an immutable event. Late arrivals are just more events. Schema changes are additive — new fields appear in new events without touching historical data.

```typescript
interface AnalyticsEvent {
  id: string;
  tenantId: string;
  type: string;
  timestamp: string;
  properties: Record<string, unknown>;
  receivedAt: string;
}
```

The `receivedAt` field is separate from `timestamp` — this distinction alone solved 80% of our data quality issues.

## Aggregation strategy

We don't query raw events for dashboards. Instead, background workers project events into aggregated tables:

1. **Hourly rollups** — refreshed every 5 minutes
2. **Daily rollups** — refreshed every hour
3. **Monthly rollups** — refreshed daily

This gives us the flexibility of event sourcing with the query performance of pre-computed views.

## When not to use this

Event sourcing adds complexity. If your analytics needs are simple — a few counters, basic funnels — a traditional approach is faster to ship. We switched because our scale and schema volatility demanded it.

The pattern paid off when we needed to replay three months of events after fixing a classification bug. With a star schema, that would have been a week-long migration. With events, it was a background job that finished overnight.
