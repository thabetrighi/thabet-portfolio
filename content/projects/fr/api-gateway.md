---
title: Passerelle API
excerpt: Passerelle API unifiée avec limitation de débit, authentification et routage pour 12 microservices.
problem: L'architecture microservices grandissante avait une authentification incohérente et aucune limitation centralisée.
solution: Passerelle basée sur Cloudflare Workers gérant la validation JWT, la limitation par tenant et le routage des requêtes.
role: Ingénieur Full-Stack — architecture passerelle, middleware auth
result: Temps d'intégration client réduit de 2 semaines à 2 jours. Auth centralisée éliminant 3 implémentations dupliquées.
technologies:
  - Cloudflare Workers
  - TypeScript
  - Redis
  - OpenAPI
cover: /images/projects/api-gateway.svg
order: 2
featured: true
translationOf: api-gateway
---

## Contexte

Avec 12 microservices, chaque équipe avait implémenté sa propre authentification. Les clients luttaient avec des endpoints multiples.

## Résultats

Point d'entrée unique. Réponses d'erreur cohérentes. Cache edge réduisant les requêtes origin de 40%.
