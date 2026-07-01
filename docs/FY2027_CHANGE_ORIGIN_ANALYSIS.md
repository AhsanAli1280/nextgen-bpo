# FY2026-27 WHT Rate Origin & External Validation Analysis

> **STATUS: ANALYSIS ONLY. NO SOURCE FILES MODIFIED.**
> This document does not change `fy2027.ts`, `registry.ts`, tests, or UI. It builds on
> [`FY2027_RATE_REVIEW.md`](./FY2027_RATE_REVIEW.md) and cross-references every
> "NEEDS VERIFICATION" item against an independent external source: the TAGCO
> ("Tariq Abdul Ghani & Co., Chartered Accountants") *Withholding (Income) Tax
> Rates — Tax Year 2027* rate card, which summarizes the **Finance Bill 2026**
> (proposed, not yet enacted, as published by TAGCO — see caveat in §0).

## 0. Sources & a critical caveat

| Source | Role | Status |
|---|---|---|
| `lib/tax-rules/rules/fy2026.ts` | FBR-validated baseline, Tax Year 2025-26 | Authoritative, in production |
| `lib/tax-rules/rules/fy2027.ts` | Draft under review, Tax Year 2026-27 | Not in production, not FBR-validated |
| TAGCO TY2027 Rate Card (`tagco.pk/wp-content/uploads/2026/06/tax-2027.pdf`) | External advisory-firm summary of **Finance Bill 2026** | Third-party interpretation, explicitly self-described as provisional |

TAGCO's own document states (verbatim, extracted from page 1):

> "This document aims to summarize the tax law on withholding tax... taking into
> account the **proposed amendments vide the Finance Bill, 2026**. **If approved**,
> these tax rates & treatments are to be effective from July 01, 2026... Tax laws
> are subject to change from time to time and we do neither warrant... the
> currency of the above details..."

**Implication:** TAGCO is not FBR law either — it is a *third interpretation*, of a
*bill*, not an *act*. Three non-identical documents, none individually authoritative
on their own for production use. This analysis treats TAGCO as the best available
external check on whether fy2027.ts's untagged deltas look like genuine forthcoming
law vs. drafting noise — not as a substitute for an eventual FBR-published TY2026-27
rate card once the Finance Act 2026 is actually passed.

PDF text extraction note: the TAGCO PDF is AES-encrypted and uses a multi-column
table layout. Extraction (via `pypdf` + `cryptography`) recovered all text but lost
column alignment in a few dense tables (notably §151 Profit on Debt). Where the
column collapse makes a TAGCO figure ambiguous, this is flagged explicitly rather
than guessed.

---

## 1. Objective 1 — What is fy2027.ts?

**Verdict: (d) a mix of multiple sources, with no single consistent origin.**

Evidence-based breakdown of the file's ~210 rules:

- **~55% — genuine `[PLACEHOLDER]` carry-forward from fy2026.ts.** Numerically
  identical to FY2025-26, explicitly commented as such, and (per Section 4 below)
  these values for the most part *also* match TAGCO's TY2027 proposal — meaning
  Finance Bill 2026 left them untouched. These are low-risk.
- **~25% — untagged values that conflict with both fy2026 and TAGCO.** No
  resemblance to current law or proposed law. Concentrated in §149 (Salary slabs,
  Pension feature deleted entirely), §236C/§236K (fabricated flat rates that don't
  match either source), §153a/§153c (silent rate cuts), §151 (Bank rate cut, NSSF
  restructured with an unexplained rate).
- **~10% — untagged values that match TAGCO almost exactly** despite not being
  flagged as validated (e.g., §150 LISTED, §155 Company, §153c Sportsperson,
  parts of §233). These look like accidental correctness, not deliberate
  Finance-Act tracking — the file doesn't distinguish "this changed because the
  law changed" from "this changed because someone typed a different number."
- **~10% — silently deleted categories** that exist in both fy2026 and TAGCO
  (Sukuk in §151; 10 of 15 sub-categories in §152; FMV/Late-Filer banding in
  §236C/§236K; LIA threshold-switching mechanism in §233; Pension subType in §149).

