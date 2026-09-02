# Design Direction — Thabet Portfolio

## Identity

A **typography-driven, editorial portfolio** for a software engineer. The site reads like a carefully typeset publication — not a startup landing page or AI template.

**Keywords:** Premium · Human · Editorial · Developer-focused · Restrained

## Typography

| Role | Latin | Arabic | Rationale |
|------|-------|--------|-----------|
| Display | Newsreader | Noto Naskh Arabic | Editorial serif for headlines; Naskh for Arabic elegance |
| Body | IBM Plex Sans | IBM Plex Sans Arabic | Clear, professional, excellent multilingual support |
| Mono | IBM Plex Mono | — | Code blocks, labels, metadata |

- Headings: tight tracking, generous line-height contrast with body
- Body: 17–18px base, 1.65 line-height for reading comfort
- Metadata: 13px uppercase tracking for labels

## Color Palette

### Light
- Background: `#F6F4EF` (warm paper)
- Surface: `#FFFFFF`
- Text primary: `#1C1B19`
- Text secondary: `#5C5A55`
- Text muted: `#8A8780`
- Border: `#E2DFD8`
- Accent: `#B84A2F` (terracotta — distinctive, not purple/blue AI default)

### Dark
- Background: `#121110`
- Surface: `#1A1917`
- Text primary: `#EDEAE4`
- Text secondary: `#A8A49C`
- Border: `#2E2C28`
- Accent: `#D4694F`

## Layout Principles

1. **Asymmetric hero** — left-aligned on LTR, mirrored on RTL; never centered generic stack
2. **Editorial rhythm** — alternating project layouts (01 large image left, 02 text-first, etc.)
3. **Subtle grid** — faint background lines at 24px intervals, opacity 0.04
4. **Numbering** — projects use `01`, `02`; pages show section index where useful
5. **Whitespace** — generous margins; content max-width 680px for articles, 1200px for layout

## Motion

- Link underline slide (200ms ease)
- Page fade on navigation (150ms, respects `prefers-reduced-motion`)
- Reading progress bar on articles only
- No scroll-triggered animations on every element

## Component Language

- Buttons: understated, border or solid accent — no pill shapes everywhere
- Cards: avoided; prefer lists, timelines, and editorial blocks
- Tags: small caps, border-only
- Dividers: 1px hairline rules, not heavy separators

## RTL Considerations

- Logical properties (`margin-inline`, `padding-inline`, `text-align: start`)
- Navigation order mirrors in RTL
- Project layouts flip image/text positions
- Arabic headings use Naskh; body uses Plex Sans Arabic

## Anti-patterns (explicitly avoided)

- Centered hero with gradient blob
- Glassmorphism cards
- 40-icon skill grid
- "Passionate developer" copy
- Purple/blue gradient accents
- Excessive border-radius (max 4px on most elements)
