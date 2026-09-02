# Security

## Contact form protections

| Layer | Implementation |
|-------|----------------|
| **Turnstile** | Mandatory CAPTCHA on every submission |
| **Rate limiting** | 5 requests / 60s per IP via Workers `ratelimits` binding |
| **Honeypot** | Hidden `website` field — bots are silently ignored |
| **Origin check** | Only allowed site origins can POST to `/api/contact` |
| **Input limits** | Name 100, email 254, message 5000 chars; body max 16 KB |
| **Email HTML** | Escaped to prevent injection in outbound mail |

## Security headers

Applied on every response via `src/middleware.ts` and `public/_headers`:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

## Turnstile setup

Widget: `thabet-portfolio` on Cloudflare Turnstile.

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npm run build && npx wrangler deploy
```

Public site key is in `wrangler.jsonc` → `vars.PUBLIC_TURNSTILE_SITE_KEY`.

## Rate limit tuning

Edit `wrangler.jsonc`:

```jsonc
"ratelimits": [{
  "name": "CONTACT_RATE_LIMITER",
  "namespace_id": "2001",
  "simple": { "limit": 5, "period": 60 }
}]
```

`period` must be `10` or `60` seconds.
