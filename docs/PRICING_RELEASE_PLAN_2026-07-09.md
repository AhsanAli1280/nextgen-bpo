# NextGen BPO Pricing Release Plan

## 1. Document Information

- **Release name:** Central Pricing Experience (focused release)
- **Document date:** July 9, 2026
- **Project:** NextGen BPO — https://next-genbpo.com/
- **Release status:** Deployed — Production Verified
- **Prepared by:** Claude
- **Repository confirmation:** `C:\Users\ahsan\nextgen-bpo` (git branch `master`, working tree clean at planning time). This is the repository deployed as the live NextGen BPO website (Next.js App Router, Vercel).

## 2. Release Objective

- **Why pricing:** The site currently displays no prices anywhere. 14 of the 20 approved services have no presence on the site. Publishing transparent professional fees pre-qualifies leads and matches commercial "fee"-modified search intent.
- **SEO objective:** One crawlable `/pricing` page carrying all 20 services in server-rendered HTML, targeting pricing/commercial intent without creating thin pages.
- **UX objective:** One place to see every service, fee basis, timeline, and documents required; category filtering as progressive enhancement.
- **Conversion objective:** Intent-matched CTAs per pricing type opening a pre-filled, low-friction inquiry modal reusing the existing Web3Forms delivery.
- **Technical objective:** One typed pricing catalogue as single source of truth, reusable by the page, homepage preview, inquiry form, structured data, and any future approved pages.

## 3. Approved Strategic Direction

One central `/pricing` page. One restrained homepage pricing preview. One reusable pricing catalogue. No new category pages. No new individual service pages. All existing URLs preserved unchanged. Existing service pages linked from relevant cards. Future page expansion only after Search Console and conversion data review.

## 4. Scope of This Release

1. Typed pricing catalogue (`lib/data/pricing-catalog.ts`) — all 20 approved services, discriminated-union pricing model.
2. `/pricing` route — SSR content, category filters, 20 service cards, expandable full requirements, pricing explanations, disclaimer, FAQ, structured data, breadcrumb.
3. Inquiry modal — service pre-selected, accessible, reuses existing Web3Forms endpoint/key.
4. Homepage pricing preview section — restrained, categories + pricing-model explanation + `View All Services & Pricing` CTA.
5. Navigation: `Pricing` navbar item, footer link.
6. Sitemap entry for `/pricing`.
7. Structured data: BreadcrumbList + FAQPage + ItemList of Service/Offer derived from catalogue.
8. Release document (this file), updated post-implementation.

## 5. Out of Scope

- New category pages (all `/services/*` routes previously proposed)
- New individual service pages
- URL migrations or redirects
- Website redesign
- WhatsApp integration (no verified business WhatsApp number exists in repository configuration — recorded as future enhancement)
- Invented prices; artificial numeric prices for the three custom-quote services
- Unrelated repository work; any "Corporate Secretary in a Box" work

## 6. Current-State Findings (implementation-relevant)

- 13 routes; no `/pricing`; no prices anywhere in codebase.
- Design system: Tailwind, brand tokens (`brand-green #39B54A`, `brand-blue`, `brand-dark`, `brand-gray`, `brand-light`, `brand-border`), `rounded-xl/2xl` cards, `Container`, `Button` (primary/secondary/ghost), `SectionHeading`, Framer Motion `fadeInUp`, Lucide icons, Inter + JetBrains Mono.
- Contact form: client-side POST to `https://api.web3forms.com/submit` with public access key `53822685-…` in [components/sections/cta-banner.tsx](../components/sections/cta-banner.tsx) (Web3Forms keys are public-by-design; no secret exposure).
- Structured data: Organization / ProfessionalService / WebSite in root layout; page-scoped FAQPage on home; Service+FAQPage on service pages. No BreadcrumbList anywhere.
- Sitemap/robots generated in `app/sitemap.ts` / `app/robots.ts`.
- Nav/footer data in `lib/data/navigation.ts`.
- Existing service pages usable as `View Service Details` targets: `/bookkeeping-services`, `/audit-firm-support`, `/cpa-firm-support`, `/pakistan-taxation-services`, `/accounting-outsourcing`, `/us-tax-preparation-support`.
- Tests: only `npm run test` (WHT engine). Also `typecheck`, `lint`, `build`.
- `CONTACT.phone = +92-328-4000-398` exists but is not verified as WhatsApp Business — WhatsApp deep links deferred.

