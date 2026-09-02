---
title: "RBAC au-delà des rôles — frontières de permissions dans les plateformes Laravel d'entreprise"
excerpt: "Des rôles simples aux politiques complexes : permissions au niveau ressource, délégation temporaire et audit — sans labyrinthe de if dans chaque contrôleur."
category: "Sécurité"
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

`@can('edit-post')` convient à un blog. Une plateforme d'entreprise avec 15 rôles et 200 permissions ? Cauchemar.

## Quand le RBAC simple casse

Permissions par ressource, délégation temporaire, contexte dynamique, audit.

## Trois couches

1. **Rôles** — regroupement
2. **Permissions** — actions atomiques (`resource.action.scope`)
3. **Policies** — logique complexe

## Tenant + RBAC

Permissions sans contexte tenant inutiles en SaaS multi-tenant.

## Délégation temporaire

Table `delegations` avec dates de validité.

## Audit

Chaque changement de permission journalisé.

## Performance

Cache des permissions, eager load, `Gate::before()` limité au super-admin.

## Conclusion

RBAC entreprise = rôles + permissions atomiques + policies + audit. Construire les couches dès le départ.
