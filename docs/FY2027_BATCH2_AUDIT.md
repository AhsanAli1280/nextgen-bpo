# FY2026-27 Batch 2 — Post-Implementation Legal Audit

> **STATUS: AUDIT ONLY. NO CODE MODIFIED.**
> Verification pass over Batch 2 (new sections §151B and §154B; resolution of the
> §152(1DA), §154, §154A, and Division XXVII pending items; re-verification of
> §153a and §155). Nothing is modified, enabled, or deployed. Facts are drawn
> from `git diff`, the enacted `Finance_Act_2026.md`, and a clean test run.
>
> **Authoritative-source caveat:** the **final FBR TY2027 WHT Rate Card was not
> available** at implementation time. Every Batch 2 value derives from the
> **enacted Finance Act 2026** (primary) with **TAGCO** as a secondary
> cross-check. FBR-card reconciliation is a Phase 3 (Batch 3) deliverable.

---

## 1. Git Diff Verification

Nothing has been committed (per the "do not push" instruction), so `git diff` is
cumulative across Batch 1 + HOTFIX-001 + Batch 2. The table below isolates the
**Batch 2-attributable** change per file (cumulative working-tree numbers shown in
parentheses for reference).

| File | Purpose of Batch 2 change | Lines added | Lines removed |
|---|---|---|---|
| `lib/tax-rules/rules/fy2027.ts` | Added §151B + §154B sections; relabelled §152(1DA) to the FCVA channel; §154 STANDARD_EXPORT 2%→2.25%; cleared §154A pending markers + noted 2029 sunset; marked §153a/§155 COMPLETE; header updated. | ~+150 Batch 2 (working tree +633 incl. Batch 1 rebuild) | ~−40 Batch 2 (working tree −283) |
| `lib/wht-engine/engine.ts` | Added dedicated §151B branch (taxable base = payout − premiums, floored at 0; rate via `resolveRule`; final tax). | +36 (working tree +64 incl. Batch 1 gates) | 0 (Batch 2 portion) |
| `lib/wht-engine/explanation.ts` | Added §151B explanation branch (payout − premiums = base × rate, final-tax note). | +25 | 0 |
| `lib/wht-engine/tests/wht.test.ts` | Added `testBatch2FinanceAct2026()` + registration. | ~+95 Batch 2 (working tree +341 incl. Batch 1 + hotfix) | 0 (Batch 2 portion) |
| *(unchanged by Batch 2)* `loader.ts` +36, `calculator.tsx` +7/−5, `validator.ts` +5/−3 | HOTFIX-001 / Batch 1 only — listed for completeness | — | — |

Section count in `fy2027.ts`: **16 → 18** (added §151B, §154B). No source files
other than those above were touched by Batch 2.

---

## 2. Section 151B Validation

**Exact Finance Act wording (Act §5(24), inserting §151B):**
> "**151B. Certain payments by life insurance companies and takaful operators.**—
> (1) Every life insurance company, including a family takaful operator or a
> window takaful operator, making any payout, benefit, surrender value, maturity
> proceeds or similar payment **to an individual** under a life insurance policy,
> family takaful certificate, plan or arrangement shall, at the time of making
> such payment, deduct tax at the rate specified in **Division IC of Part III of
> the First Schedule**.
> (2) … the amount liable to tax deduction shall be the **gross amount of payout
> or benefit reduced by the aggregate amount of premiums or contributions paid**
> by the policyholder or participant.
> (3) The provisions of sub-section (1) shall not apply where the payout or
> benefit— (a) is made on account of **death** of the insured or participant;
> (b) is made on account of **disability** …; or (c) is made **after completion
> of four years** from the date of issuance …
> (4) Tax deducted under this section shall be treated as **final tax** on the
> income arising from such payout or benefit."

**Exact Division IC wording (Act §5(44)(b)(i), new Division IC, Part III):**
> "Division IC — Certain payments by life insurance companies and takaful
> operators. (1) Where payout or benefit is made **within one year** … **15%**.
> (2) Where payout or benefit is made **after one year but before completion of
> four years** … **10%**."

