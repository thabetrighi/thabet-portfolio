---
title: "Transactions distribuées sans two-phase commit — le pattern Saga dans Laravel"
excerpt: "Quand une transaction dépasse une seule base : orchestration vs choreography, actions compensatoires et cohérence entre paiement et notifications."
category: "Architecture"
publishedAt: 2026-03-20
readingTime: 21
tags:
  - Laravel
  - Saga
  - Distributed Systems
  - Transactions
cover: /images/articles/database-sagas-laravel.svg
translationOf: database-sagas-laravel
---

Une requête utilisateur : s'inscrire, payer, recevoir un email, rejoindre un groupe.

En monolithe : `DB::transaction()`. En plateforme réelle : 4 services, 3 bases, passerelle externe — **pas de transaction ACID unique**.

## Pourquoi 2PC échoue sur le web

Le 2PC exige que tous verrouillent. Une passerelle de paiement externe n'attendra pas votre commit.

Alternative : **Saga** — chaîne de transactions locales compensables.

## Orchestration vs Choreography

**Orchestration** — coordinateur central, visibilité, flux complexes.

**Choreography** — chaque service réagit aux événements, équipes indépendantes, debug plus dur.

## Implémentation Laravel

Table `saga_instances`, chaque étape = Job, échec → `CompensateSagaJob`.

## Compensation

Pas un rollback — action inverse documentée pour chaque étape.

## Cohérence finale

État intermédiaire visible par l'utilisateur. UI « en cours », polling, réconciliation.

## Outbox Pattern

Données + événement outbox dans la même transaction DB. Worker séparé pour publication garantie.

## Conclusion

Pas d'ACID cross-services. Choix conscients : saga orchestrée, choreographiée, outbox. Tester les chemins d'échec.
