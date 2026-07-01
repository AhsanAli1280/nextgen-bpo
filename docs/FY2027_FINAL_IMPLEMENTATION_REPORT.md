# FY2026-27 (Tax Year 2027) — Final Implementation Report

> **STATUS: VALIDATION COMPLETE — NOT DEPLOYED, NOT ENABLED.**
> Consolidates Batch 1, HOTFIX-001, and Batch 2 implementation plus the Batch 3
> validation sweep. `VISIBLE_TAX_YEARS = [2025]` is unchanged — FY2026-27 remains
> hidden. fy2026.ts (rollback baseline) and registry.ts are untouched.
>
> **Authoritative-source caveat:** every FY2026-27 value derives from the enacted
> **Finance Act 2026** (primary) with **TAGCO** as a secondary cross-check. The
> **final FBR TY2027 WHT Rate Card has not been provided** — line-by-line FBR-card
> reconciliation is the remaining go-live blocker.

---

## Executive Summary

| Metric | Count | Detail |
|---|---|---|
| Total sections implemented (FY2026-27) | **18** | 16 carried/amended + 2 new |
| **New** sections added | **2** | §151B (life-insurance payouts), §154B (social-media revenue) |
| Sections **amended** by Finance Act 2026 | **6** | §149, §153b, §153c, §236C, §236K, §154 |
| Sections **carried forward** (no amendment) | **10** | §148, §150, §151, §152*, §153a, §154A**, §155, §156, §233, §6a |
| **Structural simplifications** | **2** | §236C & §236K: FMV-band × filer-tier matrix → single flat rate; Late Filer tier removed (TY2027 only) |
| **§4AB surcharge repeal** | 1 | 9% high-earner salary surcharge removed (engine-gated) |
| **Open items** (conditions) | **5** | see Open Items below |

\* §152: structure carried forward; §152(1DA) relabelled to the FCVA channel (Division II rate unchanged at 10%).
\** §154A: rate unchanged; concessional regime sunset extended 2026→2029.

Test status: **ALL WHT ENGINE TESTS PASSED** (32 test groups); `tsc --noEmit` clean.

---

## Step 1 — Legal Reconciliation Matrix

For each FY2026-27 section: enacted provision → implemented behaviour, with rate /
categories / exemptions / filer / final-vs-minimum / methodology confirmation.

| § | Enacted provision (FA2026) | Implemented behaviour | Rate | Categories | Exemptions | Filer treatment | Final/Min | Methodology |
|---|---|---|---|---|---|---|---|---|
| **148** | No amendment | Carried forward from fy2026 | 1–12% by Twelfth-Sch part | 8 import categories | Mobile phones out of scope | ATL/Non-ATL explicit | Adjustable/min per category | Flat per subType |
| **149** | Div I Pt I Table substituted; s.4AB surcharge repealed | New 8-band slabs; 9% surcharge gated off (FY≥2026) | 0/1/11/20/25/29/32/35% | Normal / Pension / Continuation | Pension ≤10M nil; >10M age≥70 nil | n/a (salary) | n/a | Progressive marginal slabs |
| **150** | No Div I Pt III amendment | Carried forward | 7.5/15/25/35/0 by type | 6 dividend types | — | ATL/Non-ATL | Final | Flat per subType |
| **151** | No Div IA/IB amendment | Carried forward (Bank 20/40, Sukuk, NSSF/GovSec tiers) | 10–25% (×2 Non-ATL) | Bank/NSSF/GovSec/Sukuk | — | ATL/Non-ATL + taxpayer-type derivation | Final/min | Flat + engine subType derivation |
| **151B** | NEW §151B + Div IC | New section, dedicated engine branch | 15% (≤1yr) / 10% (1–4yr) / 0% | timing band | death / disability / after 4yr → 0% | No filer split | **Final** (s.151B(4)) | Base = payout − premiums (floored 0) |
| **152** | §152(1DA) substituted (FCVA channel, "Div II rate"); Div II unamended | Full 15-subcat structure carried; 1DA relabelled | 5–20% (1DA gain 10%) | 15 sub-categories | — | ATL/Non-ATL (PE cats) | Final/min | Flat + Sukuk derivation |
| **153a** | No §153 goods amendment | Carried forward (re-verified) | 0.25–22% | 9 goods categories | < Rs 75,000/yr exempt | ATL/Non-ATL + taxpayer | Min/adjustable | Flat per subType + threshold |
| **153b** | Div III restructured | SPECIFIED 7, PROFESSIONALS 15 (new), TERMINAL_PORT 12 (new), OTHER 14, media 1.5, IT 4 | 1.5–15% (×2 Non-ATL) | 8 service categories | < Rs 30,000/yr exempt | ATL/Non-ATL | Min | Flat per subType + threshold |
| **153c** | Div IIIAA 15→20 (sportspersons) | Sportsperson 20/40; Standard carried (7.5/15, 8/16) | 7.5–20% | Standard / Sportsperson | — | ATL/Non-ATL + taxpayer | Min | Flat per subType |
| **154** | Div IV (1)&(3) 1→1.25% | STANDARD_EXPORT 2.25% (1.25% §154 + 1% §147) | 2.25% / 0% | Standard / Afghan oil | Afghan oil 0% | No split | Min (§154) + advance (§147) | Combined flat |
| **154A** | Div IVA sunset 2026→2029 | Rates unchanged; regime extended | 0.25/0.5/1/2% | PSEB / Other | — | ATL/Non-ATL | Final/min | Flat per subType |
| **154B** | NEW §154B + Div IIIAB | New section | 5% | Resident / Non-resident-no-PE | — | No filer split | **Min (resident) / Final (NR-no-PE)** | Flat; residency drives label |
| **155** | No amendment | Carried forward (top slab 25%) | 5/10/25% slabs; 15/30 company | Individual-AOP slabs / Company | ≤300k nil | ATL/Non-ATL (×2 Non-ATL indiv via Rule 1) | Adjustable | Slabs (indiv) / flat (company) |
| **156** | No amendment | Carried forward | 15/20% (×2 Non-ATL) | Prize bond / Other winnings | — | ATL/Non-ATL | Final | Flat per subType |
| **233** | No amendment | Carried forward incl. LIA threshold mechanism | 10/8/12% (×2 Non-ATL) | Advertising / LIA / Other | — | ATL/Non-ATL | Min | Flat + LIA LOW/HIGH derivation |
| **236C** | Div X fully substituted → flat 2.75% | Flat 2.75% / 5.5%; FMV bands + Late Filer removed | 2.75% / 5.5% | none (flat) | — | ATL / Non-ATL (×2, Rule 1)¹ | Adjustable | Flat |
| **236K** | Div XVIII fully substituted → flat 1.25% | Flat 1.25% / 2.5%; FMV bands + Late Filer removed | 1.25% / 2.5% | none (flat) | — | ATL / Non-ATL (×2, Rule 1)¹ | Adjustable | Flat |
| **6a** (§153(2A)) | No amendment | Carried forward | 1/2% digital, 2/4% COD | Digital / COD | — | ATL/Non-ATL | Min | Flat per subType |