## 7. Proposed File Changes

| File | Action | Purpose | Risk |
|---|---|---|---|
| `docs/PRICING_RELEASE_PLAN_2026-07-09.md` | Create | Release plan/record | None |
| `lib/data/pricing-catalog.ts` | Create | Typed single-source pricing data | Low |
| `app/pricing/page.tsx` | Create | Central pricing page (server component, metadata, schema) | Low |
| `components/pricing/pricing-explorer.tsx` | Create | Client island: filters + card grid + modal state | Medium (a11y) |
| `components/pricing/pricing-card.tsx` | Create | Service card presentation | Low |
| `components/pricing/inquiry-modal.tsx` | Create | Accessible inquiry modal, Web3Forms reuse | Medium (focus mgmt) |
| `components/sections/pricing-preview.tsx` | Create | Homepage restrained preview | Low |
| `app/page.tsx` | Modify | Mount preview section | Low |
| `lib/data/navigation.ts` | Modify | Add Pricing to nav + footer | Low |
| `app/sitemap.ts` | Modify | Add `/pricing` entry | Low |

No deletions. No existing route or canonical changes.

## 8. Pricing Data Architecture

- Location: `lib/data/pricing-catalog.ts` (matches existing `lib/data/*` convention).
- `PricingCategory` union (6 categories, ordered; Accounting & Professional Support last).
- `ServicePricing` discriminated union on `kind`: `fixed` | `starting` (with variance factors) | `tiered` (GST applicant types) | `package` (inclusions) | `per-filing` | `custom` (factors + potential coverage, no numeric price).
- `PricedService`: `id`, `title`, `category`, `description`, `pricing`, `excludedCharges?`, `completionTime`, `requirements[]`, `servicePageHref?`, `seoDescription`. Key requirements = first 3–4 of `requirements` (single list, no duplication).
- CTA label derived from `pricing.kind` (helper), not stored per service.
- Consumers import the one array; no duplicated datasets.

## 9. Pricing Page Specification

- Route `app/pricing/page.tsx`, server component. H1: "Services & Pricing" style heading; intro copy on transparency; breadcrumb (Home → Pricing).
- Category order as approved (1–6). Filter chips: All Services + 6 categories; horizontal scroll on mobile, hidden scrollbar, buttons keyboard-focusable with `aria-pressed`.
- All 20 cards rendered in initial HTML (client island still SSRs). Filtering hides via state; content never JS-only.
- Card: category pill, title, description, price block (per approved terminology), qualifier, excluded-fee note, completion time, 3–4 key requirements, `View all requirements` `<details>` expansion (crawlable, keyboard/touch native), primary CTA by pricing type (`Get Started` / `Get an Exact Quote` / `Request a Custom Quote`), secondary `View Service Details` link only where an existing page exists.
- Grid: 1 col mobile / 2 tablet / 3 desktop; equal-height via grid + CTA anchored bottom.
- Below grid: how-pricing-works explanation, custom-quote explanation, general fee disclaimer (govt/SECP/IPO/US state fees separate; scope fees confirmed before commencement; timelines depend on documents/regulatory processing), FAQ section.
- Structured data: BreadcrumbList; FAQPage (page-visible FAQs only); ItemList of `Service` items — fixed/tiered/package/per-filing get `Offer` with `price`/`priceCurrency` (PKR/USD); starting prices get `PriceSpecification.minPrice`; custom services get no offer/price. Descriptions state professional-fee-only where charges excluded.

## 10. Homepage Pricing Preview

