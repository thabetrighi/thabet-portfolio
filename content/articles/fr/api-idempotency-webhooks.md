---
title: "Clés d'idempotence et webhooks — l'illusion du exactly-once dans les paiements"
excerpt: "Pourquoi les opérations de paiement dupliquées échouent, comment concevoir des clés d'idempotence correctes et gérer les webhooks tardifs ou dupliqués."
category: "Conception API"
publishedAt: 2025-12-01
readingTime: 19
tags:
  - API
  - Payments
  - Webhooks
  - Idempotency
cover: /images/articles/api-idempotency-webhooks.svg
translationOf: api-idempotency-webhooks
---

Dans un vrai système de paiement, la question n'est pas « le client enverra-t-il deux fois ? » mais « **quand** ».

Coupures réseau, double-clic, retry mobile, webhooks tardifs — quotidien.

## Clé d'idempotence

Le client génère une clé unique. Le serveur garantit : même clé = même résultat.

Cycle : premier traitement → doublon même corps = même réponse → corps différent = 409 → expiration après 24–72h.

## Webhooks

Le serveur externe décide du timing.

Problèmes : livraison dupliquée, tardive, ordre incorrect, signature invalide.

Pattern : vérifier signature → dédupliquer par `event_id` → queue → 202 en < 5 secondes.

Machine à états pour l'ordre des événements.

## Réconciliation

Job quotidien : comparer transactions passerelle vs nos enregistrements.

## Conclusion

**Exactly-once** est une illusion. Objectif réaliste : **at-least-once + traitement idempotent**.
