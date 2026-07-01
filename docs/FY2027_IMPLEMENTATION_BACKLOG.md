# FY2026-27 Implementation Backlog

> **STATUS: PROJECT-PLANNING ONLY. NO SOURCE FILES MODIFIED.**
> Finance Bill 2026 not enacted. TAGCO = proposed-only, third-party. fy2026.ts =
> legal production baseline, stays so until Go-Live Checklist satisfied. Builds on
> [`FY2027_RATE_REVIEW.md`](./FY2027_RATE_REVIEW.md),
> [`FY2027_CHANGE_ORIGIN_ANALYSIS.md`](./FY2027_CHANGE_ORIGIN_ANALYSIS.md),
> [`FY2027_IMPLEMENTATION_BLUEPRINT.md`](./FY2027_IMPLEMENTATION_BLUEPRINT.md).
> No code authorized. Tickets below are prep artifacts, not approval to build.

---

## Executive Summary

| Metric | Count |
|---|---|
| Total WHT sections in scope | 16 |
| Sections unchanged (Workstream A, carry-forward) | 9 — 148, 152, 153a*, 153c (Sportsperson+Standard), 154, 156, 6a, 151, 233 (rates only) |
| Sections needing rate validation only (Workstream B) | 2 — 153b SPECIFIED, 154A |
| Sections needing legal interpretation (Workstream C) | 2 — 149 Salary (incl. Pension/Directorship), 150 Bonus Shares/§236Z |
| Sections needing architecture/engine rebuild (Workstream D) | 3 — 236C, 236K, 150 MUTUAL_FUND split |
| Single-field rate reverts (no rebuild, no legal Q) | 3 — 153a OTHER_GOODS, 153c STANDARD, 155 top bracket |
| Total estimated effort (code only, post-enactment) | 7-9 working days (per Blueprint §4) — unchanged by this doc, itemized into tickets below |
| Total estimated effort (prep work, pre-enactment, doable now) | 1.5-2 days — ticket drafting, test-scaffold drafting, UI mockup drafting |

\* 153a unchanged except OTHER_GOODS (counted separately as a rate revert).

---

## Backlog Board

### Workstream A — Confirmed Carry-Forward Sections

All confirmed identical fy2026 vs TAGCO TY2027. Copy as-is into rebuilt fy2027.ts. No engine/UI/test changes beyond routine TY2026-27 coverage.

| ID | Section | Description | Priority | Effort | Dependency | Status |
|---|---|---|---|---|---|---|
| FY27-A01 | 148 | Imports — copy unmodified | Low | 0.25h | fy2026.ts frozen baseline | NOT STARTED |
| FY27-A02 | 151 | Profit on Debt (Bank, NSSF, Govt Sec, Sukuk — all tiers) — copy unmodified | Low | 0.5h | fy2026.ts | NOT STARTED |
| FY27-A03 | 152 | Non-Residents, all 15 sub-categories — copy unmodified | Low | 0.5h | fy2026.ts | NOT STARTED |
| FY27-A04 | 153a | Goods — all placeholder categories except OTHER_GOODS — copy unmodified | Low | 0.5h | fy2026.ts | NOT STARTED |
| FY27-A05 | 153b | IT/ITeS, Print Media — copy unmodified | Low | 0.25h | fy2026.ts | NOT STARTED |
| FY27-A06 | 153c | Sportsperson — copy unmodified | Low | 0.1h | fy2026.ts | NOT STARTED |
| FY27-A07 | 154 | Exports — copy unmodified | Low | 0.1h | fy2026.ts | NOT STARTED |
| FY27-A08 | 156 | Prizes & Winnings — copy unmodified | Low | 0.1h | fy2026.ts | NOT STARTED |
| FY27-A09 | 6a | Digital Transactions — copy unmodified | Low | 0.1h | fy2026.ts | NOT STARTED |
| FY27-A10 | 150 | LISTED, IPP/POWER_COMPANY, SPV_REIT, SPV_OTHER, EXEMPT_COMPANY — copy unmodified | Low | 0.5h | fy2026.ts | NOT STARTED |
| FY27-A11 | 233 | Rate values (10/20, 8/16, 12/24) — copy unmodified; mechanism handled in Workstream D-adjacent ticket FY27-D03 | Low | 0.25h | fy2026.ts | NOT STARTED |

