---
title: "Distributed Transactions Without Two-Phase Commit — Saga Pattern in Laravel"
excerpt: "When a transaction spans more than one database: orchestration vs choreography, compensating actions, and consistency across payment and notification services."
category: "Architecture"
publishedAt: 2026-03-20
readingTime: 21
tags:
  - Laravel
  - Saga
  - Distributed Systems
  - Transactions
cover: /images/articles/database-sagas-laravel.svg
translationOf: database-sagas-laravel
---

One user request: "enroll in the course, pay, send email confirmation, add to WhatsApp group."

In a simple monolith: `DB::transaction()` and done. In a real platform: 4 services, 3 databases, external payment gateway — **no single ACID transaction covers this**.

## Why Two-Phase Commit fails on the web

2PC requires all participants to lock resources until decision. An external payment gateway won't lock your table. An email service won't wait for your DB commit.

Practical alternative: **Saga** — a chain of local transactions, each compensatable.

## Orchestration vs Choreography

### Orchestration (central coordinator)

One service drives the flow. Clear visibility. Good for complex flows, single team.

### Choreography (event dance)

Each service listens and reacts. Good for independent teams, horizontal scale. Harder to trace and debug.

## Implementing Saga in Laravel

### saga_instances table

Track `type`, `status`, `current_step`, `payload`.

### Each step = Job

On failure, dispatch `CompensateSagaJob`.

## Compensation

Not rollback — **inverse action**:

| Step | Compensation |
|------|--------------|
| Create enrollment | Delete/cancel enrollment |
| Charge payment | Refund |
| Send email | Send cancellation email (can't "unsend") |
| Create invoice | Credit note |

Every step needs a predefined compensation — or be explicitly marked non-compensatable.

## Eventual consistency

Between step 2 and 3, state is "paid but no confirmation sent." User may see this.

Handle with intermediate UI state, polling/WebSocket, reconciliation for stuck states.

## Outbox Pattern

Save business data + outbox event in same DB transaction. Separate worker publishes to queue — guaranteed delivery even if publisher crashes.

## When you don't need Saga

- Single service + single DB → `DB::transaction()`
- Non-critical failure (email) → fire-and-forget with retry
- Read-only → no saga

Saga for **critical multi-step operations across service boundaries**.

## Conclusion

Distributed systems don't give you ACID across services. They give you **choices**:

1. Orchestrated saga — control, clarity, central complexity
2. Choreographed saga — decoupling, distributed complexity
3. Outbox — guaranteed event delivery

Choose consciously. Document compensations. Test failure paths — because they **will happen**.