- New section after `ServicesGrid`, before `WhyChooseUs` (services context flows into pricing transparency; premium narrative intact).
- Content: SectionHeading; six category tiles (icon + name + one-line summary); short line explaining fixed / starting-from / custom-quote models; single `View All Services & Pricing` CTA to `/pricing`. No price grid; no low-price emphasis; at most anchor mention inside category summaries kept price-free to preserve B2B positioning.
- Reasoning: homepage serves international B2B audience; a rate sheet would undercut premium positioning; categories + transparency statement introduces the offer without discount-marketplace feel.

## 11. SEO Changes

- Unique title/description/OG + canonical `https://next-genbpo.com/pricing`.
- Sitemap: add `/pricing` (priority 0.9).
- Internal links: navbar + footer + homepage preview → `/pricing`; cards → existing service pages.
- No changes to any existing page metadata or canonicals.
- All service content server-rendered and crawlable; `<details>` content indexed by Google.

## 12. Conversion Changes

- CTAs by pricing type (see §9); each opens inquiry modal with service pre-selected.
- Modal fields: full name, phone/WhatsApp number, email, service (pre-filled, editable), optional message; company/firm field shown for Accounting & Professional Support services.
- Delivery: existing Web3Forms endpoint + existing public access key; distinct subject "Pricing Inquiry — {service}".
- States: validation, loading, error, success. Success communicates next step without promising an unapproved response time (existing site already states "within one business day" on homepage form — reuse that approved wording).
- WhatsApp: **deferred** — no verified WhatsApp Business number in repo config. Recorded in §19.

## 13. Accessibility Requirements

Semantic sections/headings; filter buttons real `<button>`s with visible focus + `aria-pressed`; `<details>/<summary>` for requirements (native keyboard); modal: `role="dialog"` `aria-modal`, labelled, focus moved in on open, trapped, Escape closes, focus returned to trigger; labels on all fields; contrast via existing brand tokens; `motion-safe`/reduced-motion respected (existing Framer variants + CSS); touch targets ≥44px; price meaning never conveyed by colour alone.

## 14. Performance Considerations

No new dependencies. Page is a server component; single client island (explorer + modal) reusing framer-motion already in bundle. Data stays in one module; no fetch. Native `<details>` avoids JS accordions. No images. No layout shift (reserved card grid).

## 15. Risks and Mitigations

- **Cannibalisation:** `/pricing` targets pricing intent; existing service pages target service intent; cards link to them (hub pattern). No duplicated page copy.
- **Duplicate content:** card descriptions written fresh, not copied from service pages.
- **Pricing misunderstanding:** approved terminology enforced ("Fixed Professional Fee", "Professional Fees Starting From", "Custom Quote"); per-card excluded-fee notes + global disclaimer.
- **Government-fee exclusions:** visible on card, in disclaimer, and in schema descriptions; never in Offer price.
- **Long cards:** key requirements + expandable full list; equal-height grid.
- **Mobile filters:** horizontal scroll, hidden scrollbar, still keyboard-tabbable.
- **Modal a11y:** focus trap/restore/Escape implemented and manually tested.
- **Form delivery:** same Web3Forms key as production form; failure shows error + direct email fallback.
- **Custom-quote misrepresentation:** no numeric price anywhere (UI or schema) for services 18–20; audit-support copy avoids statutory-audit implication; CPA support positioned as outsourced support.

## 16. Testing Plan

`npm run typecheck`; `npm run lint`; `npm run build`; `npm run test` (existing WHT suite, regression); manual: responsive (mobile/tablet/desktop), keyboard (filters, details, modal), modal open/prefill/escape/focus-return, form submit states, filter correctness (counts per category), metadata/canonical in built HTML, sitemap includes `/pricing`, JSON-LD validity (parse + spot-check against schema.org expectations), internal links resolve, existing pages unaffected.

## 17. Acceptance Criteria