¹ §236C/§236K Non-ATL figures (5.5% / 2.5%) are derived as ATL × 2 (Tenth Schedule
Rule 1); the Division text states only the base rate. **Open item — confirm vs FBR card.**

Engine-level reconciliation also covered: §4AB 9% salary surcharge **repealed**
(gated `financeActYear < 2026`); pension 10% surcharge dropped under the same gate
(**open item — interpretation**); FMV-band derivation and Late-Filer enumeration
guarded so they apply to FY2025-26 only.

---

## Step 2/3 — Test & Explanation Coverage Summary

| Area | Coverage |
|---|---|
| Per-section compute (all 18, FY2026-27) | `testBatch3ValidationFY2027` group A — every section computes with expected representative rate |
| Amended-section enacted values | `testBatch1FinanceAct2026` (§149/§153b/§153c/§236C/§236K) |
| New sections | `testBatch2FinanceAct2026` (§151B bands/base/exempt/floor; §154B min/final) |
| Resolved mappings | `testBatch2…` (§152 1DA, §154 2.25%, §154A unchanged) |
| Boundary / threshold | group B (§153a 75k, §153b 30k, §149 slab edges incl. 600k & 7,000,001 top band) |
| Zero / exemption | group C (§151B exempt + premiums>payout floor; §154 Afghan 0%) |
| Non-ATL | group D (§236C 5.5, §236K 2.5, §153b 28, §155 indiv doubling 110k) |
| Invalid combinations | group E (missing required field; invalid subType; non-positive amount) |
| Cross-year isolation | group F (§149 162k[2025] vs 156k[2026]; §153b 6 vs 7; §236C 4.5 banded vs 2.75 flat) |
| Explanation content | group G (§149 slab narrative + TY label; §236C Non-ATL display; §154B final/min; §151B net-of-premiums + final tax; §153c 40%) |
| FY2025-26 regression | All legacy financeActYear:2025 groups (Track A, §153 split, D1–D4, audit/material remediation) pass unchanged |

No explanation defects found. The §151B explanation renders the bespoke
payout−premiums derivation; all other sections use the data-driven generic
renderer with correct section refs, rate labels, filer status, and final/minimum
wording carried in the rate label.

---

## Section-by-Section Matrix

