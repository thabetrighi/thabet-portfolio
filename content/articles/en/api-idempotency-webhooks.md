---
title: "Idempotency Keys and Webhooks — The Exactly-Once Illusion in Payment Systems"
excerpt: "Why duplicate payment operations fail, how to design correct idempotency keys, and handle late or duplicate webhooks without breaking accounting."
category: "API Design"
publishedAt: 2025-12-01
readingTime: 19
tags:
  - API
  - Payments
  - Webhooks
  - Idempotency
cover: /images/articles/api-idempotency-webhooks.svg
translationOf: api-idempotency-webhooks
---

In a real payment system, the question isn't "will the client send the same request twice?" but "**when** will they?"

Network drops, double-clicks, mobile auto-retry, late gateway webhooks — all daily scenarios.

## Idempotency Key: the contract

The client generates a unique key per logical operation. The server guarantees the same key = same result, no matter how many times the request arrives.

### Key lifecycle

1. **First request** — server starts transaction, records key as `processing`
2. **Duplicate (same key, same body)** — return same response without re-execution
3. **Duplicate (same key, different body)** — 409 Conflict
4. **Expiry** — delete key after 24–72 hours

Use `lockForUpdate()` and store request hash + response.

## Webhooks: the inverted world

With REST, the client controls timing. With webhooks, **the external server decides when to send**.

### Real problems

- **Duplicate delivery** — same event 3 times
- **Late delivery** — week-old event arrives today
- **Wrong order** — `completed` before `pending`
- **Invalid signature** — attack or key mismatch

### Safe handling pattern

Verify signature → check `event_id` deduplication → dispatch to queue → return 202 within 5 seconds.

**Golden rule:** respond to webhooks in under 5 seconds. Heavy processing in a job.

### Event ordering

Don't rely on order. Use a **state machine**. Store out-of-order events and apply when state allows.

## Reconciliation

Even with perfect idempotency, **ledgers must match**.

Daily scheduled job:
1. Fetch gateway transactions (last 48h)
2. Compare with our records
3. Alert on mismatch

This saved me more than once when a webhook failed silently.

## Conclusion

**Exactly-once** is an illusion in distributed systems. The realistic goal: **at-least-once delivery + idempotent processing = effectively once**.

Design for it on day one — adding it later is orders of magnitude more expensive.
