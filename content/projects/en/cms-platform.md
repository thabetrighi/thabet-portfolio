---
title: CMS Platform
excerpt: Headless content management system with multilingual support and real-time preview.
problem: Marketing teams needed to publish content in three languages without developer involvement, but the existing CMS was monolithic and couldn't support RTL layouts.
solution: Built a headless CMS with Markdown-based content, locale-aware API, live preview via WebSockets, and static site generation integration.
role: Lead Developer — CMS architecture, content API, preview system
result: Content publishing time reduced by 70%. Marketing team now self-serves 95% of content updates.
technologies:
  - Laravel
  - Vue.js
  - PostgreSQL
  - Astro
cover: /images/projects/cms-platform.svg
order: 4
featured: true
---

## Context

The marketing team was blocked on every content change. The old WordPress setup couldn't handle Arabic RTL properly and required developer deployment for every update.

## Solution

A headless CMS where content is stored as structured Markdown with locale variants. The preview system uses WebSockets to show changes in real-time before publishing to the static site generator.
