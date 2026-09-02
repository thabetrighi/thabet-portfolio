---
title: Pourquoi je préfère l'Event Sourcing pour les pipelines analytics
excerpt: L'event sourcing n'est pas qu'un buzzword — c'est un pattern pratique pour construire des systèmes analytics gérant les données tardives et les changements de schéma.
category: Architecture
publishedAt: 2025-11-15
readingTime: 8
tags:
  - Event Sourcing
  - Analytics
  - Architecture
cover: /images/articles/event-sourcing.svg
translationOf: event-sourcing-analytics
---

Quand nous avons commencé notre plateforme analytics, la sagesse conventionnelle était d'utiliser un star schema avec des jobs ETL nocturnes. Cela a fonctionné six mois, puis nous avons rencontré trois problèmes simultanément.

## Le problème des données tardives

Les clients mobiles bufféraient les événements hors ligne et les envoyaient des heures plus tard. Notre ETL nocturne les manquait, créant des lacunes dans les rapports quotidiens.

## Pourquoi les événements d'abord

Avec l'event sourcing, chaque donnée entre comme un événement immuable. Les arrivées tardives sont simplement plus d'événements. Les changements de schéma sont additifs.

## Quand ne pas utiliser ceci

L'event sourcing ajoute de la complexité. Si vos besoins analytics sont simples, une approche traditionnelle est plus rapide à livrer.
