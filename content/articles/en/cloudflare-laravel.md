---
title: Deploying Laravel on Cloudflare Workers — What Actually Works
excerpt: A practical guide to running PHP/Laravel workloads at the edge, including what to move to Workers and what to keep on traditional infrastructure.
category: Infrastructure
publishedAt: 2026-01-20
readingTime: 6
tags:
  - Cloudflare
  - Laravel
  - Edge
cover: /images/articles/cloudflare-laravel.svg
---

Cloudflare Workers are excellent for certain workloads. Laravel is excellent for others. The mistake is trying to run everything on one or the other.

## What belongs on Workers

After deploying several projects on Cloudflare's stack, here's what consistently works well at the edge:

- **Request routing and authentication** — JWT validation, API key checks, rate limiting
- **Response caching** — Static and semi-static API responses
- **Webhook receivers** — Lightweight event ingestion with queue forwarding
- **Asset serving** — Images, static files with transformation

## What stays on traditional infrastructure

- **Database-heavy operations** — Complex queries, transactions, migrations
- **Background job processing** — Queue workers, scheduled tasks
- **File processing** — Image manipulation, PDF generation, large uploads

## The hybrid pattern

Our current architecture uses Workers as a smart proxy layer:

```
Client → Cloudflare Worker (auth, cache, rate limit)
       → Laravel API (business logic, database)
       → PostgreSQL
```

Workers handle the "hot path" — requests that need to be fast and secure. Laravel handles the "heavy path" — operations that need a full runtime and database connections.

## Practical tips

1. Use Workers for CORS handling — it's cleaner than Laravel middleware for public APIs
2. Cache `GET` responses at the edge with short TTLs (30-60 seconds)
3. Never put database credentials in Workers — always proxy to your backend
4. Use Cloudflare's `cf-ipcountry` header for geo-routing instead of IP geolocation libraries

The goal isn't to eliminate your Laravel app. It's to make the common case fast and keep the complex case possible.