---

### Workstream B — Rate Validation Required

| Item | Current FY2026 rate | TAGCO proposed rate | Validation source required | Risk if incorrect |
|---|---|---|---|---|
| 153B SPECIFIED (transport/freight/courier/hotel/security/etc. bucket) | 6% ATL / 12% Non-ATL | 7% ATL / 14% Non-ATL | Enacted Finance Act 2026 text or FBR-published TY2026-27 card — TAGCO alone insufficient since value is identical across fy2026/fy2027 and may itself predate fy2027 drafting | Under-withholding by 1pp across a large transaction-volume bucket (transport/courier/hotel is high-frequency) — compounding revenue/compliance exposure if FBR confirms 7/14 and calculator still emits 6/12 |
| 154A (PSEB IT/ITeS export services + other export services) | Explicit ATL/Non-ATL split: 0.25%/0.5% and 1%/2% | Single rate shown (0.25%, 1%) with "OR/Optional Advance Tax" annotation — Non-ATL differential not clearly visible in extracted TAGCO table | FBR card required to confirm whether Non-ATL differential is genuinely removed for export-incentive policy reasons, or whether TAGCO's table simply omitted the column | Two-sided risk: keeping the ATL/Non-ATL split when law removes it over-withholds Non-Filer exporters; dropping it when law keeps it under-withholds — either error misstates an export-incentive-sensitive rate |

---

### Workstream C — Legal Interpretation Required

| Item | Legal question | Relevant section | Required source document | Expected outcome |
|---|---|---|---|---|
| 149 Salary slab structure | Which slab breakpoints/rates actually apply for TY2026-27 — fy2027.ts's untraceable structure matches neither fy2026 nor TAGCO; TAGCO's own structure may itself shift before assent | §149, Income Tax Ordinance 2001 | Enacted Finance Act 2026 (First Schedule, Salary slab table) | Authoritative slab table sourced directly from the Act, not inferred from any of the three current documents |
| 149 Pension treatment | Whether the §149(1A)-style Pension subType (age<70, >Rs10M, 5%) needs reinstatement as a distinct subType/field, given fy2027 deleted it entirely while TAGCO confirms it's still required | §149(1A) | Enacted Finance Act 2026 text | Confirm field (`pensionerAge`) and subType (`PENSION`) restoration scope |
| 149 Directorship fee treatment | Whether Directorship Fee (TAGCO: 20%) needs its own rule/subType under §149, or is out of calculator scope entirely (not modeled in fy2026 or fy2027 today) | §149 read with relevant Directorship Fee provision | Enacted Finance Act 2026 text | Scoping decision: add as new subType, or explicitly exclude with a documented reason |
| 150 Bonus Shares / §236Z | Whether Bonus Shares taxation belongs under §150 (as fy2027 incorrectly reintroduced it) or under a new, separate §236Z section (as TAGCO models it) — and whether §236Z is in scope for this calculator at all | §150 vs §236Z | Enacted Finance Act 2026 text + product scoping decision | Either: (a) add §236Z as a new top-level section, removing BONUS_SHARES from §150 entirely, or (b) explicitly descope §236Z with documented rationale |

---

### Workstream D — Architecture / Engine Changes

#### D1 — Section 236C (Sale of Immovable Property)

