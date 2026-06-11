# SEO Audit Report — next-genbpo.com

**Date:** 2026-06-11
**Scope:** Full codebase audit (technical, on-page, content, internal linking, local, conversion)
**Stack:** Next.js 15 App Router, static prerender (22 pages at audit time; 17 after Phase 1 remediation)

> **Remediation status (2026-06-11):** C1, C2, H2 — **FIXED** in Phase 1. See `SEO_REMEDIATION_PHASE_1.md`. Note: 301 redirects for the five legacy slugs already existed in `next.config.js`; Phase 1 removed the now-shadowed duplicate page folders.

---

## 1. Executive Summary

The site has a solid technical base — App Router static generation, `metadataBase`, per-page titles/descriptions, Organization/ProfessionalService/Website JSON-LD, sitemap and robots both generated. The dominant problems are: **five legacy duplicate service routes with no canonicals or redirects**, **no Open Graph image despite `summary_large_image` being declared**, **duplicate FAQPage schema collisions**, and a **completely unoptimised flagship asset (the WHT calculator)** that could be the site's biggest organic traffic and backlink magnet.

---

## 2. Findings

### CRITICAL

**C1 — Five duplicate legacy service routes, no canonical, no redirect** ✅ FIXED (Phase 1)
`/bookkeeping`, `/cpa-outsourcing`, `/pakistan-taxation`, `/payroll`, `/us-tax-preparation` render near-identical content to their canonical twins (`/bookkeeping-services`, `/cpa-firm-support`, `/pakistan-taxation-services`, `/payroll-processing-services`, `/us-tax-preparation-support`).
- Legacy pages set only `title`/`description` — **no `alternates.canonical`**.
- Not in sitemap, but fully crawlable (robots allows all).
- Result: duplicate content, split link equity, Google may index the wrong variant.
- **Fix:** 301 redirects in `next.config.js` (`redirects()`) from each legacy slug to the canonical slug, then delete the legacy page folders.

**C2 — Homepage and /wht-calculator have no canonical URL** ✅ FIXED (Phase 1)
Only the 10 service pages declare `alternates.canonical`. Homepage and calculator (the two most important URLs) do not. Add `alternates: { canonical: '...' }` to both.

### HIGH

**H1 — No Open Graph / Twitter image exists anywhere**
`twitter: { card: 'summary_large_image' }` is declared sitewide but `public/` contains only `logo.png` and `logo.svg`. No `og-image`, no `opengraph-image.tsx`. Every social share renders imageless — depresses CTR from social and messaging apps. **Fix:** add a 1200×630 `opengraph-image` (static or generated via `next/og`) at root and ideally per key page.

**H2 — Duplicate FAQPage schema collision** ✅ FIXED (Phase 1)
`app/layout.tsx` injects a sitewide `faqSchema` into `<head>` of **every** page. Service pages (e.g. `/bookkeeping-services`) embed their **own** FAQPage schema. Two FAQPage objects on one URL violates Google's structured-data guidance — rich result eligibility may be dropped entirely. **Fix:** remove `faqSchema` from the root layout; emit FAQPage only on pages whose visible content contains that FAQ (homepage FAQ section → homepage only).

**H3 — WHT calculator has zero structured data and weak metadata**
The calculator is the only genuinely link-worthy free asset on the site, targeting high-intent queries ("withholding tax calculator Pakistan", "section 149 salary tax calculator", "236C property tax calculator"). Currently: no canonical, no FAQPage, no `SoftwareApplication`/`WebApplication` schema, no breadcrumbs, generic OG. **Fix:** canonical + `WebApplication` schema + FAQPage (visible FAQ section on the page) + keyword-aligned title ("Pakistan Withholding Tax Calculator 2025-26 — FBR Rates").

**H4 — Favicon is the broken logo.svg**
`icons: { icon: '/logo.svg' ... }` — the SVG has a baked-in opaque white rectangle (known issue) and there is no `.ico`/PNG fallback for crawlers and older agents. Google renders favicons in mobile SERPs; a broken one hurts CTR. **Fix:** export clean transparent SVG + add `favicon.ico` and `apple-touch-icon.png`.

**H5 — Sitemap `lastModified: new Date()` on every build**
All URLs claim modification at build time. Google learns the signal is unreliable and ignores it. **Fix:** hardcode real last-substantive-change dates or derive from content data.

### MEDIUM

**M1 — Navbar hash links break on inner pages**
Desktop navbar renders `href="#about"`, `#industries`, `#process`, `#our-team` (raw hashes). On any non-home page these anchors point nowhere (no such IDs) — dead-end clicks for users and crawl noise. Footer correctly uses `/#about`. **Fix:** prefix nav hash hrefs with `/` (`/#about`).

