# FY2026-27 Batch 1 — Post-Implementation Audit

> **STATUS: AUDIT ONLY. NO CODE MODIFIED.**
> This is a verification pass over the Batch 1 implementation (rebuild of
> `fy2027.ts` from the FBR-validated `fy2026.ts` baseline plus enacted Finance
> Act 2026 deltas). It modifies nothing, enables nothing, deploys nothing.
> All facts below are drawn from `git diff`, the enacted `Finance_Act_2026.md`,
> and a clean run of the test suite.

---

## 1. Git Diff Verification

Four files modified, five docs added (untracked). `git diff --numstat`:

| File | Lines added | Lines removed | Purpose of change |
|---|---|---|---|
| `lib/tax-rules/rules/fy2027.ts` | 526 | 306 | Full Option-B rebuild from fy2026 baseline + enacted Batch 1 deltas. Rule ids `p25-`→`p26-`, effective dates `2026-07-01/2027-06-30`. Amended §149/§153b/§153c/§236C/§236K; carried forward all other sections; removed unsupported placeholder edits (bank-rate cut, Sukuk deletion, fabricated salary slabs, FMV→flat property guesses, §155 top-rate cut, §153 rate cuts, Bonus Shares). |
| `lib/wht-engine/engine.ts` | 28 | 8 | Three **config-gated** behavioural changes, no value hardcoding: (a) FMV-band derivation now guarded by `rules.some(r => r.subType === 'FMV_LE_50M')`; (b) §149 9% surcharge gated `config.financeActYear < 2026`; (c) pension 10% surcharge gated `config.financeActYear < 2026`. All three preserve FY2025-26 behaviour exactly. |
| `lib/wht-engine/validator.ts` | 5 | 3 | FMV subtype enumeration for §236C/§236K guarded by the same `rules.some(FMV_LE_50M)` predicate, so the flat FY2026-27 property configs validate (no "Missing Fallback" error). Mirrors the existing §151/§152/§233 guard pattern. |
| `lib/wht-engine/tests/wht.test.ts` | 189 | 80 | Updated every FY2026-27-targeting test from discarded-placeholder expectations to enacted values; added `testBatch1FinanceAct2026()`. Detail in §3. |

**Engine diff — exact gated conditions (verbatim from `git diff`):**
- FMV: `if ((section.code === '236C' || section.code === '236K') && section.rules.some((r) => r.subType === 'FMV_LE_50M'))`
- Salary surcharge: `if (section.code === '149' && config.financeActYear < 2026 && effectiveAmount.gt(10_000_000))`
- Pension surcharge: `const pensionSurchargeApplies = config.financeActYear < 2026;` then ternary on the `×1.10` multiplier.

**Validator diff:** the only change is adding `&& section.rules.some((r) => r.subType === 'FMV_LE_50M')` to the 236C/236K branch condition (plus a comment). No enumeration values changed.

---

## 2. Batch Scope Verification

Verified by `grep` over `fy2027.ts` (section codes present: 148, 149, 150, 151, 152,
153a, 153b, 153c, 6a, 154, 154A, 155, 156, 233, 236C, 236K — **16 codes, identical
set to fy2026; zero new sections**) and by inspecting the §154/§154A rate values.

| Item | IMPLEMENTED | Evidence |
|---|---|---|
| Section 151B (life-insurance payouts) | **NO** | No `code: '151B'` in fy2027.ts; the string "151B" appears only in the header comment ("NOT added in Batch 1"). |
| Section 154 (Div IV 1%→1.25%) | **NO** | §154 rules still `rate: 2` and `rate: 0` — carried forward verbatim, not 1.25/2.25. |
| Section 154A (Div IV 1%→1.25% + filer treatment) | **NO** | §154A rules still `0.25 / 0.5 / 1 / 2` — carried forward verbatim, no 1.25. |
| Section 154B (social-media revenue 5%) | **NO** | No `code: '154B'`; string appears only in header comment. |
| Section 152 Division II mapping (1DA) | **NO** | §152 carried forward unchanged (15 sub-categories restored); no new Div II rate applied. |
| Division XXVII mapping (5%→0.5%) | **NO** | No section touched for this; not in scope of any modelled section this batch. |
| Registry visibility (add 2026 to VISIBLE_TAX_YEARS) | **NO** | `registry.ts` unchanged (git clean); `VISIBLE_TAX_YEARS = Object.freeze([2025])`. |
| Production deployment | **NO** | No deploy action taken; feature remains hidden. |

**Conclusion: no Batch 2 or Batch 3 functionality was implemented.** All Batch-2
sections were carried forward unchanged and explicitly tagged "Batch 2 pending"
in-file.

---

## 3. Test Audit

`+189 / −80` lines. Two categories: (A) rate/slab expectations corrected from the
discarded placeholder to the enacted values; (B) placeholder-tag assertions
inverted for carried-forward/amended sections. Plus one new test function.

### A. Value corrections (placeholder → enacted)

