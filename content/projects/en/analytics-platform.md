---
title: Analytics Platform
excerpt: Multi-tenant analytics dashboard processing 2M events daily with sub-200ms query response times.
problem: Enterprise clients needed real-time visibility into product usage across multiple tenants, but the existing monolithic reporting system couldn't scale beyond 500K events per day without significant latency.
solution: Designed an event-driven architecture with PostgreSQL partitioning, Redis caching, and Cloudflare Workers for edge aggregation. Built a Laravel API layer with optimized query patterns and materialized views.
role: Lead Backend Engineer — architecture, API design, database optimization
result: Reduced P95 query latency from 2.4s to 180ms. Platform now handles 2M+ events/day across 200+ tenants with 99.9% uptime.
technologies:
  - Laravel
  - PostgreSQL
  - Redis
  - Cloudflare Workers
  - Vue.js
cover: /images/projects/analytics-platform.svg
order: 1
featured: true
github: https://github.com/thabet/analytics-platform
demo: https://analytics-demo.thabet.dev
---

## Approach

The core challenge was balancing real-time requirements with query complexity. We chose an event-sourcing pattern where raw events are ingested via Cloudflare Workers at the edge, then processed asynchronously into aggregated tables.

## Architecture

- **Ingestion layer**: Cloudflare Workers receive events via HTTP, validate schema, and push to a Redis stream
- **Processing layer**: Laravel queue workers consume events, apply business rules, and write to partitioned PostgreSQL tables
- **Query layer**: Pre-computed materialized views refreshed every 5 minutes for dashboard queries
- **Frontend**: Vue.js SPA with chart components, consuming a GraphQL API

## Challenges

The biggest challenge was handling tenant isolation at scale. We implemented row-level security in PostgreSQL combined with application-level tenant scoping, with automated tests verifying no cross-tenant data leakage.

## Lessons learned

Start with query patterns, not data models. Understanding how users actually filter and aggregate data informed our partitioning strategy more than any theoretical normalization approach.
