---
title: API Gateway
excerpt: Unified API gateway with rate limiting, authentication, and request routing for 12 microservices.
problem: A growing microservices architecture had inconsistent authentication, no centralized rate limiting, and clients needed to know about 12 different service endpoints.
solution: Built a Cloudflare Workers-based API gateway handling JWT validation, rate limiting per tenant, request routing, and response caching at the edge.
role: Full-Stack Engineer — gateway architecture, auth middleware, developer documentation
result: Reduced client integration time from 2 weeks to 2 days. Centralized auth eliminated 3 duplicate auth implementations across services.
technologies:
  - Cloudflare Workers
  - TypeScript
  - Redis
  - OpenAPI
cover: /images/projects/api-gateway.svg
order: 2
featured: true
---

## Context

With 12 microservices and growing, each team had implemented their own authentication and rate limiting. Clients were struggling with multiple endpoints and inconsistent error formats.

## Implementation

The gateway runs entirely on Cloudflare Workers, validating JWTs, checking rate limits against Redis (via Upstash), and proxying requests to backend services. OpenAPI specs are auto-generated from route definitions.

## Results

Single entry point for all API consumers. Consistent error responses. Edge caching reduced origin requests by 40% for read-heavy endpoints.
