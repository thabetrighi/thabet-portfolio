---
title: Plateforme d'analytics
excerpt: Tableau de bord multi-tenant traitant 2M d'événements/jour avec des temps de réponse inférieurs à 200ms.
problem: Les clients entreprise avaient besoin d'une visibilité en temps réel sur l'utilisation du produit, mais le système monolithique ne pouvait pas dépasser 500K événements/jour sans latence significative.
solution: Architecture événementielle avec partitionnement PostgreSQL, cache Redis et Workers Cloudflare pour l'agrégation edge. API Laravel avec requêtes optimisées et vues matérialisées.
role: Ingénieur Backend principal — architecture, conception API, optimisation base de données
result: Réduction de la latence P95 de 2,4s à 180ms. La plateforme gère 2M+ événements/jour pour 200+ tenants.
technologies:
  - Laravel
  - PostgreSQL
  - Redis
  - Cloudflare Workers
  - Vue.js
cover: /images/projects/analytics-platform.svg
order: 1
featured: true
translationOf: analytics-platform
---

## Approche

Le défi principal était d'équilibrer les exigences temps réel et la complexité des requêtes. Nous avons choisi un pattern event-sourcing avec ingestion via Workers Cloudflare en edge.

## Architecture

- **Ingestion** : Workers Cloudflare reçoivent les événements et les poussent vers un stream Redis
- **Traitement** : Workers Laravel consomment les événements et écrivent dans des tables PostgreSQL partitionnées
- **Requêtes** : Vues matérialisées rafraîchies toutes les 5 minutes
- **Frontend** : SPA Vue.js avec composants graphiques

## Leçons apprises

Commencez par les patterns de requête, pas les modèles de données. Comprendre comment les utilisateurs filtrent réellement les données a informé notre stratégie de partitionnement.
