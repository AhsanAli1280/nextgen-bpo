# Session Handoff — 2026-06-12

## Completed today

1. **Vercel Analytics + Speed Insights wired in.**
   - `@vercel/analytics` was already in `package.json` (^2.0.1) but never rendered anywhere — now actually active.
   - Installed `@vercel/speed-insights` (^1.x).
   - `app/layout.tsx` (root layout, only place): added
     - `import { Analytics } from '@vercel/analytics/next'`
     - `import { SpeedInsights } from '@vercel/speed-insights/next'`
     - `<Analytics />` and `<SpeedInsights />` rendered at end of `<body>`, after `<Footer />`.
   - `/next` entrypoints are the official Next.js App Router pattern (route-aware, no hydration issues; components render nothing server-side).

## Verification
- `npm run build` — ✓ clean, 17/17 static pages.
- `npx tsc --noEmit` — clean.

## Vercel dashboard follow-up
- Project → **Analytics** tab → Enable (data flows only after enabling + next prod deploy).
- Project → **Speed Insights** tab → Enable.
- Both no-op on localhost; verify after deploy via network requests to `/_vercel/insights/*` and `/_vercel/speed-insights/*`.

## Open items (carried from 2026-06-11)
- Logo transparency (`public/logo.svg` baked white rect) — needs design-tool cleanup.
- Deploy pending (`git commit` + push / `npx vercel deploy --prod`) — analytics changes ride along.
- `lib/data/service-pages.ts` + `components/sections/service-page-layout.tsx` dead code cleanup.
- SEO Week 2: OG image, favicon set, sitemap dates, rates-table content block, taxation page → calculator link.
