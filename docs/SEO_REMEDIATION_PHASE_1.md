# SEO Remediation — Phase 1 (Week 1 Critical Fixes)

**Date:** 2026-06-11
**Source audit:** `SEO_AUDIT_REPORT.md`
**Scope:** C1, C2, H2 — technical fixes only, zero content changes.

---

## C1 — Duplicate legacy service routes

**Finding during implementation:** 301 redirects for all five legacy slugs **already existed** in `next.config.js` `redirects()`:

| Source | Destination |
|---|---|
| `/bookkeeping` | `/bookkeeping-services` |
| `/payroll` | `/payroll-processing-services` |
| `/cpa-outsourcing` | `/cpa-firm-support` |
| `/us-tax-preparation` | `/us-tax-preparation-support` |
| `/pakistan-taxation` | `/pakistan-taxation-services` |

However, the five page folders still existed and were being statically built (Next.js redirects fire before the filesystem at request time, so the pages were unreachable shadow content — wasted build output and a latent risk if redirects were ever removed).

**Action taken:** deleted the five legacy page directories:
- `app/bookkeeping/`
- `app/cpa-outsourcing/`
- `app/pakistan-taxation/`
- `app/payroll/`
- `app/us-tax-preparation/`

Build output went from 22 to 17 pages. Redirects in `next.config.js` left unchanged (they remain the 301 layer).

**Note:** `lib/data/service-pages.ts` and `components/sections/service-page-layout.tsx` are now dead code (only the deleted pages referenced them). Left in place per the no-content-change constraint — flagged for future cleanup.

## C2 — Missing canonicals

| File | Change |
|---|---|
| `app/page.tsx` | Added `export const metadata` with `alternates.canonical = 'https://next-genbpo.com'` |
| `app/wht-calculator/page.tsx` | Added `alternates.canonical = 'https://next-genbpo.com/wht-calculator'` to existing metadata |

Canonicals deliberately **not** added to the root layout — a layout-level canonical would cascade the homepage URL onto every page that does not override it.

## H2 — Duplicate FAQPage schema

**Before:** `app/layout.tsx` injected `faqSchema` sitewide → every page carried the homepage FAQ schema; service pages (which embed their own FAQPage) served two FAQPage objects per URL.

**After:**
- Removed `faqSchema` import and `<script>` from `app/layout.tsx`.
- Added the same `faqSchema` script to `app/page.tsx` only (the page whose visible content contains that FAQ).
- Implementation note: first attempt briefly assumed `components/sections/faq.tsx` embedded its own schema — verified it does not; the page-level script is the sole emitter.

## Verification (post-fix, from built HTML)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run build` | ✓ 17/17 pages |
| Homepage `<link rel="canonical">` | `https://next-genbpo.com` ✓ |
| Calculator canonical | `https://next-genbpo.com/wht-calculator` ✓ |
| FAQPage schemas on homepage | exactly 1 ✓ |
| FAQPage schemas on `/bookkeeping-services` | exactly 1 (its own) ✓ |
| Legacy routes in build output | none ✓ (301s still configured) |

## Remaining Week 2 items (not in this phase)

H1 OG image, H3 calculator schema package, H4 favicon set, H5 sitemap lastModified, M1 navbar hash links.
