---
title: "RBAC Beyond Roles — Permission Boundaries in Enterprise Laravel Platforms"
excerpt: "From simple roles to complex policies: resource-level permissions, temporary delegation, and audit trails — without turning every controller into an if-maze."
category: "Security"
publishedAt: 2026-02-15
readingTime: 17
tags:
  - Laravel
  - RBAC
  - Security
  - Enterprise
cover: /images/articles/laravel-rbac-enterprise.svg
translationOf: laravel-rbac-enterprise
---

`@can('edit-post')` works great for a blog. An enterprise platform with 15 roles, 200 permissions, and multiple teams? It becomes a nightmare.

## When simple RBAC breaks

- **Resource-level permissions:** "edit only their own events"
- **Temporary delegation:** "regional manager approves on behalf of GM for a week"
- **Dynamic context:** "view financial reports for their branch only"
- **Audit:** "who changed this user's permissions?"

## Three layers

### 1. Roles — grouping only

Role `event-manager` bundles permissions. It doesn't execute logic.

### 2. Permissions — atomic actions

`events.create`, `events.update.own`, `events.update.any`, `reports.financial.view`

Naming: `resource.action.scope`

### 3. Policies — complex logic

Policies handle own vs any, tenant context, and business rules.

## Tenant scope + RBAC

In multi-tenant SaaS, permissions without tenant context are useless. Use team-scoped permissions (e.g. spatie/laravel-permission with team ID).

## Temporary delegation

`delegations` table with `delegator_id`, `delegate_id`, `permission`, `starts_at`, `ends_at`.

## Audit: non-negotiable

Every permission change logged with actor, target, action, IP.

## Performance

200 permissions × 50 req/s = disaster if every request hits DB.

Solutions: cache user permissions (5–15 min TTL), eager load at request start, `Gate::before()` only for super-admin.

## Conclusion

Enterprise RBAC = roles for grouping + atomic permissions + policies for logic + audit for compliance.

Build layers from day one. Adding policies to 200 controllers later is a project in itself.