- **Business Requirement**: Replace FMV-band × filer-tier (9-rate) structure with TAGCO's proposed holding-period test: same-year disposal → flat 3%; other disposals → 2.75% ATL / 5.5% Non-ATL; NRP-via-FCVA/NRVA → 3% final.
- **Data Model Impact**: New `subType` values (`SAME_YEAR_DISPOSAL`, `OTHER_DISPOSAL`, `NRP_FCVA_NRVA`) replacing FMV-band subTypes. Possible new `FieldDefinition.type: 'date'` if not already supported (currently `types.ts` only has `'number' | 'select' | 'radio' | 'frequency_select'`).
- **Engine Impact**: Delete FMV-band derivation function for 236C in `engine.ts`; add holding-period derivation (acquisition date vs. transaction/disposal date) plus FCVA/NRVA special-case branch.
- **UI Impact**: New "Date of Acquisition" field in `calculator.tsx` for 236C. `atlStatus` radio collapses to ATL/Non-ATL (Late Filer tier removed for this section).
- **Testing Impact**: New unit tests — same-year disposal flat 3%, other-disposal ATL 2.75%, other-disposal Non-ATL 5.5%, FCVA/NRVA 3% final. Existing fy2026 FMV-band tests untouched (different financeActYear scope).
- **Estimated Effort**: 1.5 days (engine + data model + tests), 0.5 day UI.

#### D2 — Section 236K (Purchase of Immovable Property)

- **Business Requirement**: Replace FMV-band × filer-tier structure with TAGCO's flat Normal Purchase rate (1.25% ATL / 2.5% Non-ATL), plus Inheritance/Gift (not applicable) and NR-via-FCVA/NRVA (0%) special cases.
- **Data Model Impact**: Simplify `subType` to a single `NORMAL_PURCHASE` plus two new edge-case subTypes (`INHERITANCE_GIFT`, `NR_FCVA_NRVA`).
- **Engine Impact**: Delete FMV-band derivation for 236K; replace with flat-rate lookup + two special-case branches (one returning `applicable: false` for Inheritance/Gift, one returning 0% for NR-via-FCVA/NRVA).
- **UI Impact**: Remove FMV-band helper text on `propertyValue` field. Add "Inheritance or Gift transfer" checkbox and "Buyer is Non-Resident via FCVA/NRVA" checkbox to route to special cases.
- **Testing Impact**: New tests — flat Normal Purchase ATL/Non-ATL, Inheritance/Gift (expect inapplicable), NR-FCVA/NRVA (expect 0%).
- **Estimated Effort**: 1 day (engine + data model + tests), 0.5 day UI.

#### D3 — Section 150 MUTUAL_FUND split

- **Business Requirement**: Widen single flat MUTUAL_FUND (25%/50%) into three TAGCO-confirmed sub-cases: debt-fund + company recipient (29%/58%), debt-fund + other recipient (25%/50%), equity-fund (15%/30%).
- **Data Model Impact**: New subType values (`MUTUAL_FUND_DEBT_COMPANY`, `MUTUAL_FUND_DEBT_OTHER`, `MUTUAL_FUND_EQUITY`) replacing single `MUTUAL_FUND`.
- **Engine Impact**: Add fund-type (debt/equity) × taxpayerType-aware routing — currently §150 engine logic only checks `subType` + `atlStatus`, needs an additional fund-type dimension.
- **UI Impact**: New "Fund Type" radio (Debt/Equity) in `calculator.tsx` for §150; reuse existing `taxpayerType` field for the company-vs-other distinction within debt funds.
- **Testing Impact**: New tests for all 3 sub-cases; existing GENERAL/IPP/SPV §150 tests unaffected.
- **Estimated Effort**: 0.75 day total (engine + data model + UI + tests).

#### D4 — Section 233 LIA threshold-switching mechanism (restoration, not new architecture)

