# FY2026-27 Implementation Blueprint

> **STATUS: PLANNING ONLY. NO SOURCE FILES MODIFIED.**
> No edits to fy2027.ts, registry.ts, tests, or UI. This is the execution guide
> for AFTER Finance Act 2026 receives presidential assent and an FBR-published
> TY2026-27 rate card exists. Until then: **fy2026.ts is the only legal
> production baseline. FY2027 stays out of `VISIBLE_TAX_YEARS`.**
>
> Builds on [`FY2027_RATE_REVIEW.md`](./FY2027_RATE_REVIEW.md) and
> [`FY2027_CHANGE_ORIGIN_ANALYSIS.md`](./FY2027_CHANGE_ORIGIN_ANALYSIS.md).
> Finance Bill 2026 = proposed. TAGCO = third-party read of the bill. Neither
> is enacted law. Every rate below is labeled accordingly — none are to be
> treated as confirmed until the Go-Live Checklist (§5) is satisfied.

---

## 1. Production Baseline — copy from fy2026.ts unmodified

If Finance Act 2026 enacted today with zero changes from current law, these
sections need **zero edits** — copy fy2026.ts structure as-is into the
rebuilt fy2027.ts:

| Section | Why safe to copy unmodified |
|---|---|
| 148 Imports | Untouched by Finance Bill 2026 per TAGCO; fy2026 structure already matches |
| 152 Non-Residents (all 15 sub-categories) | TAGCO confirms full structure unchanged |
| 153a Goods — Toll Manufacturing, Distributor-Special, Yarn Trader, Cigarettes, Pharma, Agri-Commodity, Textile-Sector, Gold/Silver | All confirmed unchanged against TAGCO |
| 153b Services — IT/ITeS, Print Media | Confirmed unchanged |
| 153c Contracts — Sportsperson, Standard (Company & Individual/AOP) | Confirmed unchanged (7.5/15, 8/16) |
| 154 Exports | Confirmed unchanged |
| 156 Prizes & Winnings | Confirmed unchanged |
| 6a / 153(2A) Digital Transactions | Confirmed unchanged |
| 150 Dividends — LISTED, IPP/POWER_COMPANY, SPV_REIT, SPV_OTHER, EXEMPT_COMPANY | Confirmed unchanged (MUTUAL_FUND needs a widen, see §2) |
| 151 Profit on Debt — BANK, NSSF (both tiers), GOVT_SEC (both tiers), SUKUK (all 3 tiers) | Confirmed unchanged |
| 233 Brokerage — all 3 rate values + the `annualCommissionTotal`/LOW-HIGH switching mechanism | Rates confirmed unchanged; mechanism must be preserved, not just rates |
| 155 Rent — Company flat rate + first 3 Individual/AOP slab brackets | Confirmed unchanged |

**153b SPECIFIED is the one exception requiring a flag, not a copy**: fy2026 has
6/12; TAGCO's TY2027 table shows 7/14 for the matching bucket. Because this value
is identical in fy2026 and fy2027 (i.e. fy2027 never touched it), it can't be
resolved by this analysis alone — copy fy2026's 6/12 forward as the safe default,
but mark it `NEEDS FBR CARD CONFIRMATION` rather than silently treating either
6/12 or 7/14 as settled.

---

## 2. Confirmed Structural Changes

Three sections show the Finance Bill changing the *shape* of the rule, not just a
number. (149 Salary's bracket shift, by contrast, is **not** treated as a
confirmed structural change — Section Origin Analysis found fy2027's slab shape
matches neither current law nor TAGCO; it's fabricated/historical, not a TAGCO-
confirmed amendment. It is handled in §3 as a rebuild needing fresh TAGCO
re-extraction, not a structural-change adoption.)

### 236C — Sale of Immovable Property