| Test | Old assertion | New assertion | Reason |
|---|---|---|---|
| `testFrequencies` §153a OTHER_GOODS Co/ATL | `rate 4`, wht 4,000, net 96,000 | `rate 5`, wht 5,000, net 95,000 | Placeholder had cut goods to 4%; enacted Act made **no §153 goods change**, so it reverts to the fy2026 carry-forward value (5%). |
| `testProgressiveSlabs` §149 (2.4M) | annual 210,000; monthly 17,500; net 182,500; 6 slabs; slab[1].tax 30,000; slab[2] 1.2M/180,000 | annual 156,000; monthly 13,000; net 187,000; 8 slabs; slab[1].tax 6,000; slab[2] 1.0M/110,000; slab[3] 200k/40,000 | Placeholder slabs (5/15/25 at 2.4M/3.6M/6M) replaced by enacted Div I table (1/11/20… at 1.2M/2.2M/3.2M…). |
| `testProgressiveSlabs` boundaries | 1.2M→30,000; 2.4M→210,000; 2.4M+1→210,000 | 1.2M→6,000; 2.4M→156,000; 2.4M+1→156,000 | Same enacted-slab correction. |
| `testThresholdGuard` §153b OTHER_SERVICES | theoreticalRate 15; theoreticalWht 3,750; expl "3,750"; above rate 15; wht 12,000 | 14; 3,500; "3,500"; 14; 11,200 | Enacted Div III(2)(v) makes residual "other services" **14%** (15% is now the separate PROFESSIONALS line). |
| `testSection149WithBonusAllowances` A | 120,000 / 10,000 / 90,000 | 72,000 / 6,000 / 94,000 | Enacted §149 slabs. |
| …scenario B | 1,050,000 / 87,500 / 62,500 | 918,000 / 76,500 / 73,500 | Enacted §149 slabs. |
| …scenario C | 1,050,000 / 87,500 / 12,500 | 918,000 / 76,500 / 23,500 | Enacted §149 slabs. |
| …regression (2.4M) | 210,000 / 17,500 | 156,000 / 13,000 | Enacted §149 slabs. |
| `testTrackARates2025` cross-year | fy2027 2.4M → 210,000 ("5%/15% slabs intact") | 156,000 ("FA2026 enacted slabs") | Re-framed from "old placeholder unaffected" to "uses its own enacted bands". |

### B. Placeholder-tag inversions

For §233, §156, §148 (carry-forward, reviewed) and §154, §154A, §152 (carry-forward,
Batch-2 pending), the FY2026-27 assertion changed from
`rules.every(r => r.rateLabel.includes('[PLACEHOLDER]'))` to
`rules.every(r => !r.rateLabel.includes('[PLACEHOLDER]'))`. **The FY2027-28 (fy2028)
assertions were left intact** — those configs are still `[PLACEHOLDER]` and untouched.
Reason: the rebuild removed `[PLACEHOLDER]` tags from fy2027 because every rule is now
either reviewed-against-the-Act or an explicit carry-forward; the tag no longer
describes the file.

### C. New test
`testBatch1FinanceAct2026()` — forces `financeActYear: 2026` and asserts enacted
§149 slabs (156k/316k/1,774k boundaries) + surcharge repeal, pension no-surcharge
(250,000), §153b restructure (7/15/12/14/4), §153c sportsperson 20/40, §236C
2.75%/5.5% + Late-Filer-removed, §236K 1.25%/2.5% + Late-Filer-removed, and
carry-forward sanity (§151 Bank 20 / Sukuk 25, §150 no Bonus Shares, §155 top slab 25%).

### Confirmations
- **No Batch 2 rates introduced in tests.** §154/§154A still assert their carried-forward
  values; no test asserts 1.25%, §151B, §154B, or any Div II/XXVII figure.
- **No assumptions added in tests.** Every changed expectation traces to an enacted
  First Schedule value (Div I §149, Div III/IIIAA §153, Div X/XVIII §236C/K) or to a
  carry-forward from the FBR-validated fy2026 baseline.
- **Changes only remove obsolete placeholder expectations** (Category A) or correct the
  now-inaccurate placeholder-tag assertions (Category B). No test was weakened to mask a
  behavioural change; the new `testBatch1FinanceAct2026()` adds positive coverage rather
  than relaxing existing checks.

Full suite result after all edits: **ALL WHT ENGINE TESTS PASSED**, `tsc --noEmit` clean.

---

## 4. Pension Surcharge Review

**Finance Act reference:** Finance Act, 2026 (Act XLIII of 2026), §5(2) — amendment to
section 4AB of the Income Tax Ordinance 2001.

**Section 4AB wording (verbatim from the enacted text):** the proviso reading
> "a surcharge shall be payable at the rate of nine percent of the income tax imposed
> under Division I of Part I of the First Schedule where the income exceeds rupees ten
> million in a tax year"

is substituted with
> "no surcharge shall be payable."

**Reasoning for removing surcharge on pension:** The implementation gates *both* the
§149 9% high-earner surcharge **and** the §149(1A) pension branch's 10% surcharge
component on `financeActYear < 2026`, treating the s.4AB repeal as removing all s.4AB
surcharge for TY2026-27.

**Classification — split, because the two surcharges are not the same instrument:**