**M2 — No blog / content hub**
Zero informational content. Competitors rank with "outsourced bookkeeping cost", "CPA firm offshore staffing guide", "FBR withholding tax card 2025-26" articles. The tax-rules dataset already in the repo could power authoritative rate-card reference pages.

**M3 — Local SEO: thin PostalAddress, no geo, no GBP linkage**
Organization/ProfessionalService schema has only `addressLocality: Lahore, PK`. Missing `streetAddress`, `postalCode`, `geo`, `openingHours`, `sameAs` (LinkedIn etc.). If a Google Business Profile exists, NAP must match exactly; no `hasMap`/GBP signals present.

**M4 — `keywords` meta array**
Ignored by Google since 2009. Harmless but dead weight; Bing treats stuffing as spam signal. Trim or remove.

**M5 — No breadcrumb schema or visible breadcrumbs on service pages**
BreadcrumbList improves sitelink display and crawl comprehension. Service pages are one level deep — cheap win.

### LOW

**L1 — `twitter.card` declared without `site`/`creator` handle.**
**L2 — OG `locale: en_US`** while audience is PK/US/GB/SA mix — fine, but `alternates.languages` absent (only relevant if Urdu content is ever planned).
**L3 — Heading order on homepage:** single H1 in hero ✓; some section H2s skip to H3 grids — acceptable, monitor.
**L4 — `maximumScale: 5`** — fine for accessibility (not a blocker).

### Page speed / Core Web Vitals (code-level assessment)

- Static prerender all routes ✓; First Load JS 102–163 kB — healthy for the stack.
- `framer-motion` ships on every page via Navbar/Footer (~30 kB gz). Consider `LazyMotion`/`domAnimation` to cut ~20 kB.
- Hero uses `whileInView` — no LCP-blocking issues; H1 text is server-rendered ✓.
- No images beyond logo — no CLS risk from media. `next/font` with `display: swap` ✓.
- Calculator route 48 kB — acceptable; engine is pure TS, no network calls ✓.

---

## 3. SEO Opportunities

1. **WHT calculator as link magnet** (H3 fix + outreach to PK accounting/tax communities, university finance departments, tax-firm blogs). Tools earn passive backlinks; this is the site's only one.
2. **Programmatic section pages:** `/wht-calculator/section-149-salary`, `/.../236c-property-sale` etc. — one page per ITO section targeting long-tail ("section 153 withholding tax rate 2025"), each deep-linking the calculator pre-selected. The rules registry already contains all the data.
3. **Annual rate-card reference page:** "FBR Withholding Tax Rates 2025-26" table page — recurring seasonal search spike every July (Finance Act).
4. **FAQ content already structured** in service pages — expand to People-Also-Ask-aligned questions.
5. **Blog hub** for outsourcing-intent keywords (M2).

---

## 4. Estimated Traffic Impact

| Action | Est. impact (6 mo) | Confidence |
|---|---|---|
| C1 redirects (consolidate duplicate equity) | +10–20% organic to service pages | High |
| H3 calculator optimisation + section pages | +500–2,000 visits/mo (PK tax long-tail, seasonal July spike 3–5×) | Medium |
| H1 OG image | +15–30% social/referral CTR | High |
| H2 schema fix | Protects existing FAQ rich results (defensive) | High |
| M2 blog (4–8 posts/qtr) | +300–1,000 visits/mo by month 6 | Medium |
| M3 local SEO | Modest — brand/local queries in Lahore | Low-Medium |

Baseline assumption: site is young with low current authority; percentages compound as links accrue.

---

## 5. Prioritized Action Plan

**Week 1 (critical, ~half day):**
1. Add 301 `redirects()` for 5 legacy slugs in `next.config.js`; delete legacy page folders (C1).
2. Add canonicals to homepage and `/wht-calculator` (C2).
3. Remove sitewide `faqSchema` from root layout; keep page-scoped FAQ schema only (H2).

**Week 2 (high):**
4. Create 1200×630 OG image; wire `openGraph.images` sitewide; fix favicon set (H1, H4).
5. Calculator SEO package: canonical, `WebApplication` + FAQPage schema, visible FAQ section, refined title/description (H3).
6. Fix navbar hash links to `/#...` (M1).
7. Real `lastModified` dates in sitemap (H5).

**Month 1–2 (growth):**
8. Programmatic section landing pages from rules registry (Opportunity 2).
9. Annual rate-card reference page (Opportunity 3).
10. BreadcrumbList on service pages (M5); enrich local schema (M3).

**Quarter (content engine):**
11. Blog hub: 2 posts/mo targeting outsourcing + PK tax keywords (M2).
12. Outreach: submit calculator to PK fintech/tax directories, accounting newsletters.

---

*Report generated from full codebase review: `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, all 21 page routes, `lib/structured-data.ts`, `lib/constants.ts`, `lib/data/navigation.ts`, section components, and build output.*