| | |
|---|---|
| **Current FY2026 structure** | 9 rates: 3 FMV bands (≤50M / 50-100M / >100M) × 3 filer tiers (ATL / Late Filer / Non-ATL) |
| **Proposed structure (TAGCO TY2027)** | FMV-banding removed entirely. Replaced by a holding-period test: disposal in year of acquisition → flat 3% (in lieu of CGT framing); all other disposals → 2.75% ATL / 5.5% Non-ATL. Late Filer tier removed. NRP-via-FCVA/NRVA special case (3% final tax) is new, not in fy2026. |
| **Data model impact** | `WhtSectionConfig.thresholds`/`rules` shape is sufficient — no new interface needed. But the `subType` values change meaning entirely: from `FMV_LE_50M`/`FMV_50M_TO_100M`/`FMV_GT_100M` to something like `SAME_YEAR_DISPOSAL`/`OTHER_DISPOSAL`. `propertyValue`-based FMV-band derivation logic in the engine is replaced by an acquisition-date-vs-disposal-date holding-period check. |
| **Engine impact** | `engine.ts`'s FMV-band derivation function for 236C (band-from-propertyValue) must be deleted and replaced with a holding-period derivation (needs an acquisition date input, which doesn't currently exist in `transactionFields` for this section). This is the one place where a **new transaction field is required**, not just a new rate. |
| **UI impact** | `calculator.tsx` / transaction form for 236C needs a new date input ("Date of Acquisition") to support the holding-period test. The existing `atlStatus` radio (ATL/Late Filer/Non-ATL) collapses to ATL/Non-ATL only — Late Filer option removed from this section's UI. |
| **Test impact** | All existing 236C FMV-band test cases in `wht.test.ts` (financeActYear: 2025 scope) remain valid for fy2026 — they are not touched. New TY2027-scoped tests needed for: same-year disposal (3%), other-disposal ATL (2.75%), other-disposal Non-ATL (5.5%), and the FCVA/NRVA non-resident special case. |

### 236K — Purchase of Immovable Property

| | |
|---|---|
| **Current FY2026 structure** | 9 rates: 3 FMV bands × 3 filer tiers, same shape as 236C |
| **Proposed structure (TAGCO TY2027)** | FMV-banding removed. Single flat "Normal Purchase" rate: 1.25% ATL / 2.5% Non-ATL. Late Filer tier removed. Non-Resident-via-FCVA/NRVA (0%) and Inheritance/Gift (Not Applicable) added as explicit new cases. |
| **Data model impact** | Simpler than 236C — no new field needed, just removal of FMV-band subType branching. `subType` becomes effectively unused (or a single `NORMAL_PURCHASE` value) plus two new edge-case subTypes for NR-via-FCVA and Inheritance/Gift. |
| **Engine impact** | Delete FMV-band derivation for 236K; replace with flat-rate lookup plus two special-case branches (non-resident FCVA/NRVA → 0%, inheritance/gift → not applicable/no WHT). |
| **UI impact** | `propertyValue` field's FMV-band helper text becomes irrelevant and should be removed/reworded. `atlStatus` radio drops the Late Filer option. May need a new field/checkbox for "Inheritance or Gift transfer" and "Buyer is Non-Resident via FCVA/NRVA" to route to the special-case rates. |
| **Test impact** | Existing fy2026 FMV-band tests untouched. New tests needed for: flat Normal Purchase ATL/Non-ATL, Inheritance/Gift (expect inapplicable), NR-via-FCVA/NRVA (expect 0%). |

### 150 — Dividends, MUTUAL_FUND sub-split (minor structural widening, not a full rebuild)

| | |
|---|---|
| **Current FY2026 structure** | Single `MUTUAL_FUND` subType, flat 25%/50%, representing only the "≥50% debt income" case |
| **Proposed structure (TAGCO TY2027)** | Splits into three: debt-fund + company recipient (29%/58%), debt-fund + other recipient (25%/50%), equity-fund (15%/30%) |
| **Data model impact** | `subType` enum for §150 gains 2 new values (e.g. `MUTUAL_FUND_DEBT_COMPANY`, `MUTUAL_FUND_EQUITY`) alongside renamed `MUTUAL_FUND_DEBT_OTHER` |
| **Engine impact** | Needs a `taxpayerType` (Company vs. other) AND a fund-type (debt vs. equity) selector to route correctly — currently only `dividendAmount` + `subType` + `atlStatus` exist for this section |
| **UI impact** | New "Fund Type" (Debt/Equity) field and reuse of existing `taxpayerType` radio for §150 |
| **Test impact** | New tests for all 3 mutual-fund sub-cases; existing GENERAL/IPP/SPV cases unaffected |

