# FY2026-27 (Tax Year 2026-27) WHT Rate Review

**Status: DRAFT — awaiting human approval. No code, registry, test, or UI files have been modified to produce this document.**

**Sources reviewed:**
- [`lib/tax-rules/rules/fy2026.ts`](../lib/tax-rules/rules/fy2026.ts) — Finance Act 2025, Tax Year 2025-26, marked FBR VALIDATED (currently live; `VISIBLE_TAX_YEARS = [2025]` in [`registry.ts`](../lib/tax-rules/rules/registry.ts))
- [`lib/tax-rules/rules/fy2027.ts`](../lib/tax-rules/rules/fy2027.ts) — draft Finance Act 2026, Tax Year 2026-27, **not** in `VISIBLE_TAX_YEARS` (hidden from production UI)

**Top-line finding:** fy2027.ts is not a uniform "placeholder copy" of fy2026.ts. Roughly half the file is explicitly tagged `[PLACEHOLDER]` and numerically identical to FY2025-26 (safe — just unvalidated). The other half has **silently different numbers, different category taxonomies, or entirely missing sub-categories**, with no `[PLACEHOLDER]` tag and no source citation. Those silent deltas are the highest-risk items in this review — they look "finished" but are unsourced.

---

## Comparison Table

Legend for **Validation Status**:
- `VERIFIED` — value matches FBR-validated FY2025-26 baseline, explicitly carried forward
- `PLACEHOLDER` — explicitly tagged `[PLACEHOLDER]` in fy2027.ts, numerically same as FY2025-26
- `NEEDS VERIFICATION` — numeric value or category structure differs from FY2025-26 baseline with **no** source citation or Finance Act 2026 reference
- `CHANGED BY FINANCE ACT 2026` — reserved for deltas that have been confirmed against an actual Finance Act 2026 text. **None of the deltas below carry such confirmation today** — all differences are currently classified `NEEDS VERIFICATION`, not this status. Re-classify only after checking the gazetted Finance Act 2026 / FBR FY2026-27 WHT Rate Card.