- **Business Requirement**: Restore the `annualCommissionTotal` field + LOW/HIGH `visibleWhen`-driven switching that routes high-commission Life Insurance Agents to 12/24 instead of silently capping everyone at 8/16.
- **Data Model Impact**: None new — `FieldDefinition.visibleWhen` already exists in `types.ts`; this is a restoration of deleted fy2026 logic, not new schema.
- **Engine Impact**: None — rates (8/16, 12/24) already correct in fy2027; only the field-driven subType selection needs restoring.
- **UI Impact**: Restore the conditional "Annual Commission Total" input and correct the LIFE_INSURANCE_AGENT dropdown label (currently wrongly hard-scoped to "<Rs 0.5M" with no high-tier path).
- **Testing Impact**: Add a high-commission LIA test case (≥Rs0.5M/year → 12/24) — this exact gap is what let the regression through originally.
- **Estimated Effort**: 0.25 day (smallest item in Workstream D — pure restoration, not a rebuild).

---

## Dependency Map

```
Phase 0 — Pre-Enactment Prep (NOW, no code)
  - Draft this backlog (done)
  - Draft ticket acceptance criteria (this doc, Ticket Breakdown section)
  - Draft test-case scenario list (Testing Backlog section)
  - Draft UI mockup/field-list for D1/D2/D3 new inputs (no code, no commit)
        ↓
Phase 1 — Enactment & External Confirmation (BLOCKED until Finance Act 2026 enacted)
  - Obtain enacted Finance Act 2026 text
  - Obtain Presidential assent confirmation
  - Obtain FBR-published TY2026-27 WHT rate card
  - Obtain updated/final TAGCO card (cross-check only, not authoritative)
        ↓  [BLOCKER: nothing past this line starts without Phase 1 complete]
Phase 2 — Validation Resolution (BLOCKED on Phase 1)
  - Resolve Workstream B (153B SPECIFIED, 154A) against FBR card
  - Resolve Workstream C (149 slab/pension/directorship, 150 bonus-shares/§236Z) against enacted Act text
  - Re-confirm every Workstream A item against FBR card (not just TAGCO)
        ↓  [BLOCKER: Workstream D code starts only after its specific rate/structure is FBR-confirmed]
Phase 3 — Implementation (BLOCKED on Phase 2 per-section)
  - Execute Workstream A tickets (mechanical copy)
  - Execute Workstream B tickets (apply FBR-confirmed rate)
  - Execute Workstream C tickets (apply legally-resolved structure)
  - Execute Workstream D tickets (engine/data-model/UI rebuild)
        ↓
Phase 4 — Verification (BLOCKED on Phase 3)
  - Full test suite passing (existing + new TY2026-27 coverage)
  - Manual calculator testing, all 16 sections
  - Manual cross-check: 5 random transactions/section vs FBR card by hand
        ↓
Go-Live (BLOCKED on Phase 4 + full Go-Live Checklist per Blueprint §5)
  - registry.ts: add 2026 to VISIBLE_TAX_YEARS
  - Deploy
```

**Primary blocker for everything past Phase 0**: Finance Act 2026 enactment +
Presidential assent + FBR card publication. None of Phase 1-4 can start earlier —
this is a hard legal gate, not a scheduling preference.

---

## Ticket Breakdown