No evidence supports "(a) genuine Finance Act 2026 draft" as a whole — a genuine
draft would track TAGCO's actual proposed changes (it gets some directionally
right, see §236C/236K in Section 4, but the specific numbers are wrong). No
evidence supports "(c) a copy of older historical rates" as a *uniform* explanation
either — only §149's slab breakpoints show that pattern in isolation (see Section 4).
"(b) partially edited placeholder" is the closest single label, but understates how
inconsistent the untagged 45% is internally.

---

## 2. Consolidated Source ID / External Validation / Historical Pattern (A+B+C)

One table covers Objectives A, B, and C for every NEEDS VERIFICATION row from the
Rate Review. Full narrative for the 12 named deep-dive sections follows in Section 4.

| Section | Item | fy2026 value | fy2027 value | TAGCO TY2027 value | A. Likely Origin | B. TAGCO Match |
|---|---|---|---|---|---|---|
| 149 | Salary slab breakpoints/rates | 600k/1.2M/2.2M/3.2M/4.1M; 1/11/23/30/35% | 600k/1.2M/**2.4M**/**3.6M**/**6M**; 0/**5**/**15**/**25**/**30**/35% | 600k/1.2M/2.2M/3.2M/4.1M/5.6M/7M; 1/11/20/25/29/32/35% | Historical tax year (pre-FY2024-25 bracket shape) | CONFLICTS WITH TAGCO |
| 149 | Pension subType + pensionerAge field | Present (5% + 10% surcharge logic, age<70, >Rs10M) | **Deleted entirely** | Present, 5% on >Rs10M (age<70) | Partial category deletion | CATEGORY MISSING IN FY2027 |
| 150 | BONUS_SHARES | Removed (explicit comment: incorrect category) | **Reintroduced**, 10/20 | Exists, but as **separate §236Z**, not §150, rate 10/20 | Manual editing (re-added wrong placement) | PARTIALLY MATCHES TAGCO (rate right, section wrong) |
| 150 | SPV_REIT / SPV_OTHER / EXEMPT_COMPANY | 0/0, 35/70, 25/50 | **Missing** | Confirmed present: SPV-REIT 0/0, SPV-other 35/70, exemption/loss co. 25/50 | Partial category deletion | CATEGORY MISSING IN FY2027 |
| 150 | MUTUAL_FUND | 25/50 (flat) | 25/50 (flat) | Splits: debt-fund company 29/58, debt-fund other 25/50, equity fund 15/30 | FY2025-26 carry-forward | PARTIALLY MATCHES TAGCO |
| 151 | BANK | 20/40 | **15/30** | 20/40 (companies) | Manual editing | CONFLICTS WITH TAGCO |
| 151 | NSSF (flattened) | NSSF_INDIVIDUAL 15/30, NSSF_OTHER 20/40 | **NSSF flat 10/20** | No 10% figure appears anywhere in TAGCO's Govt-Securities/NSSF rows (15%/20%/30%/40% visible) | Unknown source | CONFLICTS WITH TAGCO |
| 151 | SUKUK (all 3 tiers) | Present, matches TAGCO (see §4) | **Missing entirely** | Confirmed present, same structure | Partial category deletion | CATEGORY MISSING IN FY2027 |
| 152 | 10 of 15 sub-categories (PE 2A breakdown, SCRA capital gains, Sukuk-NR) | Present | **Missing** (only 5 remain, all `[PLACEHOLDER]`) | Confirmed present for the PE breakdown and SCRA gains | Partial category deletion | CATEGORY MISSING IN FY2027 |
| 153a | OTHER_GOODS (Company / Individual) | 5/10, 5.5/11 | **4/8, 4.5/9** | 5/10 (company "Others"), 5.5/11 (AOP/Individual "Others") — unchanged | Manual editing | CONFLICTS WITH TAGCO |
| 153b | SPECIFIED | 6/12 | 6/12 (unchanged, tagged placeholder) | 7/14 (the matching TAGCO bucket: transport/freight/courier/hotel/etc.) | FY2025-26 carry-forward (stale — possibly already wrong in fy2026) | CONFLICTS WITH TAGCO |
| 153c | STANDARD (Company / Individual-AOP) | 7.5/15, 8/16 | **7/14, 7.5/15** | 7.5/15 (Listed Co.), 8/16 (Individual/AOP) — unchanged | Manual editing | CONFLICTS WITH TAGCO |
| 154A | Non-ATL rate for both subtypes | Explicit ATL/Non-ATL split (0.25/0.5, 1/2) | **Single flat rate, `atlStatus: null`** | TAGCO shows single rates with an "OR/Optional Advance Tax" annotation — no clear Non-ATL doubling visible | Ambiguous — possibly TAGCO TY2027 itself | CANNOT FULLY DETERMINE (extraction ambiguity) |
| 155 | Top bracket rate | 25% (fixedTax 155,000) | **15%** (fixedTax unchanged at 155,000) | 25% ("Above Rs.155K + 25% of rent > Rs.2M") — unchanged | Manual editing (single-field edit) | CONFLICTS WITH TAGCO |
| 233 | LIA threshold mechanism (annualCommissionTotal, LOW/HIGH split) | Present, 8/16 (<0.5M) vs 12/24 (≥0.5M) | **Deleted** — single LIFE_INSURANCE_AGENT subType, UI text restricts it to "<Rs 0.5M" with no high-tier path | TAGCO shows the same two effective rates (8/16 explicit LIA tier; 12/24 folded into "Others") | Partial category deletion | PARTIALLY MATCHES TAGCO (rate values survive; selection logic does not) |
| 236C | Entire FMV-band + Late-Filer structure | 9 rates, 3 FMV bands × 3 filer tiers | **Collapsed to flat 1%/2%** | TY2027 proposal scraps FMV-banding too, but replaces it with: same-year disposal 3% flat, other disposals 2.75%/5.5% | Unknown source (fabricated values) | CONFLICTS WITH TAGCO (right instinct, wrong numbers) |
| 236K | Entire FMV-band + Late-Filer structure | 9 rates, 3 FMV bands × 3 filer tiers | **Collapsed to flat 3%/6%** | TY2027 proposal scraps FMV-banding too, replaces with flat Normal Purchase 1.25%/2.5% | Unknown source (fabricated values) | CONFLICTS WITH TAGCO (right instinct, wrong numbers) |