| Section | Status | Source | Tests | Remarks |
|---|---|---|---|---|
| 148 | COMPLETE | FA2026 (no amendment) + fy2026 | ✓ sweep | Carried forward |
| 149 | COMPLETE WITH CONDITIONS | FA2026 Div I Pt I | ✓ batch1/3 | Pension-surcharge interpretation open |
| 150 | COMPLETE | no amendment | ✓ sweep | Carried forward; no Bonus Shares |
| 151 | COMPLETE | no amendment | ✓ sweep | Bank 20/40, Sukuk preserved |
| 151B | COMPLETE WITH CONDITIONS | FA2026 §151B + Div IC | ✓ batch2/3 | Exemption-granularity choice (cosmetic) open |
| 152 | REQUIRES FBR VALIDATION | FA2026 §152(1DA); Div II unamended | ✓ batch2/3 | 1DA = 10% (Div II carry); confirm vs card |
| 153a | COMPLETE | no amendment | ✓ sweep/batch2 | Re-verified unchanged |
| 153b | COMPLETE | FA2026 Div III | ✓ batch1/3 | Restructured per enacted text |
| 153c | COMPLETE | FA2026 Div IIIAA | ✓ batch1/3 | Sportsperson 20/40 |
| 154 | COMPLETE WITH CONDITIONS | FA2026 Div IV | ✓ batch2/3 | 2.25% combined-display philosophy open |
| 154A | COMPLETE | FA2026 Div IVA (sunset) | ✓ batch2/3 | Rate unchanged; regime → TY2029 |
| 154B | COMPLETE | FA2026 §154B + Div IIIAB | ✓ batch2/3 | Min (resident)/Final (NR-no-PE) |
| 155 | COMPLETE | no amendment | ✓ sweep/batch1 | Top slab 25% preserved |
| 156 | COMPLETE | no amendment | ✓ sweep | Carried forward |
| 233 | COMPLETE | no amendment | ✓ sweep | LIA threshold mechanism restored |
| 236C | COMPLETE WITH CONDITIONS | FA2026 Div X | ✓ batch1/3 | Non-ATL ×2 (5.5%) — confirm vs card |
| 236K | COMPLETE WITH CONDITIONS | FA2026 Div XVIII | ✓ batch1/3 | Non-ATL ×2 (2.5%) — confirm vs card |
| 6a | COMPLETE | no amendment | ✓ sweep | Carried forward |

**Tally:** COMPLETE 11 · COMPLETE WITH CONDITIONS 5 · REQUIRES FBR VALIDATION 1 ·
REQUIRES HUMAN REVIEW 0 (all human-review items are folded into the conditions).

---

## Open Items

1. **Pension surcharge interpretation** (§149/§4AB).
2. **§236C Non-ATL derivation** (5.5% = 2.75% × 2, Rule 1 — not stated in Division X).
3. **§236K Non-ATL derivation** (2.5% = 1.25% × 2, Rule 1 — not stated in Division XVIII).
4. **§154 display philosophy** (combined 2.25% vs separate 1.25% §154 + 1% §147).
5. **FBR TY2027 WHT Rate Card reconciliation** (card not yet provided).

---

## Risk Assessment

| # | Open item | Risk level | Potential impact | Recommended action |
|---|---|---|---|---|
| 1 | Pension surcharge | **Low-Medium** | §149 pension >10M payouts: 5% vs 5%+10% surcharge. Rare, high-value population. Over/under-withholding if wrong. | Tax-counsel confirmation that §4AB repeal removes the §149(1A) pension surcharge. If it survives, narrow the engine gate to the 9% salary surcharge only. |
| 2 | §236C Non-ATL | **Medium** | Property sales by non-filers — high-value, high-volume. 5.5% could differ from a bespoke FBR non-filer rate. | Confirm against FBR card; current ×2 is the standard Rule 1 treatment and the safe default. |
| 3 | §236K Non-ATL | **Medium** | Property purchases by non-filers — same as §236C. | Confirm against FBR card. |
| 4 | §154 display | **Low** | No arithmetic error (2.25% total correct); only presentation of the §154/§147 split. | Product/legal decision on combined vs separate line; confirm against FBR card layout. |
| 5 | FBR card reconciliation | **High (process gate)** | Any Batch 2 value sourced from the Act-only path could differ from the published card (esp. §152 1DA, §151B/§154B, §153b new tiers). | **Blocking.** Obtain the FBR TY2027 card and reconcile every rate line-by-line before enablement. |

---

## Conclusion

The FY2026-27 implementation is **technically and legally ready pending external
confirmation**: all 18 sections compute correctly against the enacted Finance Act
2026, the full test suite (including cross-year isolation and FY2025-26 regression)
passes, typecheck is clean, explanations are validated, and the rollback baseline
plus hidden-year guard are intact. The remaining work is **external/legal
confirmation** (FBR card + four interpretation items), not engineering. See
`docs/FY2027_GO_LIVE_CHECKLIST.md` for the gated enablement sequence.