1. `/pricing` renders all 20 services with approved prices/labels in server HTML (view-source verifiable).
2. Category order correct; Accounting & Professional Support last.
3. No new route other than `/pricing`; no existing URL/canonical changed.
4. Custom-quote services show no numeric price in UI or schema.
5. GST shows both applicant-type prices.
6. CTAs match pricing type; modal pre-fills service.
7. Homepage preview present, restrained, links to `/pricing`.
8. `typecheck`, `lint`, `build`, `test` all pass.
9. Sitemap contains `/pricing`.

## 18. Rollback Considerations

Single commit (or small series) touching only the files in §7. Revert commit(s) → site returns to prior state; no redirects, URL changes, or data migrations to unwind. `/pricing` disappearing after rollback returns 404 (acceptable pre-indexing).

## 19. Future Enhancements (not in this release)

Search Console review before any new pages; potential category pages; potential individual service pages (NTN, GST, Pvt Ltd, trademark, USA LLC, USA tax filing); conversion analytics events; **verified WhatsApp Business channel** (number verification required first); dedicated privacy-policy/terms pages (footer legal links currently point to `/#contact`); SEO guides.

## 20. Corporate Secretary Context Correction

- Repository search for "Corporate Secretary" (case-insensitive) across `C:\Users\ahsan\nextgen-bpo`: **no matches — no repository file required modification.**
- Files reviewed: full repo grep including `CONVERSATION_RECORD.md`, `IMPLEMENTATION_HANDOFF.md`, `PROJECT_RECORD.md`, `docs/`.
- The reference existed only in external agent memory (`~/.claude/projects/.../memory/active-work-folder.md`). That memory file was deleted and the memory index cleared. It will not influence future work.
- Confirmed: the active project is **NextGen BPO**, implemented in this repository.

## 21. Approval Gate

Release plan prepared. Implementation will proceed according to the approved limited-page pricing architecture.

---

## 22. Actual Files Changed

| File | Action | Actual Change |
|---|---|---|
| `docs/PRICING_RELEASE_PLAN_2026-07-09.md` | Create | This release plan/record |
| `lib/data/pricing-catalog.ts` | Create | Typed catalogue: 6 categories, 20 services, `ServicePricing` discriminated union (`fixed`/`starting`/`tiered`/`package`/`per-filing`/`custom`), CTA + formatting helpers |
| `app/pricing/page.tsx` | Create | Server-rendered pricing page: metadata + canonical, breadcrumb nav, hero, catalogue, how-pricing-works, disclaimer, 5 FAQs, ItemList/BreadcrumbList/FAQPage JSON-LD, internal links to 4 existing service pages |
| `components/pricing/pricing-explorer.tsx` | Create | Client island: 7 filter chips (`aria-pressed`, hidden-scrollbar horizontal scroll), live result count, card grid, modal state |
| `components/pricing/pricing-card.tsx` | Create | Card per pricing kind; key requirements + `<details>` full list; pricing-type CTA; `View Service Details` link where a page exists |
| `components/pricing/inquiry-modal.tsx` | Create | Accessible modal (focus trap, Escape, focus return, scroll lock, `aria-modal`), Web3Forms reuse, service pre-selected, conditional company field, duplicate-submit guard |
| `components/sections/pricing-preview.tsx` | Create | Homepage section: 6 category tiles + `View All Services & Pricing` CTA; no prices shown (premium positioning) |
| `app/page.tsx` | Modify | Mounted `PricingPreview` after `ServicesGrid` |
| `lib/data/navigation.ts` | Modify | Added `Pricing` top-level nav item + `Services & Pricing` footer resource link |
| `app/sitemap.ts` | Modify | Added `/pricing` (priority 0.9) |

No files deleted. No existing routes, canonicals, or page metadata changed.

## 23. Implementation Summary

All §4 deliverables completed as specified: one typed single-source catalogue; one server-rendered `/pricing` route (all 20 services in initial HTML, static-prerendered in production build); progressive-enhancement category filtering; accessible pre-filled inquiry modal reusing the production Web3Forms key; restrained homepage preview; navigation, footer, and sitemap updates; ItemList/BreadcrumbList/FAQPage structured data with numeric prices only for genuinely priced services (PKR/USD; `minPrice` for starting fees; no price for custom-quote services).

