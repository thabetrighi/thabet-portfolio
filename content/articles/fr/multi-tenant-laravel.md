---
title: "Construire un SaaS multi-tenant avec Laravel — stratégies d'isolation qui tiennent en production"
excerpt: "Comparaison pratique des bases séparées, schémas partagés et colonnes tenant : quand choisir chaque modèle et comment éviter les fuites de données."
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

Construire une plateforme SaaS multi-tenant ne se résume pas à ajouter une colonne `tenant_id` sur chaque table. La vraie question : **où commence l'isolation, et où s'arrête-t-elle ?**

Après avoir dirigé plusieurs plateformes d'entreprise — e-learning, événements, subventions, adhésions — j'ai appris que le modèle choisi le jour J détermine le coût de maintenance pendant des années.

## Trois modèles, trois compromis

### 1. Base de données par tenant

Chaque client dispose d'une base séparée. Isolation maximale. Adapté aux clients exigeant des contrats de conformité stricts.

**Avantages :** isolation quasi physique, sauvegarde par client, migration vers infrastructure dédiée possible.

**Inconvénients :** coût opérationnel élevé, complexité CI/CD (migrations × N bases), reporting trans-tenant difficile.

Des packages Laravel comme `stancl/tenancy` simplifient le changement de connexion, mais **pas la gestion de 200 bases**.

### 2. Schéma partagé + colonne tenant_id

Le modèle le plus courant. Une table, filtrage `where tenant_id = ?` sur chaque requête.

**Avantages :** simplicité opérationnelle, reporting plus facile, coût initial bas.

**Inconvénients :** risque de fuite si un filtre est oublié, tables massives, personnalisation par client difficile.

**Règle d'or :** Global Scope sur chaque modèle Eloquent portant `tenant_id`. Aucune exception. Tests automatisés vérifiant chaque requête brute.

### 3. Schéma par tenant dans une même base

Compromis intermédiaire. Chaque tenant a un schéma PostgreSQL dédié.

Rare sous Laravel mais utile pour une isolation supérieure sans le coût de bases séparées.

## Erreurs courantes en production

**1. Fuite via le cache** — clés Redis sans préfixe tenant.

**2. Fichiers S3 partagés** — toujours `/tenants/{id}/uploads/`.

**3. Files sans contexte tenant** — passer `tenantId` dans le payload du job.

**4. Recherche full-text** — filtrage obligatoire ou index séparé par gros tenant.

## Résolution du tenant

- **Sous-domaine :** `acme.platform.com`
- **Domaine personnalisé :** `portal.client.com`
- **Header :** `X-Tenant-ID` pour les API

Un middleware résout le tenant, vérifie son statut et définit le contexte.

## Conclusion

Pas de modèle universellement « meilleur ». Un modèle **adapté à votre stade et vos contrats**.

- Démarrez en **schéma partagé + global scopes** si < 500 tenants et conformité modérée.
- Passez au **DB-per-tenant** quand un contrat l'exige — pas pour l'esthétique d'un diagramme.
- Investissez tôt dans les **tests de fuite tenant**.

Le multi-tenant n'est pas une fonctionnalité marketing. C'est un engagement opérationnel quotidien.