**C. Historical Pattern Analysis** (the recurring shapes across all rows above):

1. **§149 only** resembles an *older Finance Act structure* — its breakpoints
   (600k/1.2M/2.4M/3.6M/6M) don't match fy2026 (current law) or TAGCO (proposed
   law); they match the salary-slab shape used before the FY2024-25 restructuring.
   This is the one row that is genuinely "historical data reused," not just edited.
2. **§151 BANK, §153a OTHER_GOODS, §153c STANDARD, §155 top bracket** all show
   the *same pattern*: fy2026's structure is fully preserved, but one or two numeric
   fields are lowered by a small, plausible-looking margin (20→15, 5→4, 7.5→7,
   25→15). None of these cuts appear in TAGCO. This is consistent with **manual
   editing / drafting error**, not a coherent alternate data source.
3. **§150 SPV/EXEMPT, §151 SUKUK, §152 (10 categories), §233 LIA-HIGH path**
   all show *category deletion* — not value changes, just rows removed. TAGCO
   confirms all of these should still exist for TY2027.
4. **§236C and §236K** are the interesting exception: fy2027 correctly anticipated
   that the FMV-band + Late-Filer structure would be scrapped for TY2027 (TAGCO
   confirms this is genuinely happening) — but invented different replacement
   numbers than TAGCO's actual proposed flat rates. Directionally right, factually
   wrong.

---

## 3. Objective E — Discrepancy classification (rollup)

| Classification | Count (approx., of ~20 discrepancy items above) | Representative items |
|---|---|---|
| VERIFIED AGAINST TAGCO | 0 of the *changed* items (separately: most `[PLACEHOLDER]` rows ARE verified — see §5) | — |
| LIKELY INTENTIONAL | 1 | §236C/§236K FMV-band removal (structural direction only, not the values) |
| LIKELY ACCIDENTAL | 6 | §151 BANK, §153a OTHER_GOODS, §153c STANDARD, §155 top bracket, §236C/§236K flat values |
| HISTORICAL DATA REUSED | 1 | §149 slab structure |
| PARTIAL IMPLEMENTATION | 3 | §152 (5 of 15 categories), §150 (4 of 6 categories), §151 NSSF (collapsed) |
| CATEGORY REGRESSION | 4 | §151 SUKUK, §149 Pension, §233 LIA-HIGH path, §150 SPV/EXEMPT |
| CANNOT DETERMINE | 2 | §154A (TAGCO table ambiguous), §153b SPECIFIED (predates fy2027, may already be wrong in fy2026) |