- **9% salary surcharge → CONFIRMED BY LAW.** The §4AB proviso text addresses exactly
  this: a 9% surcharge on the Division-I salary tax above Rs 10M. Its repeal is the
  literal effect of the amendment. The engine gate produces the correct enacted result.

- **10% pension surcharge → INTERPRETATION (escalate to human/tax-counsel review).**
  The pension branch applies a **10%** surcharge (`×1.10`), not the 9% figure named in
  §4AB, and it sits inside the §149(1A) pension computation. The enacted §4AB amendment
  speaks only to the "nine percent … Division I" surcharge. Whether the pension 10%
  surcharge is itself a creature of §4AB (and therefore swept away by the same repeal)
  or a distinct §149(1A) mechanism that survives is **not resolved by the §4AB text
  alone**. The code comment asserts it "derives from s.4AB," but that linkage is an
  interpretation, not something the quoted amendment proves. Dropping it is the more
  internally-consistent reading (one surcharge regime, now repealed), and it is the
  conservative direction for the taxpayer, but it should be confirmed against the
  consolidated §149(1A)/§4AB text by a human reviewer before go-live. **This is the
  single most material judgement call in Batch 1.**

---

## 5. Property Simplification Review

- **FMV banding removed (TY2027):** CONFIRMED. fy2027 §236C/§236K each carry exactly
  2 rules (ATL + Non-ATL flat), no `FMV_*` subtypes. The engine's band-derivation and
  the validator's band-enumeration are both now guarded by
  `rules.some(r => r.subType === 'FMV_LE_50M')`, which is false for these flat configs,
  so no band logic runs. Matches enacted Div X (2.75%) and Div XVIII (1.25%), which were
  fully substituted.
- **Late Filer removed only in TY2027:** CONFIRMED. The fy2027 §236C/§236K `atlStatus`
  field options contain only `ATL` and `NON_ATL` (test `testBatch1FinanceAct2026()`
  asserts no `LATE_FILER` option). The shared `AtlStatus` type, fy2026's 9-rate
  FMV×filer matrix (which still uses `LATE_FILER`), and the fy2026-facing UI are all
  untouched — global removal was correctly judged unsafe because the rollback baseline
  depends on it.
- **FY2026 behaviour preserved:** CONFIRMED. `testSection236C`/`testSection236K`
  (financeActYear 2025) still pass unchanged — all 9 FMV×filer rates, band-boundary
  derivation, and the LATE_FILER tier resolve exactly as before.

---

## 6. Rollback Verification

- **fy2026.ts unchanged:** CONFIRMED. `git status --short lib/tax-rules/rules/fy2026.ts`
  returns empty (no modification).
- **registry.ts unchanged:** CONFIRMED. `git status` clean; `VISIBLE_TAX_YEARS =
  Object.freeze([2025])` — FY2027 remains hidden, and the deep-freeze rollback target is
  intact.
- **financeActYear: 2025 behaviour unchanged:** CONFIRMED. The engine/validator changes
  are all gated on `financeActYear < 2026` or on the presence of `FMV_LE_50M` rules
  (which only fy2026 has), so the 2025 code path is byte-for-byte equivalent.
- **All legacy tests passing:** CONFIRMED. The entire TY2025-26 suite (TrackA, §153
  split, D1–D4 remediation, audit-remediation incl. the C3 §149 9%-surcharge test at
  financeActYear 2025, material-remediation incl. M4 pension 275,000 with surcharge,
  explanation tests) passes unmodified. Final run: **ALL WHT ENGINE TESTS PASSED**.

---

## 7. Final Recommendation

**APPROVE BATCH 2 WITH CONDITIONS.**

Batch 1 is clean: the diff is confined to the four expected files, fy2026 and the
registry are untouched, FY2027 is hidden, the scope boundary held (zero Batch-2/3
functionality), the test changes only correct discarded-placeholder expectations to
enacted values with no new assumptions, and the property simplification and rollback
guarantees all verify. The implementation is faithful to the enacted First Schedule.

Conditions to clear before, or as part of, Batch 2:

1. **Resolve the pension 10% surcharge classification (§4 above).** It is currently an
   INTERPRETATION, not confirmed by the §4AB text. Obtain human/tax-counsel confirmation
   that the §149(1A) pension surcharge is repealed for TY2026-27; if it survives, the
   engine gate must be narrowed to the 9% salary surcharge only. This does not block the
   rest of Batch 2 but must be closed before go-live (Batch 3).
2. **Carry the §236C/§236K Non-ATL doubling assumption into the Batch 3 FBR-card
   reconciliation.** The 5.5% / 2.5% Non-ATL figures are derived via Tenth Schedule
   Rule 1 (×2), not stated in the Division text; confirm against the published FBR card.
3. **Batch 2 must resolve, not inherit, the carried-forward pending items** (§152 Div II
   rate, §154/§154A Div IV 1.25% mapping, Division XXVII, and the two new sections §151B
   and §154B) against the enacted Act text and the FBR card — not the TAGCO draft.

No code was modified, FY2027 was not enabled, and nothing was deployed in producing
this audit.
