# Thabet — Professional Portfolio

A typography-driven, multilingual portfolio built with Astro, TypeScript, and Tailwind CSS. Designed for performance, SEO, and edge deployment on Cloudflare.

## Features

- **Trilingual**: Arabic (RTL), English, French (LTR)
- **Auto language detection**: Browser language, Cloudflare geo, cookie preference
- **Dark / Light mode** with system preference support
- **Content-driven**: Markdown for articles and project case studies
- **SEO-first**: Sitemap, RSS, structured data, Open Graph
- **Contact form**: Cloudflare Turnstile spam protection, edge API route
- **Static-first**: Pre-rendered pages, minimal JavaScript

## Tech Stack

- [Astro](https://astro.build) 7
- TypeScript
- Tailwind CSS 4
- Cloudflare Pages / Workers adapter
- Markdown content collections

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4891`.

## Environment Variables

Copy `.env.example` to `.env`:

```bash
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
CONTACT_EMAIL=righithabt@gmail.com
```

Contact form delivery uses the Cloudflare **Email Workers** binding (`send_email` in `wrangler.jsonc`). In production, set secrets with `npx wrangler secret put`.

Turnstile test keys work in development. Never expose secret keys in the frontend.

## Content & customization

**Full guide (Arabic):** [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)

Quick reference:

| Change | File |
|--------|------|
| Name, email, links, logo | `src/lib/site.ts` |
| Social media icons & URLs | `src/lib/social.ts` |
| UI labels & section text | `src/i18n/ui.ts` |
| Experience, skills, resume | `src/lib/content.ts` |
| Articles | `content/articles/{ar,en,fr}/*.md` |
| Projects | `content/projects/{ar,en,fr}/*.md` |
| Images, favicon, CV | `public/` |
| Site URL (SEO) | `astro.config.mjs` → `site` |

## Content Structure

```
content/
├── articles/
│   ├── ar/
│   ├── en/
│   └── fr/
└── projects/
    ├── ar/
    ├── en/
    └── fr/
```

### Adding an article

Create `content/articles/en/my-article.md`:

```yaml
---
title: Article Title
excerpt: Short description
category: Architecture
publishedAt: 2026-03-01
readingTime: 5
tags: [Tag1, Tag2]
cover: /images/articles/cover.svg
---
```

### Adding a project

Create `content/projects/en/my-project.md` with fields: `title`, `excerpt`, `problem`, `solution`, `role`, `result`, `technologies`, `cover`, `order`.

## Deployment

See **[docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md)** for full guide (Arabic).

Quick deploy to your Cloudflare account:

```bash
npx wrangler login
npm run build
npx wrangler deploy
```

Set secrets in Cloudflare dashboard or via:

```bash
npx wrangler secret put CONTACT_EMAIL
npx wrangler secret put TURNSTILE_SECRET_KEY
```

## Design

See [docs/DESIGN-DIRECTION.md](docs/DESIGN-DIRECTION.md) for the visual identity, typography, and layout principles.

## License

Private — all rights reserved.