---

## 4. Objective D — Deep-dive narrative, the 12 named sections

**§149 Salary** — Highest risk in the file. Two independent problems, not one:
(1) the progressive slab table uses breakpoints and rates that match neither
current law (fy2026) nor TAGCO's proposed TY2027 table — it resembles a tax year
from before the FY2024-25 salary restructuring. (2) The entire Pension sub-feature
(subType `PENSION`/`CONTINUATION`, `pensionerAge` field, the §149(1A) 5%-above-Rs10M
logic) is missing from fy2027's transactionFields — not changed, deleted. TAGCO
confirms Pension treatment (5% on amounts >Rs10M for age <70) is still required for
TY2027. No ATL/Non-ATL differential issue here (§149 doesn't carry one in any
source). **No deleted Late Filer logic** (§149 never had one).

**§150 Dividends** — Three issues: BONUS_SHARES was correctly removed by fy2026
(with a comment explaining why — it belongs under §236M/236N) and then
re-added in fy2027 at the right *rate* (10/20) but still under the wrong
*section* — TAGCO confirms Bonus Shares is its own line item (§236Z) in TY2027,
not a §150 dividend subtype. SPV_REIT, SPV_OTHER, and EXEMPT_COMPANY were dropped
entirely — TAGCO confirms all three persist into TY2027. MUTUAL_FUND is a single
flat 25/50 in both fy2026 and fy2027, but TAGCO's TY2027 table actually splits
this further by debt-vs-equity fund and by recipient type (29/58 for companies in
debt funds, 25/50 for other debt-fund recipients, 15/30 for equity funds) — meaning
this gap predates fy2027 and isn't new to it. No ATL/Non-ATL handling error;
no Late Filer concept applies to §150.

**§151 Profit on Debt** — Bank rate cut from 20/40 to 15/30 with no TAGCO support
(TAGCO confirms 20/40 unchanged for company recipients). NSSF was restructured from
two taxpayer-type-specific rates (15/30 individual, 20/40 other) into one flat
10/20 pair that doesn't match any number visible in TAGCO's Government-Securities
table (15/20/30/40 are the only rates that appear there) — this looks fabricated.
Sukuk (all three tiers: company 25/50, individual >Rs1M 12.5/25, individual ≤Rs1M
10/20) is missing entirely from fy2027 despite being present in fy2026 and
explicitly confirmed unchanged by TAGCO's "Investments in Sukuks" section. No
ATL/Non-ATL *labeling* error — the differential exists in both files where the
category itself exists. Note: TAGCO's PDF table for §151 lost column alignment
during extraction, so the individual-vs-company split for the "other cases" /
"Government Securities" rows could not be confirmed with full certainty — flagged
as CANNOT FULLY DETERMINE for that specific sub-row, not for the section overall.

**§152 Payments to Non-Residents** — fy2027 keeps only 5 of fy2026's 15
sub-categories, all tagged `[PLACEHOLDER]`. Cross-checking the 5 survivors against
TAGCO: rates match (Royalty/FTS 15%, Construction 7%, Insurance 5%, Advertisement
10%, Offshore Digital 10%). The 10 deleted categories — PE sale of goods (Company
5/10, Other 5.5/11), PE services (IT/ITeS 4/8, Other 8/16), PE contracts
(Sportsperson 15/30, Other 8/16), SCRA capital gains (10%), and Sukuk-NR (25/12.5/10)
— are all independently confirmed present in TAGCO's TY2027 table. This is the
cleanest case of pure category regression in the file: no rate dispute, just
deletion. One nuance: TAGCO additionally splits Advertisement into two tiers
(relayed from outside Pakistan 10% vs. foreign-produced commercials 20%) that
neither fy2026 nor fy2027 models — a pre-existing gap, not a fy2027 regression.