This is a genuine widening of an existing category, not as disruptive as 236C/236K, but still a data-model change, not a pure rate edit — flagged here so it isn't mistaken for a Phase-1 rate-only item.

---

## 3. July 1 Implementation Queue

| Phase | Sections | Why |
|---|---|---|
| **Phase 1 — Ready immediately after enactment** (pure copy or pure rate update, no data-model change) | 148, 152 (all), 153a (all non-OTHER_GOODS), 153b (IT/ITeS, Print Media), 153c (Sportsperson, Standard), 154, 156, 6a, 150 (LISTED, IPP, SPV_REIT, SPV_OTHER, EXEMPT_COMPANY), 151 (all), 233 (rates + restore switching mechanism), 155 (revert top bracket to 25%), 153a OTHER_GOODS (revert to 5/10, 5.5/11) | Either unchanged from fy2026, or a single confirmed-value revert with no structural work |
| **Phase 2 — Requires final FBR card validation** | 153b SPECIFIED (6/12 vs TAGCO's 7/14 — ambiguous, only an enacted/FBR card resolves it), 154A (Non-ATL rate flattening — TAGCO's table is ambiguous on filer-status differential for export services) | TAGCO text itself is unclear or conflicting; needs the authoritative post-enactment card, not just another bill-stage read |
| **Phase 3 — Requires legal interpretation** | 150 BONUS_SHARES (TAGCO routes it to a new §236Z, not §150 — confirming whether §236Z is in scope for this calculator at all is a product/legal scoping question, not a data question), 149 Salary (TAGCO's bracket numbers exist, but Pension treatment interaction with the new brackets, and whether Directorship Fee 20% needs its own line item, both need confirmation against the actual enacted Ordinance text, not just a rate-card summary) | Category boundaries and statutory cross-references need legal confirmation, not just numeric validation |
| **Phase 4 — Requires architecture changes** | 236C (new acquisition-date field + holding-period engine logic), 236K (new special-case branching for inheritance/gift and NR-via-FCVA), 150 MUTUAL_FUND (new fund-type + taxpayer-type-aware routing) | These need new `transactionFields`, new engine derivation logic, and new UI inputs — can't ship as a registry/data update alone |

---

## 4. Code Change Map

| File | Change required | Risk | Est. effort |
|---|---|---|---|
| `lib/tax-rules/rules/fy2027.ts` | Full rebuild from fy2026.ts structure + apply Phase 1 confirmed deltas. Phase 4 sections need new `transactionFields` entries (acquisition date for 236C; fund-type/taxpayerType routing for 150 MUTUAL_FUND; inheritance-gift + NR flags for 236K). Phase 2/3 sections ship with fy2026's current values as a safe interim default, explicitly commented `NEEDS FBR CARD CONFIRMATION` (not `[PLACEHOLDER]` — that tag already means something else in this codebase; use a distinct comment marker to avoid confusion with the existing carry-forward convention). | High (data-correctness-critical; this is the file the whole exercise is about) | 2-3 days: 0.5 day mechanical rebuild from fy2026 baseline, 1 day Phase 4 structural sections, 0.5 day Phase 2/3 interim-default sections + comments, 0.5 day self-review against this blueprint + the two prior analysis docs |
| `lib/tax-rules/types.ts` | Only if Phase 4 work needs a new field type not already in `FieldDefinition` (e.g. a `'date'` field type for 236C acquisition date — currently only `'number' \| 'select' \| 'radio' \| 'frequency_select'` exist) | Medium (touches a shared, widely-imported interface file) | 0.5 day, plus regression-check every existing section still type-checks |
| `lib/wht-engine/engine.ts` | New derivation logic for 236C (holding-period from acquisition date vs. transaction date), 236K (inheritance/gift + NR-via-FCVA special-case routing), 150 (fund-type-aware MUTUAL_FUND routing) | High (core calculation logic; errors here misstate tax owed) | 1.5-2 days including unit-level verification against the new test cases in §2/§3 |
| `lib/wht-engine/validator.ts` | Validation rules for new fields (acquisition date required when 236C selected; fund-type required when 150 MUTUAL_FUND selected) | Medium | 0.5 day |
| `lib/wht-engine/explanation.ts` | Update markdown explanation templates for 236C/236K/150 to reflect new structure (currently presumably explains FMV-band logic for 236C/236K) | Low-Medium (cosmetic/explanatory, not calculation-affecting, but a stale explanation showing FMV-band language for a holding-period-based rate would confuse users) | 0.5 day |
| `lib/tax-rules/rules/registry.ts` | Single-line change: move `2026` from implicit-hidden to `VISIBLE_TAX_YEARS` once Go-Live Checklist (§5) is fully satisfied. **This is the literal go-live switch for the whole feature.** | Critical (this is the one edit that exposes unvalidated tax rates to end users if done prematurely) | 5 minutes — but gated entirely behind §5, not a coding task |
| `lib/wht-engine/tests/wht.test.ts` | Add full TY2026-27 (financeActYear: 2026) coverage mirroring the existing Track-A/Track-B-style exhaustive per-section tests currently scoped to financeActYear: 2025 (see lines ~720-1034 of the current file for the pattern to replicate). Add explicit tests for the 236C/236K new structures and 150 MUTUAL_FUND split. | High (this is the safety net that would have caught every issue this analysis found, had it existed for fy2027 from the start) | 1-1.5 days |
| `components/wht/calculator.tsx` | New form fields for 236C (acquisition date), 236K (inheritance/gift checkbox, NR-via-FCVA checkbox), 150 (fund-type radio). No change needed to the year-selector itself — it already reads `VISIBLE_TAX_YEARS` dynamically (confirmed at `calculator.tsx:436`), so once registry.ts is updated the year picker just works. | Medium | 1 day |
| `components/wht/explanation-panel.tsx` | Verify it renders the updated `explanation.ts` output correctly for the new 236C/236K/150 structures; no structural change expected unless explanation markdown format changes | Low | 0.25 day (verification, likely no code change) |
| Documentation (`docs/FY2027_RATE_REVIEW.md`, `FY2027_CHANGE_ORIGIN_ANALYSIS.md`) | Add a closing addendum once Phase 2/3 items are resolved by the real FBR card, noting final vs. provisional values | Low | 0.25 day, after-the-fact |

**Total estimated effort: ~7-9 working days**, the large majority in fy2027.ts
rebuild + engine.ts structural logic + test coverage — not in registry.ts or UI,
which are mechanically small once the data/engine layer is right.

---

## 5. Go-Live Checklist

Mandatory, in order. No step may be skipped or reordered.

```
□ Finance Act 2026 enacted (bill passed by National Assembly)
□ Presidential assent obtained (Finance Act formally in force)
□ FBR final WHT rate card published for Tax Year 2026-27
□ TAGCO (or equivalent advisory) final/updated card published, cross-checked against FBR card
□ Every Phase 1 section re-confirmed against the FBR card (not just TAGCO)
□ Every Phase 2 section resolved using the FBR card (153b SPECIFIED, 154A filer-status differential)
□ Every Phase 3 section resolved via direct reading of the enacted Ordinance text (149 Pension/Directorship interaction, 150 Bonus Shares/§236Z scoping)
□ Every Phase 4 section's new data model + engine logic implemented and code-reviewed
□ fy2027.ts rebuilt per §4, with every value traceable to the FBR card (no remaining "TAGCO-only" or "fabricated" values per the Origin Analysis)
□ lib/tax-rules/types.ts updated if new field types were needed
□ lib/wht-engine/engine.ts updated and passing for all new structural sections
□ Full test suite passing, including new TY2026-27 coverage in wht.test.ts
□ Manual calculator testing completed for every one of the 12 deep-dive sections plus 150/236C/236K structural changes specifically
□ Manual cross-check: pick 5 random transactions per changed section, compute by hand against the FBR card, compare to calculator output
□ registry.ts: 2026 added to VISIBLE_TAX_YEARS
□ Code review sign-off referencing this blueprint + both prior analysis docs
□ Production deployment approved by [project owner]
```

---

## 6. Rollback Plan — if FBR figures diverge from TAGCO

**Sections needing immediate review if FBR conflicts with TAGCO:**
Any section where this blueprint's Phase 1 classification relied on TAGCO alone
without a long enacted-law track record — i.e., 236C, 236K, 150 MUTUAL_FUND
(the 3 structural-change sections), plus the 2 Phase 2 sections (153b SPECIFIED,
154A) which were already flagged as TAGCO-ambiguous before any FBR conflict is
even considered. These are the highest-prior-uncertainty sections; an FBR/TAGCO
mismatch there is the *expected* failure mode, not a surprise.

**Sections that can remain unchanged even if FBR conflicts with TAGCO elsewhere:**
Any Phase 1 section that is a pure carry-forward from fy2026 with TAGCO merely
confirming "no change" (148, 152, most of 153a/153b/153c, 154, 156, 6a, 151, most
of 150, 233 rates). If FBR's card disagrees with TAGCO on, say, §151, that's a
contained, single-section fix — it doesn't cast doubt on unrelated sections that
were never touched by Finance Bill 2026 in the first place. Treat each section's
trust level independently; don't let one mismatch trigger a full-file re-audit
unless the mismatch pattern itself suggests TAGCO's whole document is unreliable
(it doesn't, currently — TAGCO matched the no-change sections cleanly).

**Deployment strategy:**
1. Never flip `VISIBLE_TAX_YEARS` based on TAGCO alone — that gate is reserved
   for post-FBR-card confirmation only (already encoded in §5's checklist order).
2. If the FBR card arrives and conflicts with TAGCO on specific sections, patch
   only those sections in fy2027.ts, re-run the full test suite, and re-do the
   manual cross-check (§5) for just the affected sections before considering
   `VISIBLE_TAX_YEARS` again.
3. If the FBR card arrives significantly later than July 1 (i.e., after the new
   tax year has already started), keep `VISIBLE_TAX_YEARS = [2025]` and let
   users continue on fy2026.ts rates with a UI notice that TY2026-27 rates are
   pending official publication — never default users onto unvalidated TY2026-27
   rates just because the calendar date rolled over.
4. Once live, keep fy2026.ts frozen and immutable (already enforced by
   `deepFreeze` in registry.ts) as the rollback target — if a defect is found in
   the newly-enabled fy2027.ts post-launch, the fastest safe mitigation is
   reverting `VISIBLE_TAX_YEARS` to `[2025]` again, not a hotfix under pressure.

---

## 7. Final Recommendation

**B. Delete/rebuild fy2027.ts from the fy2026.ts baseline plus confirmed changes.**

Technical justification:

1. **The Origin Analysis found no single coherent source to patch against.**
   Patching implies the existing file is structurally sound with isolated
   defects. It isn't — the untagged ~45% has at least four distinct failure
   modes (fabricated rate cuts, deleted categories, a historical-data slab
   table, and two cases of correct structural instinct paired with wrong
   numbers). A patch pass risks fixing the items already found while leaving
   the file's underlying "no consistent reference" problem in place for the
   next reviewer.
2. **fy2026.ts is already the better starting point for ~85% of the file.**
   Per §1, the bulk of fy2027's content should be an exact copy of fy2026
   anyway — TAGCO confirms Finance Bill 2026 doesn't touch most sections.
   Starting from fy2026.ts and layering on confirmed deltas is strictly less
   work than auditing fy2027.ts line-by-line to decide what to keep.
3. **The 3 structural-change sections need new engine/data-model work
   regardless of which file they're built into.** Patching fy2027.ts in place
   wouldn't avoid the Phase 4 engineering effort in §4 — that work is identical
   either way. The only thing patching saves is preserving fy2027.ts's
   `[PLACEHOLDER]` comments and rule `id` naming scheme, which a rebuild can
   trivially replicate from fy2026.ts's existing convention.
4. **A rebuild produces a clean provenance trail.** Every value in the rebuilt
   file traces to either "copied from fy2026.ts, TAGCO-confirmed unchanged" or
   "explicitly sourced from TAGCO TY2027, pending FBR confirmation" — exactly
   the kind of traceability this analysis had to reverse-engineer for the
   *current* fy2027.ts after the fact. Building it in clean from the start
   avoids needing a third forensic-analysis document a year from now.

This recommendation is planning guidance only. No file listed in this document
has been modified as part of producing it.