| Ticket | Title | Workstream | Acceptance Criteria | Blocked By |
|---|---|---|---|---|
| FY27-001 | Copy carry-forward sections (148,151,152,153a*,153b IT/ITeS+Print,153c Sportsperson,154,156,6a,150 partial,233 rates) into rebuilt fy2027.ts | A | All 11 items in Workstream A table present in fy2027.ts, byte-identical to fy2026.ts values; full test suite green for these sections at financeActYear:2026 | Phase 1 (FBR card) |
| FY27-002 | Apply FBR-confirmed rate for 153B SPECIFIED | B | Rate matches FBR TY2026-27 card exactly (6/12 or 7/14, whichever confirmed); test added covering the bucket | FBR card published |
| FY27-003 | Apply FBR-confirmed rate/structure for 154A | B | ATL/Non-ATL differential matches FBR card (present or genuinely removed); `atlStatus` field set accordingly, not silently null; test added for both subtypes | FBR card published |
| FY27-004 | Implement 149 Salary slab table per enacted Finance Act | C | Slab breakpoints/rates match First Schedule of enacted Act exactly; all 6+ brackets covered; tests added per bracket boundary | Enacted Act text available |
| FY27-005 | Restore/scope Pension treatment under §149 | C | `pensionerAge` field + `PENSION` subType present per legal determination; test for age<70/>Rs10M case | FY27-004, legal scoping decision |
| FY27-006 | Scope Directorship Fee under §149 | C | Either implemented as new subType (20% rate) with test, or explicitly documented as out-of-scope with rationale in code comment | Legal scoping decision |
| FY27-007 | Resolve Bonus Shares / §236Z placement | C | BONUS_SHARES removed from §150 subType list if §236Z added as separate section; OR explicit documented descope decision; no half-implemented state | Legal scoping decision |
| FY27-008 | Rebuild Section 236C (holding-period structure) | D | Holding-period logic implemented; acquisition-date field added to `transactionFields`; FCVA/NRVA special case implemented; ATL/Non-ATL (2.75%/5.5%) + same-year flat 3% all validated against FBR card; tests passing | FY27-001 baseline rebuild, FBR card |
| FY27-009 | Rebuild Section 236K (flat-rate structure) | D | Flat Normal Purchase rate (1.25%/2.5% or FBR-confirmed equivalent) implemented; Inheritance/Gift and NR-FCVA/NRVA special cases implemented; tests passing | FY27-001 baseline rebuild, FBR card |
| FY27-010 | Implement 150 MUTUAL_FUND 3-way split | D | Debt-fund-company, debt-fund-other, equity-fund subtypes all present with FBR-confirmed rates; fund-type UI field added; tests passing for all 3 | FY27-001 baseline rebuild, FBR card |
| FY27-011 | Restore §233 LIA threshold-switching mechanism | D | `annualCommissionTotal` field + `visibleWhen` restored; high-commission LIA routes to 12/24; UI label corrected; test for ≥Rs0.5M case added | FY27-001 |
| FY27-012 | Update `lib/wht-engine/explanation.ts` for 236C/236K/150 new structures | D (support) | Explanation markdown reflects holding-period/flat-rate/fund-type logic, no stale FMV-band language | FY27-008, FY27-009, FY27-010 |
| FY27-013 | Add new field type support in `types.ts` if needed (e.g. `'date'`) | D (support) | `FieldDefinition.type` extended only if 236C acquisition-date field can't use an existing type; full type-check passes across all existing sections | FY27-008 |
| FY27-014 | Update `registry.ts` — add 2026 to `VISIBLE_TAX_YEARS` | Go-Live | Single-line change; gated entirely behind full Go-Live Checklist completion; not mergeable standalone | All above + Go-Live Checklist (Blueprint §5) |

---

## Testing Backlog

**Unit Tests** (in `lib/wht-engine/tests/wht.test.ts`, financeActYear: 2026 scope):
- One test per Workstream A section confirming value parity with fy2026.ts equivalent
- 153B SPECIFIED and 154A: one test per resolved rate/subtype
- 149: one boundary test per slab bracket edge (e.g. exactly at 600,000 / 1,200,000 / etc.), one Pension test, one Directorship Fee test (if in scope)
- 150: one test per Bonus-Shares-or-§236Z resolution, one test per MUTUAL_FUND sub-case (debt-company, debt-other, equity)
- 236C: same-year disposal, other-disposal ATL, other-disposal Non-ATL, NRP-FCVA/NRVA
- 236K: Normal Purchase ATL/Non-ATL, Inheritance/Gift (inapplicable), NR-FCVA/NRVA (0%)
- 233: high-commission LIA (≥Rs0.5M) routes to 12/24, low-commission LIA (<Rs0.5M) routes to 8/16