**§153a Goods** — OTHER_GOODS (the only genuinely "live," non-placeholder rule
group in this section) was cut from 5/10 (Company) and 5.5/11 (Individual/AOP) to
4/8 and 4.5/9. TAGCO confirms the original rates are unchanged for TY2027. Every
other sub-category in this section (Toll Manufacturing, Distributor-Special, Yarn
Trader, Cigarettes, Pharma, Agri-Commodity, Textile-Sector, Gold/Silver) is tagged
`[PLACEHOLDER]`, numerically identical to fy2026, and **independently confirmed
correct by TAGCO** — Finance Bill 2026 made no changes here. No ATL/Non-ATL
handling defects in this section; no Late Filer tier applies to §153.

**§153b Services** — IT/ITeS (4/8) and Print/Electronic Media (1.5/3) match
TAGCO exactly. The "Other Services" rate (15/30) matches TAGCO's "Professionals"
line (doctors/lawyers/architects/accountants/software engineers, 15/30) — but
TAGCO's actual *residual* "Other services" bucket is 14/28, a distinct line item
neither file models; this naming/categorization gap predates fy2027. More
significant: SPECIFIED (the transport/freight/courier/hotel/security-guard/etc.
bucket) sits at 6/12 in both fy2026 and fy2027, while TAGCO's TY2027 table shows
7/14 for the equivalent bucket. Because this value is identical and unchanged
between fy2026 and fy2027 (i.e., fy2027 didn't touch it), this is **not a
fy2027-introduced error** — either it is a genuine proposed Finance Bill 2026
increase that fy2027 failed to pick up, or fy2026 itself already understated it.
Either way it needs FBR-card confirmation, not just a fy2027 patch. Terminal/Port
Services (12/24 in TAGCO) is missing from both files — pre-existing gap.

**§153c Contracts** — Sportsperson (15/30, tagged `[PLACEHOLDER]` in fy2027)
matches TAGCO. Standard Contract rates were cut: Company 7.5/15 → 7/14,
Individual/AOP 8/16 → 7.5/15. TAGCO confirms both original rates (7.5/15 for
Listed Companies, 8/16 for Individual/AOP) are unchanged for TY2027 — these cuts
have no external support. No deleted Late Filer logic (§153c carries no such
tier in any source); no ATL/Non-ATL labeling defect, only the rate values
themselves are wrong.

**§154A Export of Services** — The one case where the call is genuinely close.
fy2026 carries an explicit ATL/Non-ATL split for both PSEB IT/ITeS (0.25/0.5) and
Other Services (1/2). fy2027 flattens both to a single rate with `atlStatus: null`.
TAGCO's TY2027 table shows single rate figures (0.25%, 1%) with an "OR/Optional —
Advance Tax" annotation, and does not clearly display a doubled Non-Filer rate the
way every other section does. This is genuinely ambiguous from the extracted text
— it may mean TAGCO's table simply doesn't repeat the filer-status framing for
this section (most other export-incentive sections in the Ordinance are filer-status-
blind by design, since the policy goal is to incentivize FX repatriation regardless
of filer status), in which case fy2027's flattening would be **directionally
correct** rather than a regression. This needs the actual FBR card or the
Finance Bill 2026 text itself to resolve with confidence — flagged for manual
review, not classified as an error.

**§155 Rent** — Company flat rate (15/30) is unchanged and matches TAGCO. The
Individual/AOP slab table matches TAGCO exactly for the first three brackets
(0-300k:0%, 300k-600k:5%, 600k-2M: Rs15,000+10%) — only the top bracket's
*marginal rate* was changed, from 25% to 15%, while its fixedTax base (155,000,
which is mathematically derived from the 25% structure) was left untouched. TAGCO
explicitly confirms "Rs.155K + 25% of rent > Rs.2M" for TY2027 — unchanged. This
is the cleanest evidence in the whole file of a **single manual field edit**
rather than a different data source: every other number in the table is
internally consistent with the *old* 25% structure; only the rate label itself
was touched.

**§233 Brokerage & Commission** — All three rate values present in fy2027 (10/20
Advertising, 8/16 LIA, 12/24 Other) are individually correct against TAGCO. The
defect is structural, not numeric: fy2026's `annualCommissionTotal` field and
`visibleWhen`-driven LOW/HIGH switching (so a Life Insurance Agent earning ≥Rs0.5M/year
correctly routes to the 12/24 rate) has been deleted in fy2027. fy2027's
LIFE_INSURANCE_AGENT dropdown option text was also rewritten to explicitly say
"(commission under PKR 0.5 million/year)" — meaning there is now no path in the
UI for a high-commission life insurance agent to reach the correct 12/24 rate at
all unless the user happens to manually choose "Other" instead, which the field
labels don't suggest. The rate numbers all still exist somewhere in the rule set;
the selection logic that routes a user to the right one does not.

**§236C Property Sale** — fy2026's FMV-band (≤50M/50-100M/>100M) × filer-tier
(ATL/Late-Filer/Non-ATL) = 9-rate structure was collapsed in fy2027 to a flat
1%/2% ATL/Non-ATL pair, with the Late Filer tier removed. Cross-checking against
TAGCO is the most interesting result in this analysis: **TAGCO's TY2027 proposal
also abandons FMV-banding** — but replaces it with a *holding-period* test instead
(disposal in the same year acquired: flat 3%; other disposals: 2.75% ATL / 5.5%
Non-ATL), not fy2027's 1%/2%. So fy2027's instinct that the FMV-band structure
would be scrapped is correct and matches the real direction of Finance Bill 2026 —
but the specific replacement numbers it filled in (1%/2%) appear nowhere in TAGCO's
table. Late Filer tier removal is consistent with TAGCO (TAGCO's TY2027 table for
this section no longer shows a Late Filer row either).

**§236K Property Purchase** — Same pattern as §236C: fy2026's FMV-band ×
filer-tier = 9-rate structure collapsed to a flat 3%/6% pair. TAGCO's TY2027
table also scraps FMV-banding here, replacing it with a single flat "Normal
Purchase" rate of 1.25%/2.5%. Again, fy2027 correctly anticipated the structural
simplification but invented different numbers (3%/6%) than TAGCO's actual
proposed figures (1.25%/2.5%). Late Filer tier removal is consistent with TAGCO.

---

## 5. A note on the `[PLACEHOLDER]`-tagged majority of the file

This analysis has focused on the NEEDS VERIFICATION rows because that's what was
asked for, but it's worth stating plainly: most of the sections/rules that fy2027
already tags `[PLACEHOLDER]` (§148, most of §152, most of §153a special
categories, all of §153b, sportsperson in §153c, all of §6a, all of §154, all of
§156, all of §233's rate values) were checked against TAGCO wherever the category
exists there, and **they match**. Finance Bill 2026, per TAGCO, simply didn't
touch most of these. The placeholder tag is doing its job for these — it's the
*untagged* 45% of the file that carries essentially all of the risk identified
above.

---

## 6. Objective F — Final Decision Matrix

| Section | Risk | TAGCO Match % | Likely Origin | Recommended Action |
|---|---|---|---|---|
| 148 Imports | Low | ~90% (placeholder, confirmed) | FY2025-26 carry-forward | KEEP AS IS |
| 149 Salary | **Critical** | ~10% | Historical data reused + category deletion | REBUILD SECTION |
| 150 Dividends | High | ~40% | Manual editing + partial deletion | RESTORE FROM FY2026, then re-map Bonus Shares to a new §236Z stub |
| 151 Profit on Debt | High | ~25% | Manual editing + category deletion | RESTORE FROM FY2026, confirm NSSF/Bank rates against FBR card when issued |
| 152 Non-Residents | Medium-High | ~30% (placeholder coverage thin) | Partial category deletion | RESTORE FROM FY2026 (re-add the 10 deleted categories; placeholder tag is fine) |
| 153a Goods | Low-Medium | ~85% | Manual editing (OTHER_GOODS only) | UPDATE FROM TAGCO (revert OTHER_GOODS to 5/10, 5.5/11); rest KEEP AS IS |
| 153b Services | Medium | ~60% | FY2025-26 carry-forward (pre-existing gap, not fy2027-specific) | MANUAL REVIEW REQUIRED (confirm SPECIFIED 6/12 vs 7/14 against FBR/Finance Bill text directly) |
| 153c Contracts | Medium | ~33% | Manual editing | UPDATE FROM TAGCO (revert STANDARD rates to 7.5/15, 8/16) |
| 154A Export Services | Low-Medium | Uncertain | Possibly genuine TY2027 simplification | MANUAL REVIEW REQUIRED (resolve PDF table ambiguity before deciding) |
| 155 Rent | Medium | ~80% | Manual editing (single field) | UPDATE FROM TAGCO (revert top-bracket rate to 25%) |
| 233 Brokerage | Medium | ~60% (numbers right, logic broken) | Partial category deletion (mechanism, not rate) | RESTORE FROM FY2026 (re-add annualCommissionTotal + LOW/HIGH switching) |
| 236C Property Sale | **Critical** | ~10% (right instinct, wrong numbers) | Unknown source (fabricated) | REBUILD SECTION (adopt TAGCO's same-year-disposal vs. other-disposal test) |
| 236K Property Purchase | **Critical** | ~10% (right instinct, wrong numbers) | Unknown source (fabricated) | REBUILD SECTION (adopt TAGCO's flat 1.25%/2.5% Normal Purchase rate) |
| All other `[PLACEHOLDER]` sections (156, 154, 6a, parts of 152/153a/233) | Low | ~90%+ | FY2025-26 carry-forward, confirmed | KEEP AS IS |

---

## 7. Objective G — Final Recommendation

**1. Can fy2027.ts be trusted as a baseline?** No, not as-is. It is safe to trust
the portions explicitly tagged `[PLACEHOLDER]` (now cross-confirmed against TAGCO
as well as fy2026). It is not safe to trust the ~45% of the file that is untagged
and was silently edited — that portion has no consistent origin, several values
conflict with both the current law and the external rate card, and in two sections
(§236C, §236K) the values don't match *anything*, including each other's own
internal logic.

**2. What percentage of the file aligns with TAGCO?** Roughly **60-65% by rule
count** (because the placeholder-tagged majority of the file is confirmed
unchanged), but only **~35-40% of the specifically reviewed/deep-dived sections**
(§149-236K) align at the rate level once placeholders are excluded. The
two numbers diverge because the placeholder sections are large in rule-count but
the named deep-dive sections concentrate almost all of the actual risk.

**3. Which sections should be discarded and rebuilt?** §149 (Salary — wrong slab
shape entirely, Pension feature deleted), §236C and §236K (Property Sale/Purchase
— fabricated flat rates that match neither source, though the *structural*
direction away from FMV-banding is itself correct and worth keeping). §150, §151,
§152, and §233 don't need a rebuild — they need their deleted categories restored
from fy2026 (their underlying structure is sound; pieces were removed, not
corrupted). §153a, §153c, §155 need single-value reverts, not rebuilds.

**4. Patch fy2027.ts, or recreate it from fy2026.ts + TAGCO-confirmed changes?**
**Recreate, section by section, using fy2026.ts as the structural base.** The
file's problem isn't that it needs small patches scattered across otherwise-sound
logic — it's that whoever produced the untagged 45% was working from no single
consistent reference, and a string of one-off edits would just add another layer
of unverified deltas on top of the existing unverified deltas. The cleanest path
is: start from fy2026.ts's full structure (it's already FBR-validated and, per
this analysis, also matches TAGCO almost everywhere TAGCO's TY2027 proposal made
no change), keep every category fy2027 lost, and apply only the changes this
analysis found **independently confirmed by TAGCO** — most notably the §236C/§236K
restructuring away from FMV-banding (using TAGCO's actual replacement numbers, not
fy2027's), while leaving everything else exactly as fy2026 already has it until an
actual FBR-published TY2026-27 rate card (post-enactment, not bill-stage) becomes
available to confirm the remainder.

This recreate-from-fy2026-plus-confirmed-deltas approach, the resulting diff, and
which specific TAGCO-confirmed changes to apply are implementation decisions —
not made here. **No code, registry, test, or UI changes have been made.** This
document, together with `FY2027_RATE_REVIEW.md`, is offered as the basis for that
decision once reviewed and approved.