**Implementation explanation:**
- **Taxable base** — `engine.ts` §151B branch computes `max(0, payoutAmount −
  premiumsPaid)`. This matches s.151B(2) ("gross amount … reduced by the
  aggregate amount of premiums or contributions paid"). The floor at 0 is a
  defensive guard (premiums ≥ payout → no positive base); not contradicted by the
  Act.
- **Premiums paid** — a required input field (`premiumsPaid`); subtracted from the
  gross payout before the rate is applied. Verified by test
  (`premiums > payout → 0 tax`).
- **Exempt scenarios** — modelled as a single timing-band option
  `EXEMPT_4Y_DEATH_DISAB` at rate 0%, covering all three s.151B(3) carve-outs
  (death, disability, after 4 years). Combining them into one zero-rate option is
  a UI simplification, not a rate change — the statutory effect (no deduction) is
  identical for all three.
- **Final-tax treatment** — rate labels and the explanation state "Final Tax"
  (s.151B(4)).
- **Rates** — 15% (within 1yr) / 10% (1–4yr), exactly per Division IC.
- **No ATL/Non-ATL split** — Division IC states single band rates; Tenth Schedule
  rule 10(aa) (Act §5(47)(b)) places §151B-non-resident deductions on the
  no-100%-increase list, consistent with no filer doubling. Modelled with
  `atlStatus: null`.

**Classification: CONFIRMED** — for the rates, the net-of-premiums base, the
final-tax treatment, and the three exemptions, all of which are explicit in the
enacted text. **One residual INTERPRETATION (minor):** collapsing the three
distinct s.151B(3) exemptions into one dropdown option. This does not affect any
computed value (all → 0%), but if the calculator's philosophy prefers each
statutory carve-out to be separately selectable/auditable, split it in Phase 3.

---

## 3. Section 154B Validation

**Exact statutory wording (Act §5(26), inserting §154B):**
> "**154B. Withholding tax on revenues received from social media platforms.**—
> (1) Every banking and non-banking financial institution shall, at the time of
> credit or receipt of any amount in an account of a person, deduct tax at the
> rate specified in **Division IIIAB of Part III of the First Schedule**, where
> such amount represents revenues received from social media platforms. …
> (3) The tax deducted under this section shall be— (a) **minimum in the case of
> a resident person**; and (b) **final tax in the case of a non-resident person
> not having a permanent establishment in Pakistan**. …"

**Exact Division IIIAB wording (Act §5(44)(b)(iv), new Division IIIAB):**
> "Division IIIAB — Withholding Tax on Revenues Received from Social Media
> Platforms. The rate of tax to be deducted under section 154B shall be **5%**."

**Implementation:**
- **Resident treatment** — subType `RESIDENT`, rate **5%**, label "5% Minimum Tax"
  (s.154B(3)(a)).
- **Non-resident treatment** — subType `NON_RESIDENT_NO_PE`, rate **5%**, label
  "5% Final Tax" (s.154B(3)(b); §169 was consequentially amended, Act §5(29), to
  add this to the final-tax list).
- **Rationale for labels** — the rate (5%) is identical for both; the only
  statutory difference is the *character* of the tax (minimum vs final), which the
  calculator surfaces via the rate label and the residency selector. A WHT-rate
  calculator computes the deducted amount (5% either way); minimum-vs-final
  affects the taxpayer's downstream return treatment, not the deduction.

**Classification: CONFIRMED** — rate (5%), the minimum/final split, and the
resident/non-resident basis are all explicit in the enacted text. The
minimum-vs-final distinction being label-only (not amount-affecting) is a faithful
representation for a withholding calculator, not an interpretation that changes any
number.

---

## 4. Section 154 Validation

**Exact Finance Act wording (Act §5(44)(b)(v), Division IV, Part III):**
> "(v) in **Division IV**,— (A) in **paragraph (1)**, for the expression '1%',
> the expression '**1.25%**' shall be substituted; and (B) in **paragraph (3)**,
> for the expression '1%', the expression '**1.25%**' shall be substituted."

**Division IV context:** Division IV of Part III governs the §154 export
minimum-tax rate. The §147 advance-tax component for exporters (Cl. 47C, Part IV,
Second Schedule) is a **separate, unamended 1%**.

**What 2.25% represents:** The implementation sets `STANDARD_EXPORT` to **2.25% =
1.25% (§154 minimum tax, Division IV(1)&(3)) + 1% (§147 advance tax)**. This is a
**combined burden** figure (the total withheld at realization), carried forward
from the fy2026 modelling convention, which already bundled the §154 1% + §147 1%
into a single 2% line. It is **not** "minimum tax only" (that component is 1.25%),
and it is **not** mere presentation convenience — it reflects the actual total
withheld in one event.

**Calculator philosophy — combined vs separate display:**
- The fy2026 baseline established a **combined-display** convention for §154
  (single 2% rule, label naming both components). Batch 2 preserved that
  convention (single 2.25% rule, label naming "1.25% §154 + 1% §147").
- **This is the one place a product decision is genuinely open.** A combined
  display is simpler and matches the realized cash withholding; a separate display
  (two line items: 1.25% §154 minimum + 1% §147 advance) is more legally precise
  and lets a user see the minimum-tax vs advance-tax split — which matters because
  the two components have different adjustability/refund characteristics.

**Recommendation:** Default to **A. Combined display** (consistent with the
fy2026 baseline and the realized-withholding view), but **flag for product/legal
confirmation in Phase 3** whether a separate 1.25%/1% breakdown is required for the
FBR card's presentation. The combined 2.25% is arithmetically correct either way.

**Classification: INTERPRETATION** — the 1.25% §154 rate change is CONFIRMED by
the enacted text; the **2.25% combined presentation** (bundling the unamended §147
1%) is an interpretation inherited from the fy2026 convention, not something the
§154 amendment itself prescribes. Requires product/FBR-card confirmation of the
display philosophy in Phase 3.

---

## 5. Section 152(1DA)

**Exact amended wording (Act §5(25), substituting §152(1DA)):**
> "(1DA) Every banking company maintaining a Foreign Currency Value Account
> (FCVA), Foreign Currency Business Value Account (FCBVA), Non-Resident Rupee
> Value Account (NRVA), or Non-Resident Rupee Business Value Account (NRBVA) shall
> deduct tax from **capital gain arising on the disposal of debt instruments and
> Government securities and certificates (including Shariah compliant variant)**
> invested through aforesaid accounts **at the rate specified in Division II of
> Part III of the First Schedule**."

**Rationale for retaining 10%:** The First Schedule amendment list (Act §5(44))
enumerates changes to Divisions IC, III, IIIAA, IIIAB, IV, and IVA of Part III —
it does **not** touch **Division II**. Since §152(1DA) deducts "at the rate
specified in Division II," and Division II is unchanged, the rate carries forward
unchanged. The existing `OTHER_SECURITIES_GAIN` rule already held **10%** for the
§152(1DA) capital gain; Batch 2 retained the 10% and only **relabelled** it to the
amended account-based wording (FCVA/FCBVA/NRVA/NRBVA). TAGCO (secondary) lists this
capital gain at 10%, corroborating. **No rate was inferred** — 10% is the
carried-forward Division II value.

**Recommendation — single vs separate line items:** The substituted §152(1DA) is
narrower and more specific than the prior SCRA-based (1D) gain: it is keyed to four
named account types. The model currently keeps **one** `OTHER_SECURITIES_GAIN`
line (1DA) alongside the separate `DEBT_SECURITIES_GAIN` (1D) line.
- **Recommendation: keep a single line item for §152(1DA)** as implemented
  (one 10% rate, relabelled), since the rate is uniform across the four account
  types and the debt/Govt-securities scope. **Confirm against the FBR card in
  Phase 3** whether the card distinguishes the FCVA-channel (1DA) gain from the
  SCRA (1D) gain at the rate level — if both remain 10%, the current two-line
  structure (1D + 1DA) is sufficient and no further split is needed.

---

## 6. Scope Verification

- **FY2026 unchanged:** CONFIRMED — `git status` shows no modification to
  `fy2026.ts`; the full TY2025-26 legacy suite passes unchanged.
- **Registry unchanged:** CONFIRMED — `registry.ts` is git-clean;
  `VISIBLE_TAX_YEARS = Object.freeze([2025])`.
- **FY2027 hidden:** CONFIRMED — 2026 is not in `VISIBLE_TAX_YEARS`; the new
  §151B/§154B live in the hidden FY2026-27 config and, via HOTFIX-001, cannot
  become the default active year. A test asserts `2026 ∉ VISIBLE_TAX_YEARS`.
- **No deployment performed:** CONFIRMED — no commit, push, tag, or deploy; all
  changes remain in the working tree.

Test/typecheck status: **ALL WHT ENGINE TESTS PASSED**, `tsc --noEmit` clean.

---

## 7. Final Recommendation

**APPROVE BATCH 3 WITH CONDITIONS.**

Batch 2 is legally faithful: §151B and §154B are CONFIRMED against the enacted
text (rates, net-of-premiums base, final-tax treatment, exemptions, minimum/final
split); §152(1DA) correctly retains the unamended Division II rate (10%) with no
inference; §154A correctly carries forward unchanged (sunset extension only);
Division XXVII is correctly out of scope; §153a/§155 re-verified unchanged. FY2026,
the registry, and FY2027's hidden status are all intact.

Conditions to clear in Batch 3:

1. **FBR TY2027 WHT Rate Card reconciliation (blocking for go-live).** The card
   was unavailable here; every Batch 2 value must be line-by-line reconciled
   against it before enablement — especially §152(1DA) (Division II = 10%?),
   §154 component split, and the §151B/§154B rates.
2. **§154 display philosophy (§4).** Confirm with product/legal whether §154
   should show a combined **2.25%** or a separate **1.25% §154 + 1% §147**
   breakdown. INTERPRETATION, not yet settled.
3. **§151B exemption granularity (§2).** Decide whether the three s.151B(3)
   carve-outs (death / disability / after-4-years) should be separately selectable
   rather than one zero-rate option. No computational impact; auditability choice.
4. **Carry the still-open Batch 1 items into Batch 3** (already scheduled): pension
   10% surcharge interpretation, and §236C/§236K Non-ATL ×2 derivation.

No code was modified, FY2027 was not enabled, and nothing was deployed in producing
this audit.