**Integration Tests**:
- Full `computeWht()` round-trip for each rebuilt section, financeActYear: 2026, confirming `WhtResult` shape (slabBreakdown for 149/155, explanation text for 236C/236K/150) is internally consistent, not just the headline rate

**Manual Validation Tests**:
- 5 random transactions per Workstream D section (236C, 236K, 150), computed by hand against the FBR card, compared to calculator output
- Full walkthrough of every one of the 16 sections in the live UI, one transaction each, financeActYear: 2026 selected via the year picker

**Cross-check against FBR card**:
- Every single rate value that ends up in the rebuilt fy2027.ts — not just the ones flagged in this backlog — gets a final line-by-line diff against the FBR-published card before `registry.ts` is touched. This is the literal last gate before FY27-014.

---

## July 1 Execution Runbook

```
Step 1: Obtain enacted Finance Act 2026 (post-assent, official text)
Step 2: Obtain FBR-published TY2026-27 WHT rate card
Step 3: Compare FBR card against TAGCO TY2027 card section-by-section
         → Any mismatch: flag per Blueprint §6 Rollback Plan, do not proceed
           on that section until resolved
Step 4: Resolve all open Workstream B/C items using FBR card + enacted Act text
         (FY27-002, 003, 004, 005, 006, 007)
Step 5: Execute Workstream A/D implementation tickets
         (FY27-001, 008, 009, 010, 011, 012, 013) — in that order, since D
         tickets depend on A's baseline rebuild being in place first
Step 6: Run full automated test suite — must be 100% green, including all
         new TY2026-27 coverage from the Testing Backlog
Step 7: Manual validation — full 16-section walkthrough + 5-per-section
         hand cross-check for 236C/236K/150
Step 8: Execute FY27-014 — add 2026 to VISIBLE_TAX_YEARS in registry.ts
Step 9: Deploy to production, with fy2026.ts retained frozen as the
         immediate rollback target (per Blueprint §6)
```

No step in this runbook is shortenable. Step 9's rollback target is Step 0's
baseline — fy2026.ts is never deleted, only superseded in `VISIBLE_TAX_YEARS`.

---

## Final Recommendation

- **Option B (rebuild from fy2026.ts baseline + confirmed deltas) remains the
  recommended strategy.** Nothing in this backlog changes that call — if
  anything, breaking the work into discrete tickets makes the case stronger:
  11 of 14 tickets (A + most of B/C) are mechanical copy-or-single-value-apply
  operations once the legal/rate questions are resolved, which is only possible
  because the rebuild starts from a known-good (fy2026) structure rather than
  trying to triage fy2027's untagged 45%.
- **Tickets that can be prepared now (Phase 0, no code)**: ticket text and
  acceptance criteria for all 14 tickets (done, this document); test-scenario
  lists in the Testing Backlog (done); UI field/mockup lists for FY27-008/009/010
  new inputs (acquisition date, inheritance/gift checkbox, NR-FCVA checkbox,
  fund-type radio) — drafting the *shape* of these fields, not the code.
- **Tickets that must wait for enactment**: every ticket that touches an actual
  rate or structure value — FY27-001 through FY27-013 all require either the
  FBR card or the enacted Act text as an input; none can be coded correctly
  before Phase 1 completes, because doing so would just reproduce the exact
  problem this backlog exists to prevent (untraceable, unvalidated values).
  Only FY27-014 (the registry flip) has zero technical dependency — but it is
  deliberately gated behind the full Go-Live Checklist, not behind code
  readiness alone.
- **Critical path to production**: Finance Act 2026 enactment + Presidential
  assent → FBR TY2026-27 card publication → Workstream B/C resolution
  (FY27-002 through 007) → Workstream A/D implementation (FY27-001, 008-013) →
  full test pass → manual validation → FY27-014 registry flip → deploy. The
  single longest-lead, non-engineering-controllable item is the **first**
  one — nothing in this backlog shortens the wait for enactment + FBR
  publication, and no implementation ticket should start before it.
