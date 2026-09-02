---
title: "Laravel Queues at Scale — Reliability, Backpressure, and Observability"
excerpt: "From Redis to Horizon: designing jobs that don't get lost, smart retries, dead-letter queues, and spotting bottlenecks before customers complain."
category: "Infrastructure"
publishedAt: 2025-10-05
readingTime: 18
tags:
  - Laravel
  - Queues
  - Redis
  - Horizon
cover: /images/articles/laravel-queue-production.svg
translationOf: laravel-queue-production
---

Queues in Laravel feel simple in development: `dispatch(new SendInvoice($order))` and you're done. In production with thousands of jobs per day, the story is completely different.

## Why queues fail silently

Silent failure is worse than a loud crash. A job gets lost, an invoice never sends, a client never gets notified — and nobody knows until the user complains.

Common causes:
- **Worker timeout** — job needs 5 minutes, worker kills it after 60 seconds
- **Memory** — loading 50,000 records in one job
- **Serialization** — passing a full Eloquent model with relationships
- **Race conditions** — same job runs twice after retry

## Job design: non-negotiable rules

### 1. Small, retryable jobs

Split large work into chunks. One monthly report job becomes hundreds of per-user chunk jobs.

### 2. Pass IDs, not models

Reload the model in `handle()`. It may change or be deleted between dispatch and execution.

### 3. Set $tries and $backoff deliberately

Instant retry × 100 on an external API error = IP ban.

## Horizon: beyond the dashboard

Use Horizon for auto-scaling workers, queue separation (`high`, `default`, `low`, `webhooks`), and throughput metrics.

## Dead letter handling

After exhausting retries, don't leave jobs in `failed_jobs` and forget them.

Pattern:
1. `failed()` logs full context
2. Alert Slack/PagerDuty for critical jobs (payments, cancellations)
3. Admin UI for manual retry with review

## Idempotency in jobs

Payment webhook arrives twice? Job runs twice?

Use `Cache::lock()` and check if already processed before acting.

## Monitoring

| Metric | Alert threshold |
|--------|-----------------|
| Queue depth (webhooks) | > 500 for 5+ minutes |
| Job runtime p95 | > 60 seconds |
| Failed jobs / hour | > 10 |
| Worker memory | > 80% |

## Scheduled tasks vs queued jobs

`$schedule->command()->daily()` runs on **one server**. If it's down, no report.

Better: scheduler dispatches jobs to the queue. Workers on multiple servers compete — no single point of failure.

## Conclusion

Queues aren't "send email in the background." They're the **backbone of reliability**.

- Shrink jobs
- Pass IDs
- Separate queues by priority
- Monitor depth and failures
- Make critical jobs idempotent

When the system runs silently for months, you built it right — not got lucky.
