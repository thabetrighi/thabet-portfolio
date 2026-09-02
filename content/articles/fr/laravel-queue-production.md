---
title: "Files d'attente Laravel à l'échelle — fiabilité, contre-pression et observabilité"
excerpt: "De Redis à Horizon : concevoir des jobs qui ne se perdent pas, des retries intelligents, des dead-letter queues et détecter les goulots avant les clients."
category: "Infrastructure"
publishedAt: 2025-10-05
readingTime: 18
tags:
  - Laravel
  - Queues
  - Redis
  - Horizon
cover: /images/articles/laravel-queue-production.svg
translationOf: laravel-queue-production
---

Les files d'attente Laravel semblent simples en développement. En production avec des milliers de jobs par jour, l'histoire est tout autre.

## Pourquoi les files échouent en silence

Un job perdu, une facture jamais envoyée, un client non notifié — et personne ne le sait avant la plainte.

Causes fréquentes : timeout worker, mémoire, sérialisation de modèles Eloquent complets, race conditions après retry.

## Règles de conception

1. **Jobs petits et retryables** — découper le travail
2. **Passer des IDs, pas des modèles** — recharger dans `handle()`
3. **$tries et $backoff** conscients — éviter le ban IP

## Horizon

Auto-scaling, séparation des queues (`webhooks`, `payments`, `emails`), métriques de throughput.

## Dead letter

Après épuisement des retries : log complet, alertes pour jobs critiques, UI admin pour retry manuel.

## Idempotence

`Cache::lock()` + vérification « déjà traité » avant action.

## Scheduler vs queue

Le scheduler doit dispatcher des jobs, pas exécuter tout sur un seul serveur.

## Conclusion

Les files ne sont pas un détail. C'est la **colonne vertébrale de la fiabilité**.