## 24. Variations From Plan

- Homepage preview shows category tiles with service counts and **no representative prices** (plan allowed optional prices) — visual review confirmed the price-free version best preserves premium positioning.
- LLP/AOP registration modelled as `fixed` (catalogue lists a single professional fee of Rs. 45,000) with excluded-charges note, matching the approved data exactly.
- Otherwise: no material variations from the approved release plan.

## 25. Test Results (all actually executed)

- `npm run typecheck` — **pass** (no errors).
- `npm run lint` — **pass** ("No ESLint warnings or errors").
- `npm run test` (WHT engine regression) — **pass** ("ALL WHT ENGINE TESTS PASSED").
- `npm run build` — **pass**; 19 static pages; `/pricing` prerendered static, 10.1 kB page / 156 kB first-load JS (below homepage's 163 kB).
- Browser verification (local dev server): 20 cards rendered; H1 "Services & Pricing"; canonical `https://next-genbpo.com/pricing`; unique title; 6 valid JSON-LD blocks parse (Organization, ProfessionalService, WebSite, ItemList, BreadcrumbList, FAQPage); GST card shows both Rs. 18,000 / Rs. 15,000; exactly 3 Custom Quote cards with no numeric price.
- Filter test: "Income Tax Return" → 7 cards; "All Services" → 20.
- Modal test: opens on card CTA, service pre-selected ("NTN Registration – Salaried"; custom card pre-selects "Bookkeeping & Accounting Services"), company field appears only for Accounting & Professional Support, Escape closes, focus moves into dialog on open.
- Sitemap: `curl` of local `/sitemap.xml` contains `https://next-genbpo.com/pricing`.
- Console: no errors on `/` or `/pricing`.
- Responsive: mobile-width screenshots verified for homepage preview and pricing cards; filters scroll horizontally with hidden scrollbar.
- Form submission to Web3Forms was **not** live-fired (avoids sending a test lead to the production inbox); the modal reuses the identical endpoint/key/payload pattern as the production homepage form.

## 26. Known Limitations

- Web3Forms delivery not end-to-end tested from the modal (see above); recommend one manual submission after deployment.
- Focus-return-to-trigger verified in code; automated check used programmatic clicks (which don't set focus), so manual keyboard confirmation post-deploy is a nice-to-have.
- No WhatsApp channel (no verified number) — future enhancement.
- Structured data validated by JSON parsing and schema-shape review, not by Google's Rich Results test (requires the deployed URL).
- Footer legal links (`Privacy Policy`, `Terms of Engagement` → `/#contact`) remain a pre-existing gap, out of scope for this release.

## 27. Deployment Notes

- Vercel auto-deploys from `master`; changes are committed/pushed per normal workflow — no env vars, no migrations, no config changes required.
- Post-deployment checks: load `https://next-genbpo.com/pricing`; submit one real inquiry and confirm email delivery; run Google Rich Results test on `/pricing`; confirm `/sitemap.xml` serves the new entry; request indexing in Search Console.

## 28. Final Release Status

Implemented — Pending Deployment

---

## 29. Final Production-Readiness Review (QA)

- **QA date:** July 9, 2026
- **QA decision:** Production Ready.

### Working tree
Only approved release files. New: `lib/data/pricing-catalog.ts`, `app/pricing/`, `components/pricing/`, `components/sections/pricing-preview.tsx`, `docs/PRICING_RELEASE_PLAN_2026-07-09.md`. Modified: `app/page.tsx`, `app/sitemap.ts`, `lib/data/navigation.ts`. No debug code, no console statements, no `any` types, no placeholders, no unrelated changes.

### Corporate Secretary verification
Re-searched repo for `Corporate Secretary in a Box`, `Corporate Secretary`, `active-work-folder`, and cross-repo redirect instructions. Only match is this release document (which records the correction). No repository source/config file contains the phrase; nothing invented; active repo confirmed as NextGen BPO.

### Catalogue validation (field-by-field, all 20)
20 services, 6 categories, 7 filters (incl. All Services). Category order and counts verified programmatically: Income Tax Return 7, Sales Tax 3, Company Registration 2, Intellectual Property 2, USA LLC & Tax Filing 3, Accounting & Professional Support 3 (last). Every price, currency, kind, and CTA matches the approved catalogue. GST shows both tiers (Rs. 18,000 / Rs. 15,000). Custom-quote services carry no numeric/zero/fabricated price in UI or schema.

### Corrective change during QA (one)
- **Fee label:** approved catalogue labels LLP/AOP, Trademark/Copyright, and Patent as **"Professional Fee"**, distinct from **"Fixed Professional Fee"** used elsewhere. The initial `fixed` pricing kind rendered "Fixed Professional Fee" for all. **Fix:** added optional `feeLabel?: 'Fixed Professional Fee' | 'Professional Fee'` to the `fixed` variant in `lib/data/pricing-catalog.ts`, set `feeLabel: 'Professional Fee'` on those three services, and read it in `components/pricing/pricing-card.tsx` (default remains "Fixed Professional Fee"). Verified in browser: LLP/AOP, Trademark, Patent now show "Professional Fee"; NTN, USA LLC, etc. unchanged. Files changed: `lib/data/pricing-catalog.ts`, `components/pricing/pricing-card.tsx`.

### Reviews
- **Visual (desktop/mobile):** cards equal-height, CTA row bottom-aligned, price prominent, no overflow/clipping. Mobile single column; filter chips scroll horizontally with hidden scrollbar; no horizontal page overflow. Homepage preview: 6 balanced tiles, accurate counts, no prices (premium positioning), `View All Services & Pricing` → `/pricing`.
- **Functional:** filters yield correct counts (All 20; Income Tax 7); `aria-pressed` accurate; live result count; modal opens per card with service pre-selected; company field appears only for Accounting & Professional Support; Escape closes; focus trapped and returned; scroll locked; duplicate-submit guard present.
- **SEO:** unique title/description/canonical `https://next-genbpo.com/pricing`, OG tags, single H1, logical H2/H3, all 20 services in built SSR HTML (`.next/server/app/pricing.html` = 20 `<article>`), sitemap contains exactly one `/pricing`, robots allows it.
- **Structured data:** 6 JSON-LD blocks. ItemList of 20 Services; priced services carry `Offer` (fixed/package/per-filing) or `PriceSpecification.minPrice` (6 starting) or `UnitPriceSpecification` ×2 (GST tiers); 3 custom services carry no offer/price; currencies PKR (rupee) / USD (dollar) correct; BreadcrumbList + FAQPage match visible content.
- **Form security:** only the public Web3Forms access key is client-side (no private secret); inputs handled via controlled React (no `dangerouslySetInnerHTML` of user data); no document/file upload requested; no form data logged.
- **Accessibility:** semantic sections/headings, native `<details>/<summary>` requirement expansion, real `<button>` filters, `role="dialog" aria-modal` labelled modal, visible focus rings, `motion-safe:` transitions, ≥44px targets, no colour-only meaning.
- **Performance:** `/pricing` static-prerendered (○), 10.1 kB page / 156 kB first-load JS (below homepage 163 kB); single client island (explorer+modal); no new dependencies; pricing data in one module.

### Automated tests (all executed, re-run after fix)
| Command | Result | Details |
|---|---|---|
| `npm run typecheck` | Pass | No errors |
| `npm run lint` | Pass | No ESLint warnings or errors |
| `npm run test` | Pass | WHT engine suite passed |
| `npm run build` | Pass | 19 static pages; `/pricing` ○ static, 10.1 kB / 156 kB |

### Known limitations (unchanged)
Web3Forms delivery not live-fired from the modal (avoids a production test lead); Google Rich Results Test pending deployed URL; no WhatsApp channel (no verified number); footer legal links (`/#contact`) pre-existing gap, out of scope.

### Result
`No material implementation changes were required during final production-readiness review` other than the single fee-label correction recorded above.

---

## 30. Deployment & Production Verification

- **Commit hash:** `037eea2b3fc96b3b0f7fe3066e5d5ec5e5b6b02d` (`037eea2`)
- **Branch / remote:** `master` → `origin` (`https://github.com/AhsanAli1280/nextgen-bpo.git`), pushed `b3e2eed..037eea2`
- **Deployment date:** July 9, 2026
- **Production URL:** https://next-genbpo.com/pricing
- **Vercel result:** Auto-deploy from `master` succeeded. Production `/pricing` returned 404 immediately after push, then **HTTP 200 within ~45 seconds** (build + deploy complete). No Vercel CLI in this environment; deployment confirmed by polling the live URL, not by the git push alone.

### Production verification (live, via HTTP)
- Homepage 200; homepage pricing preview present ("Transparent professional fees"), 6 category tiles, `View All Services & Pricing` CTA; 9 `/pricing` links across nav, footer, tiles, and CTA.
- `/pricing` 200 and stable on refresh; 20 `<article>` cards in server-rendered HTML; exactly one `<h1>`; no `noindex`.
- Title: "Services & Pricing — Tax, Registration, USA Formation & Accounting | NextGen BPO Solutions"; meta description present; canonical → `https://next-genbpo.com/pricing`.
- Fee labels: 8 "Fixed Professional Fee", 3 "Professional Fee" (LLP/AOP, Trademark, Patent), 6 "Professional Fees Starting From", GST both tiers (Rs. 18,000 / Rs. 15,000), 3 "Custom Quote".
- Sitemap: `/pricing` appears exactly once; robots.txt allows crawling.
- Structured data (live parse): 6/6 JSON-LD blocks valid; ItemList = 20 services; 3 custom services (Bookkeeping, Audit, CPA) carry no offer/price; 0 zero/fabricated prices; currencies PKR + USD; GST → two `UnitPriceSpecification`; starting services → `PriceSpecification.minPrice`; BreadcrumbList (Home → Services & Pricing); FAQPage = 5 questions matching visible FAQs.

### Checks validated on the identical local build of this commit (preview harness is bound to the dev server and cannot drive the cross-origin production URL)
Filter counts 20 / 7 / 3 / 2 / 2 / 3 / 3; `aria-pressed` state; live result count; mobile horizontal-scroll filters with no page overflow; requirements `<details>` expansion; CTA labels per pricing type; inquiry modal opens with service pre-selected; company/firm field only for Accounting & Professional Support; Escape/focus-trap/focus-return/scroll-lock; no console errors or hydration warnings. Production ships the same client bundle from commit `037eea2`.

### Google Rich Results Test
**Not executed from this environment** — the Rich Results Test is an interactive/authenticated Google tool and cannot be run via script here. JSON-LD was instead validated structurally against the live page (all blocks parse; types/properties conform to schema.org). **Recommended manual follow-up:** run https://search.google.com/test/rich-results on `https://next-genbpo.com/pricing`.

### Inquiry-form production test
**Not performed.** Submitting the live form posts to the production Web3Forms endpoint and delivers a real email to `info@next-genbpo.com`, which would create a genuine (spurious) business lead even with placeholder data. Deferred to avoid an inappropriate lead; the modal reuses the exact endpoint/payload pattern of the existing, working homepage contact form. **Recommended manual follow-up:** one controlled submission by the business owner.

### Remaining known limitations
- Rich Results Test and one live inquiry-form submission pending manual follow-up (above).
- No WhatsApp channel (no verified business number).
- Footer legal links (`Privacy Policy`, `Terms of Engagement`) still point to `/#contact` — pre-existing, out of scope.

## 31. Final Release Status (post-deployment)

Deployed — Production Verified
