---
title: "Building Multi-Tenant SaaS in Laravel — Isolation Strategies That Survive Production"
excerpt: "A practical comparison of separate databases, shared schemas, and tenant columns: when to choose each model and how to avoid data leaks and technical debt."
category: "Architecture"
publishedAt: 2025-09-10
readingTime: 20
tags:
  - Laravel
  - Multi-Tenancy
  - SaaS
  - Architecture
cover: /images/articles/multi-tenant-laravel.svg
translationOf: multi-tenant-laravel
---

Building a multi-tenant SaaS platform is not just adding a `tenant_id` column to every table. The real question is: **where does isolation begin, and where does it end?**

After leading several enterprise platforms — e-learning, events, grants, memberships — I learned that the multi-tenancy model you choose on day one determines maintenance cost for years.

## Three models, three trade-offs

### 1. Database-per-tenant

Each customer gets a separate database. Maximum isolation. Suitable for enterprise clients demanding strict compliance contracts.

**Pros:**
- Near-physical data isolation — a query mistake won't expose a neighbor's data
- Per-client backup and restore
- Ability to move a large client to dedicated infrastructure

**Cons:**
- High operational cost (hundreds of connections, duplicated migrations)
- CI/CD complexity: every migration must run across N databases
- Cross-tenant reporting is painful

In Laravel, packages like `stancl/tenancy` simplify connection switching, but **they don't simplify managing 200 databases**.

### 2. Shared schema + tenant_id column

The most common model. One table, filter with `where tenant_id = ?` on every query.

**Pros:**
- Operational simplicity — one database, one migration path
- Easier reporting and analytics
- Lower startup cost

**Cons:**
- Data leak risk if you forget the filter in one query
- Massive tables as tenants grow
- Hard to customize schema for a single client

**Golden rule:** Global Scope on every Eloquent model carrying `tenant_id`. No exceptions. Automated tests verifying every raw query includes the filter.

```php
protected static function booted(): void
{
    static::addGlobalScope('tenant', function (Builder $builder) {
        if ($tenantId = tenant()?->id) {
            $builder->where('tenant_id', $tenantId);
        }
    });
}
```

### 3. Schema-per-tenant within one database

A middle ground. Each tenant gets a dedicated PostgreSQL schema (`tenant_abc`, `tenant_xyz`).

Rare in Laravel but useful when you need stronger isolation than a column without the cost of separate databases.

## How to choose

| Criterion | DB-per-tenant | Shared + column | Schema-per-tenant |
|-----------|---------------|-----------------|-------------------|
| Tenant count | < 50 enterprise | 50 – 10,000 | 100 – 500 |
| Compliance | Very high | Medium | High |
| Team size | Large | Small–medium | Medium |
| Infra cost | High | Low | Medium |

## Common production mistakes I've seen

**1. Tenant leakage through Cache**

Caching `User::find(1)` in Redis without a tenant prefix means tenant A may read tenant B's user if keys collide.

Fix: `Cache::tags(['tenant:'.$tenantId])` or mandatory key prefixes.

**2. Shared files on S3**

Path `/uploads/avatar.jpg` without a tenant folder = disaster. Always use `/tenants/{id}/uploads/`.

**3. Queues without tenant context**

A job runs without knowing the current tenant. Pass `tenantId` in the payload and restore the connection in `handle()`.

**4. Full-text search**

One Elasticsearch index for the whole platform? Mandatory filtering. Separate index per large tenant? Better performance.

## Tenant resolution: the critical layer

In Laravel, resolution typically happens via:
- **Subdomain:** `acme.platform.com`
- **Custom domain:** `portal.client.com`
- **Header:** `X-Tenant-ID` for APIs

Middleware resolves the tenant, checks status (active? paid?), and sets context.

## Migrating between models

The real scenario: you started with shared schema, a large enterprise client demands isolation. The answer isn't rewriting the platform — it's a **migration path**:

1. Freeze client data (read-only mode)
2. Export to separate database/schema
3. Update resolver to route this client to the new connection
4. Verify integrity (checksums, record counts)
5. Open access

## Conclusion

There is no universally "best" model. There is a model **appropriate for your product stage and contracts**.

- Start with **shared schema + global scopes** if tenants < 500 and compliance isn't strict.
- Move to **DB-per-tenant** when a contract or data volume forces it — not because it looks "cleaner" in a diagram.
- Invest early in **tenant leak tests** — far cheaper than explaining a data breach.

Multi-tenancy isn't a marketing feature. It's a daily operational commitment.
