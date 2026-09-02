---
title: Event Pipeline
excerpt: Real-time event processing pipeline handling webhooks, queue messages, and database changes.
problem: The product needed to react to events from third-party webhooks, internal queue messages, and database triggers — but each had its own processing logic with no unified error handling.
solution: Designed a unified event pipeline with standardized event schemas, dead-letter queues, retry policies, and observability dashboards.
role: Backend Engineer — pipeline design, event schema, monitoring
result: 99.7% event processing success rate. Mean time to detect failures dropped from 4 hours to 12 minutes.
technologies:
  - Node.js
  - Redis
  - PostgreSQL
  - Docker
cover: /images/projects/event-pipeline.svg
order: 3
featured: true
---

## Approach

Every event, regardless of source, is normalized into a standard envelope format before processing. This allows shared retry logic, monitoring, and debugging tools.

## Key decisions

- Idempotency keys on every event to handle duplicates
- Exponential backoff with jitter for retries
- Structured logging with correlation IDs across the pipeline
