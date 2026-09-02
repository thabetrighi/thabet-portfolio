---
title: Déployer Laravel sur Cloudflare Workers — Ce qui fonctionne vraiment
excerpt: Guide pratique pour exécuter des workloads PHP/Laravel en edge, incluant ce qu'il faut déplacer vers Workers et ce qu'il faut garder.
category: Infrastructure
publishedAt: 2026-01-20
readingTime: 6
tags:
  - Cloudflare
  - Laravel
  - Edge
cover: /images/articles/cloudflare-laravel.svg
translationOf: cloudflare-laravel
---

Les Workers Cloudflare sont excellents pour certains workloads. Laravel est excellent pour d'autres. L'erreur est d'essayer de tout faire sur l'un ou l'autre.

## Ce qui va sur Workers

- **Routage et authentification** — validation JWT, limitation de débit
- **Cache de réponses** — réponses API statiques et semi-statiques
- **Récepteurs webhook** — ingestion légère avec forwarding vers queue

## Ce qui reste sur l'infrastructure traditionnelle

- **Opérations base de données lourdes** — requêtes complexes, transactions
- **Traitement de jobs en arrière-plan** — workers de queue, tâches planifiées

## Le pattern hybride

```
Client → Cloudflare Worker (auth, cache)
       → Laravel API (logique métier)
       → PostgreSQL
```

Les Workers gèrent le chemin chaud. Laravel gère le chemin lourd.