| Section | Transaction Type | FY2025-26 Rate | Proposed FY2026-27 Rate | Change | Source Reference | Validation Status |
|---|---|---|---|---|---|---|
| 148 | Imports — all 8 sub-categories (12th Sch I/II/III, SRO 1125, Medicines, EV/LCV CKD) | 1–12% (ATL/Non-ATL pairs, unchanged set) | identical to FY2025-26 | None | fy2027.ts comment: "[PLACEHOLDER] — carried forward from FY2025-26. Pending Finance Act 2026." | PLACEHOLDER |
| 149 | Salary slabs (6 brackets) | 0%/1%/11%/23%/30%/35% at 600k/1.2M/2.2M/3.2M/4.1M breakpoints | 0%/5%/15%/25%/30%/35% at 600k/1.2M/**2.4M/3.6M/6M** breakpoints | Bracket thresholds AND mid-tier rates both changed (1%→5%, 11%→15%, 23%→25%); top bracket threshold raised 4.1M→6M | fy2027.ts has **no comment block at all** for this section — no PLACEHOLDER tag, no source | **NEEDS VERIFICATION** (high risk — see below) |
| 149 | Salary — Pension subType (149(1A)) + pensionerAge field | Present (NORMAL_SALARY / PENSION / CONTINUATION + age-based surcharge logic) | **Absent** — fy2027 `transactionFields` drops `subType` and `pensionerAge` entirely | Feature removed | No comment | **NEEDS VERIFICATION** (regression, not a rate change) |
| 150 | Listed/General Dividend | GENERAL 15% / 30% | LISTED 15% / 30% (renamed) | None (rate same, category renamed) | No comment | NEEDS VERIFICATION (rename undocumented) |
| 150 | Power company dividend | IPP 7.5% / 15% | POWER_COMPANY 7.5% / 15% (renamed) | None | No comment | NEEDS VERIFICATION (rename undocumented) |
| 150 | Mutual Fund dividend | MUTUAL_FUND 25% / 50% | MUTUAL_FUND 25% / 50% | None | No comment | NEEDS VERIFICATION (carried, unflagged) |
| 150 | Bonus Shares | **Explicitly removed** in fy2026 — comment states this category is taxed under §236M/236N, not §150, and was "an incorrect category" | **Reintroduced**: BONUS_SHARES 10% / 20% | Category re-added | No comment / contradicts fy2026's own correction note | **NEEDS VERIFICATION — likely error** |
| 150 | REIT Scheme dividend from SPV | SPV_REIT 0% / 0% | **Missing entirely** | Category dropped | — | **NEEDS VERIFICATION (regression)** |
| 150 | Dividend to other recipients from SPV | SPV_OTHER 35% / 70% | **Missing entirely** | Category dropped | — | **NEEDS VERIFICATION (regression)** |
| 150 | Dividend from exempt/loss-carry-forward company | EXEMPT_COMPANY 25% / 50% | **Missing entirely** | Category dropped | — | **NEEDS VERIFICATION (regression)** |
| 151 | Bank Account/Deposit | 20% / 40% | 15% / 30% | **Rate reduced** | No comment | **NEEDS VERIFICATION (high risk)** |
| 151 | NSSF | Split: NSSF_INDIVIDUAL 15%/30%, NSSF_OTHER 20%/40% | Single NSSF 10% / 20% (no individual/other split) | Rate reduced + differentiation lost | No comment | **NEEDS VERIFICATION** |
| 151 | Government Security | Split: GOVT_SEC_INDIVIDUAL 15%/30%, GOVT_SEC_OTHER 20%/40% | Single GOVT_SEC 15% / 30% (Individual rate only; non-individual rate lost) | Differentiation lost | No comment | **NEEDS VERIFICATION** |
| 151 | Sukuk (151(1A)) — Company / Individual >Rs1M / Individual ≤Rs1M | 25%/50%, 12.5%/25%, 10%/20% | **Missing entirely — whole instrument type dropped** | Category dropped | — | **NEEDS VERIFICATION (regression)** |
| 152 | Royalty/FTS, Construction, Insurance, Advertisement, Offshore Digital (5 categories) | 15%, 7%, 5%, 10%, 10% | identical | None | fy2027.ts comment: "[PLACEHOLDER] — carried forward from FY2025-26. Pending Finance Act 2026." | PLACEHOLDER |
| 152 | PE sale of goods/services/contracts (1BA), Debt/Other securities gain (1D/1DA), Sukuk NR (1DB ×3), PE 2A categories (×10) | 15 sub-categories present, fully FBR-validated | **All 15 missing entirely** | Categories dropped | — | **NEEDS VERIFICATION (major regression)** |
| 153a | Other Goods — Company | 5% / 10% | 4% / 8% | Rate reduced | No `[PLACEHOLDER]` tag on this line (file header says these are "preserved from fy2027 original") | **NEEDS VERIFICATION** |
| 153a | Other Goods — Individual/AOP | 5.5% / 11% | 4.5% / 9% | Rate reduced | Same as above | **NEEDS VERIFICATION** |
| 153a | Toll Manufacturing (Company/Individual/AOP) | 9%/18%, 11%/22% | identical | None | fy2027.ts comment: "[PLACEHOLDER] — awaiting FBR FY2026-27 WHT Card validation" | PLACEHOLDER |
| 153a | Distributor/Yarn/Cigarette/Pharma/Agri/Textile/Gold-Silver (7 special categories) | unchanged set of rates | identical | None | fy2027.ts comment: "[PLACEHOLDER] copied from FY2025-26" | PLACEHOLDER |
| 153b | Specified, IT/ITeS, Print Media, Other Services (4 tiers) | 6/12, 4/8, 1.5/3, 15/30 | identical | None | fy2027.ts comment: "[PLACEHOLDER] copied from FY2025-26" | PLACEHOLDER |
| 153b | Exporter Services (Cl. 11A Pt-IV 2nd Sch.) | 1% / 2% | **Missing entirely** | Category dropped | — | **NEEDS VERIFICATION (regression)** |
| 153b | Specified Sector Services (Cl. 9A Pt-II 2nd Sch.) | 1% / 2% | **Missing entirely** | Category dropped | — | **NEEDS VERIFICATION (regression)** |
| 153c | Sportsperson | 15% / 30% | identical | None | fy2027.ts comment: "[PLACEHOLDER] copied from FY2025-26" | PLACEHOLDER |
| 153c | Standard Contract — Company | 7.5% / 15% | 7% / 14% | Rate reduced | File header: "STANDARD rates preserved from fy2027 original" — no FBR citation | **NEEDS VERIFICATION** |
| 153c | Standard Contract — Individual/AOP | 8% / 16% | 7.5% / 15% | Rate reduced | Same as above | **NEEDS VERIFICATION** |
| 6a (153(2A)) | Digital Payment / COD | 1/2, 2/4 | identical | None | fy2027.ts comment: "[PLACEHOLDER] copied from FY2025-26" | PLACEHOLDER |
| 154 | Standard export realization | 2% (1% §154 + 1% §147) | identical | None | fy2027.ts comment: "[PLACEHOLDER] — carried forward from FY2025-26" | PLACEHOLDER |
| 154 | Afghan cooking oil/ghee | 0% | identical | None | Same | PLACEHOLDER |
| 154A | PSEB IT/ITeS export | 0.25% (ATL) / **0.5% (Non-ATL)** | Single flat **0.25%** rule, `atlStatus: null` — Non-ATL rate **lost** | ATL/Non-ATL differential removed | No comment despite section header claiming "[PLACEHOLDER] — carried forward" | **NEEDS VERIFICATION (high risk)** |
| 154A | Other export services (royalty/technical/franchise/etc.) | 1% (ATL) / **2% (Non-ATL)** | Single flat **1%** rule, `atlStatus: null` — Non-ATL rate **lost** | ATL/Non-ATL differential removed | Same | **NEEDS VERIFICATION (high risk)** |
| 155 | Rent slabs — bottom 3 brackets (0–300k, 300k–600k, 600k–2M) | 0%, 5%, 10% (fixedTax 15,000 at 2M) | identical | None | No section-level comment, but values match | NEEDS VERIFICATION (carried, unflagged) |
| 155 | Rent slab — top bracket (>2M) | fixedTax 155,000 + **25%** | fixedTax 155,000 + **15%** | **Top marginal rate cut 25%→15%**, fixed component left unchanged (inconsistent with a genuine rate cut, which would also lower the fixed component) | No comment | **NEEDS VERIFICATION (high risk — looks like a data error, not a rate cut)** |
| 155 | Rent — Company flat rate | 15% / 30% | identical | None | fy2026 rule label says "[PLACEHOLDER] 15%" even though section header claims FBR VALIDATED (pre-existing inconsistency in the FY2025-26 baseline itself) | NEEDS VERIFICATION (inherited ambiguity) |
| 156 | Prize Bond / Other Winnings | 15/30, 20/40 | identical | None | fy2027.ts comment: "rates carried forward from FY2025-26 (TY2026). Pending FBR FY2026-27 (TY2027) WHT Rate Card validation" | PLACEHOLDER |
| 233 | Advertising Agent | 10% / 20% | identical | None | fy2027.ts comment: "[PLACEHOLDER] — rates carried forward from FY2025-26" | PLACEHOLDER |
| 233 | Life Insurance Agent — low band (<Rs 500k/yr) | 8% / 16% | 8% / 16% (kept) | None | Same comment | PLACEHOLDER |
| 233 | Life Insurance Agent — high/residual band (≥Rs 500k/yr) | 12% / 24% | **Missing entirely** — fy2027 has only the low-band rule and dropped the `annualCommissionTotal` field, so the threshold logic itself is gone | Category + supporting field dropped | — | **NEEDS VERIFICATION (regression)** |
| 233 | Other Brokerage/Commission | 12% / 24% | identical | None | Same comment | PLACEHOLDER |
| 236C | Property Sale — all FMV bands (≤50M / 50–100M / >100M) × 3 filer tiers (ATL/Late Filer/Non-ATL) | 9 distinct rates: 4.5–11.5% depending on band and tier | **Replaced by a single flat rate**: ATL 1%, Non-ATL 2%. FMV banding gone, Late Filer tier gone | Complete restructure — both methodology and magnitude changed | No comment | **NEEDS VERIFICATION (highest risk in this review)** |
| 236K | Property Purchase — all FMV bands × 3 filer tiers | 9 distinct rates: 1.5–18.5% depending on band and tier | **Replaced by a single flat rate**: ATL 3%, Non-ATL 6%. FMV banding gone, Late Filer tier gone | Complete restructure — both methodology and magnitude changed | No comment | **NEEDS VERIFICATION (highest risk in this review)** |

---

## High-Risk Changes Requiring Manual Review

- **Salary (Sec 149)** — Slab thresholds and mid-tier rates both changed with zero source citation. The new numbers (0/5/15/25/30/35 at 600k/1.2M/2.4M/3.6M/6M) match an *older*, pre-Finance-Act-2025 slab structure rather than anything resembling a forward Finance Act 2026 change. **Strong suspicion this is stale/reverted data, not a real proposed rate.** Pension-related fields (subType, pensionerAge) were also dropped.
- **Dividends (Sec 150)** — Taxonomy was rebuilt from scratch. Re-introduces `BONUS_SHARES`, which fy2026's own code comments say was identified as an *incorrect* category and removed. Drops three FBR-validated categories (`SPV_REIT`, `SPV_OTHER`, `EXEMPT_COMPANY`) with no replacement — a REIT-scheme dividend or SPV dividend entered into the FY2026-27 calculator today would have no matching rule.
- **Profit on Debt (Sec 151)** — Bank deposit rate cut from 20%/40% to 15%/30%; NSSF and Government Security lost their individual-vs-other differentiation; the entire Sukuk instrument type (151(1A)) is missing.
- **Payments to Non-Residents (Sec 152)** — 10 of 15 FBR-validated sub-categories are missing (PE payment categories, Sukuk-NR, debt/other securities capital gains). A non-resident PE-services or Sukuk transaction has no corresponding rule in FY2026-27 today.
- **Goods / Services / Contracts (Sec 153)** — `153a` Other Goods rates cut ~20% (Company 5%→4%, Individual/AOP 5.5%→4.5%) with no citation. `153b` silently drops the Exporter Services and Specified Sector Services concessionary categories. `153c` Standard Contract rates cut slightly (7.5%→7%, 8%→7.5%) with no citation.
- **Exports (Sec 154 / 154A)** — Sec 154 is an unmodified placeholder (low risk). **Sec 154A is high risk**: both PSEB IT/ITeS export and Other export services lost their Non-ATL rate entirely — the engine config now has a single flat rate with `atlStatus: null`, silently collapsing what was a validated ATL/Non-ATL differential (0.25%/0.5% → flat 0.25%; 1%/2% → flat 1%). Any Non-ATL exporter would currently be under-taxed if this config went live.
- **Commission & Brokerage (Sec 233)** — The Life Insurance Agent high-band/residual rate (12%/24%, triggered at ≥Rs 500,000 annual commission) and its supporting `annualCommissionTotal` input field are both missing. Every Life Insurance Agent transaction in FY2026-27 would currently be priced at the low-band rate regardless of actual annual commission.
- **Property Transactions (236C / 236K)** — The single largest risk item in this review. FY2025-26 uses FMV-banded rates (3 bands × 3 filer tiers = 9 distinct rates per section, ranging 4.5%–11.5% for sales and 1.5%–18.5% for purchases). FY2026-27 collapses this to one flat rate per filer status (236C: 1%/2%; 236K: 3%/6%), discarding the FMV banding and the Late Filer tier entirely. This is either a genuine, major Finance Act 2026 simplification, or a severe data-loss bug. **This must be confirmed against the actual gazetted Finance Act 2026 text before going anywhere near production** — the magnitude of the rate change (e.g., 11.5% → 2%) is large enough that shipping it in error would be a serious liability for any user relying on the calculator.
- **ATL vs Non-ATL differential changes** — Two confirmed losses of the differential: Sec 154A (both sub-categories) and Sec 233 (effectively, by deleting the high-band rule that the differential gates). Everywhere else the ATL/Non-ATL split is structurally preserved, even where the underlying rate changed.
- **Filer penalty / Late Filer tier** — The `LATE_FILER` AtlStatus tier (used in fy2026 for 236C/236K) is not used anywhere in fy2027's rules. If Late Filer status remains a legal category for TY2026-27, every section that used to support it (236C, 236K) currently has no rule path for it in the draft config — a Late-Filer input would presumably fall through to whatever default the engine applies (not verified as part of this document; see engine.ts fallback behavior before relying on this).

---

## Summary

- **Total sections reviewed:** 16 (148, 149, 150, 151, 152, 153a, 153b, 153c, 6a/153(2A), 154, 154A, 155, 156, 233, 236C, 236K)
- **Total rates unchanged (numerically identical to FY2025-26, regardless of tag):** ~9 sections fully unchanged (148, 153a-toll/special, 153b-core-4, 6a, 154, 156, 233-core); partial overlap in 150/151/153a-other/153c (some lines unchanged, some not)
- **Total rates changed (numeric value differs from FY2025-26):** 10 sections contain at least one changed or dropped rate (149, 150, 151, 152, 153a, 153b, 153c, 154A, 155, 233, 236C, 236K — note this is 12, not 10; see per-row detail above)
- **Total placeholders remaining (explicitly tagged `[PLACEHOLDER]`, unmodified):** 148, 152 (5 of 20 categories), 153a (toll + 7 special categories), 153b (4 of 6 categories), 6a, 154, 156, 233 (3 of 4 categories)
- **Total categories/sub-rules silently dropped versus FY2025-26 baseline:** 27 (150: 3, 151: Sukuk×3 + NSSF/GovtSec differentiation, 152: 15, 153b: 2, 233: 1, plus 236C/236K's 9+9 banded rules each collapsed to 2 — counted once per section above as a structural change rather than per-rule)

### Confidence Score by Section (confidence that current fy2027.ts value is correct/final)

| Section | Confidence |
|---|---|
| 148 Imports | Medium (placeholder, but stable category set) |
| 149 Salary | **Very Low** — numbers resemble stale pre-2025 data |
| 150 Dividends | **Very Low** — taxonomy rebuilt, reintroduces a known-incorrect category, drops 3 validated ones |
| 151 Profit on Debt | **Low** — real rate cuts + dropped Sukuk + lost differentiation, no citation |
| 152 Non-Residents | **Low** — core 5 categories medium-confidence placeholder; 10 categories simply absent |
| 153a Goods | Medium — special/toll categories stable; Other Goods rate cut unexplained |
| 153b Services | Medium — core 4 tiers stable placeholder; 2 concessionary categories dropped |
| 153c Contracts | Medium — Sportsperson stable; Standard Contract rate cut unexplained |
| 6a Digital Transactions | Medium (clean placeholder) |
| 154 Exports | Medium (clean placeholder) |
| 154A Export of Services | **Low** — Non-ATL rate silently lost in both categories |
| 155 Rent | **Low** — top-bracket rate cut (25%→15%) looks like a data error |
| 156 Prizes & Winnings | Medium (clean placeholder) |
| 233 Brokerage & Commission | **Low** — high-band life insurance rate + threshold field dropped |
| 236C Property Sale | **Very Low** — entire FMV-band/filer-tier methodology discarded |
| 236K Property Purchase | **Very Low** — entire FMV-band/filer-tier methodology discarded |

---

## Recommended Next Steps (no action taken yet)

1. Obtain the gazetted Finance Act 2026 text and/or an FBR/TAGCO FY2026-27 WHT Rate Card — every `NEEDS VERIFICATION` row above must be checked against it line by line.
2. For sections marked **Very Low / Low** confidence, treat fy2027.ts as unreliable scratch data rather than a near-final draft — do not assume "it's already mostly right, just needs a few tweaks."
3. Decide explicitly, per dropped category (Sukuk, SPV dividends, PE non-resident categories, FMV property banding, Late Filer tier, exporter/specified-sector service concessions, life-insurance high band): was this an intentional Finance Act 2026 simplification, or should it be restored from fy2026.ts pending confirmation?
4. Only after (1)–(3) are resolved should `fy2027.ts`, `registry.ts` (`VISIBLE_TAX_YEARS`), tests, and UI be touched — per the instruction that produced this document, that work is explicitly out of scope until this review is approved.
