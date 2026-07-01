# FY2026-27 Finance Act 2026 — Phase 1 Legal Analysis & Implementation Report

> **STATUS: PHASE 1 — ANALYSIS ONLY. NO SOURCE FILES MODIFIED.**
> Authoritative source: enacted **Finance Act, 2026 (Act No. XLIII of 2026)**,
> President's assent 26 June 2026, effective 1 July 2026 (`Finance_Act_2026.md`).
> Where the enacted Act conflicts with TAGCO, prior notes, or fy2027.ts, **the
> enacted Act prevails** (per instruction). fy2026.ts remains the production
> rollback baseline. TY2027 stays out of `VISIBLE_TAX_YEARS` until Phase 8.

---

## 0. Headline finding — the enacted law is simpler than TAGCO proposed

Several "structural changes" flagged in the Blueprint/Backlog from the **TAGCO
draft** did **not** survive into the enacted Act. This materially *reduces* the
work vs. the Blueprint's worst-case plan:

| Item TAGCO proposed | Enacted reality | Effect on plan |
|---|---|---|
| §236C holding-period test (3% / 2.75% / 5.5% split) | **Flat 2.75%** of consideration, single rate (Division X fully substituted) | No acquisition-date field, no holding-period engine logic needed. **Architecture work cancelled** for 236C. |
| §236K flat 1.25% + inheritance/gift/NR special cases in the rate table | **Flat 1.25%** of FMV, single rate (Division XVIII fully substituted) | Simple rate; special-case routing **not** in the rate Division. **Architecture work cancelled** for 236K. |
| §150 MUTUAL_FUND 3-way debt/equity split (29/58, 25/50, 15/30) | **No Division I (Part III) dividend amendment at all** | Mutual-fund split is **NOT law**. Do not implement. Carry §150 forward unchanged. |
| Bonus Shares relocated to a new §236Z | **No §236Z, no bonus-share amendment anywhere in the Act** | fy2027's reintroduction of BONUS_SHARES under §150 has **no legal support**. **Remove it.** |
| §149 Pension subType / Directorship-fee 20% line item | **No §149 pension/directorship amendment** (only the salary slab table changed) | Keep fy2026 pension behaviour as-is; do not add a directorship line. |

**Net:** the three "Phase 4 / architecture" items from the Backlog (236C, 236K,
mutual-fund split) collapse to **simple flat-rate definitions** or **no change at
all**. The real work is concentrated in §149 (salary slabs), §153 services
restructuring, and **two genuinely new sections** (§151B, §154B).

---

## 1. Amendment-by-amendment implementation report

All references are to the enacted Act's amendments to the **Income Tax Ordinance,
2001** (Act §5) and its First/Tenth Schedule changes.

### §149 — Salary (First Schedule, Part I, Division I, clause 2 — Table substituted)

- **Finance Act amendment**: New salary slab table:

  | Taxable income | Rate |
  |---|---|
  | ≤ 600,000 | 0% |
  | 600,001 – 1,200,000 | 1% of excess over 600,000 |
  | 1,200,001 – 2,200,000 | 6,000 + 11% of excess over 1,200,000 |
  | 2,200,001 – 3,200,000 | 116,000 + 20% of excess over 2,200,000 |
  | 3,200,001 – 4,100,000 | 316,000 + 25% of excess over 3,200,000 |
  | 4,100,001 – 5,600,000 | 541,000 + 29% of excess over 4,100,000 |
  | 5,600,001 – 7,000,000 | 976,000 + 32% of excess over 5,600,000 |
  | > 7,000,000 | 1,424,000 + 35% of excess over 7,000,000 |

  Also (Act §5(2), §4AB proviso): the **9% surcharge on income > Rs 10M is
  repealed** — "no surcharge shall be payable."
- **Existing FY2026 behaviour**: Different slabs (top-bracket structure with a 23%
  band) + 9% high-earner surcharge.
- **Required FY2027 behaviour**: Replace slab table with the 8 enacted brackets;
  remove the 9% surcharge logic.
- **Change type**: Rate change (slab values) **+ structural** (surcharge removal;
  `surchargeRate` field must stop being applied for §149).
- **Risk**: **HIGH.** Salary is the highest-volume section. fy2027.ts currently
  has a *fabricated* slab table (600k/1.2M/2.4M/3.6M/6M) that matches neither
  fy2026 nor the enacted Act — it must be fully replaced, not patched. The
  enacted table happens to match the TAGCO draft exactly, which is reassuring,
  but the binding source is the Act.

### §4AB — Surcharge (covered above)

- Repeal of the 9% surcharge on high earners. **Structural** — ensure no §149 (or
  other) rule applies `surchargeRate` for TY2027. Risk: MEDIUM (silent
  over-collection if missed).

### §151B (NEW) + §7G — Tax on life-insurance / takaful payouts (First Schedule, Part III, **Division IC** inserted)

- **Finance Act amendment**: New §151B requires every life insurer / takaful
  operator to deduct tax on payouts/surrender/maturity to an individual at:

  | Timing of payout | Rate |
  |---|---|
  | Within 1 year of policy issuance | 15% |
  | After 1 year but before 4 years | 10% |
  | After 4 years, or on death / disability | Exempt (no deduction) |

  Taxable base = gross payout − aggregate premiums paid. **Final tax** on that
  income. (§7G mirrors the charge.) Tenth Schedule rule 10 amended so §151B
  deduction from a **non-resident** is on the no-reduction list.
- **Existing FY2026 behaviour**: Section does not exist.
- **Required FY2027 behaviour**: New section with a timing-band selector and a
  "premiums paid" deduction input (base = payout − premiums).
- **Change type**: **New section** = new rule definitions + **new input fields**
  (payout amount, premiums paid, timing band) + engine support for the
  net-of-premiums base + UI + explanation + tests.
- **Risk**: MEDIUM-HIGH (net-of-premiums base is a new computation pattern not
  used elsewhere; the 4-year/death/disability exemption needs a clear UI path).

### §152(1DA) — Non-resident capital gains via FCVA/FCBVA/NRVA/NRBVA (First Schedule, Part III, Division II rate)

- **Finance Act amendment**: §152(1DA) substituted — banking companies deduct tax
  on capital gain on disposal of **debt instruments and Government securities
  (incl. Shariah-compliant)** invested through FCVA/FCBVA/NRVA/NRBVA at the
  Division II (Part III) rate.
- **Existing FY2026 behaviour**: §152 has a 15-subcategory structure; fy2027.ts
  kept only 5 (all `[PLACEHOLDER]`).
- **Required FY2027 behaviour**: Restore the full fy2026 §152 structure (the
  deletions in fy2027 have no legal basis), and ensure the 1DA capital-gains
  treatment is represented per the Division II rate.
- **Change type**: Restore deleted categories (no rate change to the surviving
  ones — no Division II rate change is listed in the Act, so the existing rate
  carries forward). Mostly **carry-forward / restore**.
- **Risk**: MEDIUM (regression risk from fy2027's deletions, not from the Act).

### §153 — Services (First Schedule, Part III, **Division III** amended)

- **Finance Act amendment** (Division III, paragraph 2):
  - (i) **6% → 7%** for the specified-services bucket; "asset management
    companies" replaced by "non-banking finance company" (clause 35B definition).
  - (ii) substituted: **15%** for independent professional services (doctors,
    lawyers, architects, accountants, software engineers/developers working
    independently).
  - (iii) NEW: **1.5%** of gross to electronic and print media for advertising.
  - (iv) NEW: **12%** to companies for terminal and port operating services.
  - (v) NEW: **14%** for services other than (i)–(iv).
- **Existing FY2026 behaviour**: SPECIFIED 6/12, OTHER_SERVICES 15/30, PRINT_MEDIA
  1.5/3, IT/ITeS 4/8.
- **Required FY2027 behaviour**: SPECIFIED → **7%** (ATL); split out professionals
  at 15%; add terminal/port at 12%; **generic "other services" → 14%** (not 15%).
  IT/ITeS (4/8) and print/electronic media (1.5/3) carry forward (the 1.5% is
  re-confirmed by (iii)).
- **Change type**: **Rate change + new categories** (terminal/port; professionals
  as a distinct line; relabel residual to 14%). Non-ATL = ATL × 2 via Tenth
  Schedule (rule 1 intact).
- **Risk**: MEDIUM-HIGH (this is a genuine restructure; the previous SPECIFIED 6/12
  carried forward in both fy2026 and fy2027 is now confirmed *wrong* for TY2027 —
  resolves the Workstream B "153B SPECIFIED" open item → **7%**).

### §153 — Sportspersons (First Schedule, Part III, **Division IIIAA**: 15% → 20%)

- **Finance Act amendment**: Division IIIAA rate **15% → 20%**.
- **Existing FY2026 / fy2027 behaviour**: 15% (30% non-ATL).
- **Required FY2027 behaviour**: **20%** (40% non-ATL).
- **Change type**: Rate change only.
- **Risk**: LOW (single value), but note fy2027 has this tagged `[PLACEHOLDER]` at
  15% — must be updated, not assumed correct.

### §154 / §154A — Exports & export of services (First Schedule, Part III, **Division IV**: 1% → 1.25%)

- **Finance Act amendment**: Division IV paragraph (1) and paragraph (3) **1% →
  1.25%**.
- **Existing FY2026 behaviour**: 1% (with the fy2026 ATL/Non-ATL split for §154A).
- **Required FY2027 behaviour**: **1.25%** for the affected paragraphs.
- **Change type**: Rate change. **Mapping caveat** — the exact paragraph-to-rule
  mapping in fy2026.ts (which rule(s) reference Division IV paragraphs 1 and 3)
  must be confirmed against the file before applying, so the 1.25% lands on the
  correct rules and the §154A `atlStatus` handling is set per the Act rather than
  silently nulled (resolves part of the Workstream B "154A" open item; the
  filer-status differential question still needs the FBR card — see §3).
- **Risk**: MEDIUM (mapping precision).

### §154B (NEW) — Social-media platform revenue (First Schedule, Part III, **Division IIIAB** inserted)

- **Finance Act amendment**: New §154B — banking/non-banking financial
  institutions deduct **5%** on amounts representing revenue received from social
  media platforms. **Minimum tax** for a resident; **final tax** for a
  non-resident without a PE. (§169 and Tenth Schedule consequentially amended.)
- **Existing FY2026 behaviour**: Does not exist.
- **Required FY2027 behaviour**: New section, flat 5%, with a resident /
  non-resident-no-PE selector driving minimum-vs-final treatment.
- **Change type**: **New section** = rules + input field (resident status) + UI +
  explanation + tests.
- **Risk**: MEDIUM.

### §236C — Sale of immovable property (First Schedule, Part IV, **Division X fully substituted**)

- **Finance Act amendment**: "The rate of tax to be collected under §236C shall be
  **2.75% of the gross amount of the consideration received**." The entire prior
  tiered Division X table (FMV bands × filer tiers) is **replaced** by this single
  flat rate. §236CA **omitted**.
- **Existing FY2026 behaviour**: 9-rate FMV-band × filer-tier matrix.
- **Required FY2027 behaviour**: **Flat 2.75%** (ATL). Non-ATL via Tenth Schedule
  rule 1 doubling (→ 5.5%) unless an exclusion applies.
- **Change type**: **Structural simplification** (remove FMV banding + per-tier
  table) — but *simpler*, not a complex rebuild. No new fields.
- **Risk**: MEDIUM — **the late-filer intermediate tier is no longer in the
  Division table.** Whether a late-filer rate survives for §236C must be confirmed
  against the Tenth Schedule / FBR card (see §3, legal-interpretation item).

### §236K — Purchase of immovable property (First Schedule, Part IV, **Division XVIII fully substituted**)

- **Finance Act amendment**: "The rate of tax to be collected under §236K shall be
  **1.25% of the fair market value**." Entire prior tiered table replaced.
- **Existing FY2026 behaviour**: 9-rate FMV-band × filer-tier matrix.
- **Required FY2027 behaviour**: **Flat 1.25%** (ATL); Non-ATL doubled (→ 2.5%)
  via Tenth Schedule unless excluded.
- **Change type**: Structural simplification. No new fields.
- **Risk**: MEDIUM (same late-filer-tier confirmation as §236C).

### Other First Schedule changes touching the calculator's domain

- **Division XXVII: 5% → 0.5%** — applies to a section the calculator may or may
  not model; **confirm which section Division XXVII maps to** before acting
  (likely §236 advance tax on a specific category). Flagged for mapping check.
- **Division XA omitted** and **Division VIIIC omitted** — confirm neither is
  referenced by a modelled section; if referenced, that section must be retired
  for TY2027.
- **Tenth Schedule**: rule 1A omitted; rule 10 gains §151B-non-resident
  exclusion; **the general 100% non-filer increase (rule 1) remains intact** —
  this is what drives every "Non-ATL = ATL × 2" rate, so the engine's existing
  doubling assumption stays valid.

---

## 2. Carry-forward vs change — codebase comparison

### Copy forward UNCHANGED from fy2026.ts (no Finance Act 2026 rate change found)

The Act's First Schedule Part III/IV amendments are an **exhaustive enumerated
list**; any division not listed is unchanged. Confirmed carry-forward:

- **§148 Imports** — no amendment.
- **§150 Dividends** — **no Division I (Part III) amendment.** Carry fy2026 forward
  in full. (⇒ no mutual-fund split; remove fy2027's unsupported BONUS_SHARES.)
- **§151 Profit on Debt** — **no Division IA amendment.** Carry fy2026 forward in
  full, **including Sukuk and both NSSF/Govt-Sec tiers** (fy2027's bank-rate cut
  to 15/30 and Sukuk deletion have no legal basis — discard them).
- **§233 Brokerage & Commission** — **no Division IIA amendment.** Carry fy2026
  forward, **restoring the LIA threshold-switching mechanism** fy2027 deleted.
- **§156 Prizes** — no amendment.
- **§153 Goods & Contracts (standard)** — **no operative §153 goods/contract rate
  amendment** (only Division III *services* and IIIAA *sportspersons* changed).
  Carry fy2026 goods/contract rates forward; **revert fy2027's unsupported cuts**
  (OTHER_GOODS 4/8→back to 5/10; §153c STANDARD 7/14→back to 7.5/15, etc.).
- **§6a Digital, §154 base export-proceeds rate** — carry forward except where
  Division IV's 1%→1.25% applies (see §154/154A above).

### Require RATE amendment
§149 (slabs), §153 services (Division III), §153 sportspersons (IIIAA 20%),
§154/154A (Division IV 1.25%), §236C (2.75%), §236K (1.25%), Division XXVII (0.5%,
pending mapping).

### Require ENGINE / DATA-MODEL change
§151B (net-of-premiums base + timing band — genuinely new computation), §154B
(resident/non-resident minimum-vs-final), §149 (surcharge removal). §236C/§236K
are **simplifications** (remove banding) — engine change is deletion of logic, not
new logic.

### Require NEW DATA-MODEL FIELDS
§151B (payout amount, premiums paid, timing band, death/disability exemption flag),
§154B (resident-status selector). **No new field for §236C/§236K** (flat rates).

### Require EXPLANATION updates
§149 (new slabs + no surcharge), §153 services (new tiers), §236C/§236K (flat-rate
language replacing FMV-band language), §151B, §154B (new).

### Require ADDITIONAL TEST COVERAGE
All of the above, plus full TY2027 (financeActYear: 2026) regression mirroring the
existing financeActYear: 2025 suite. (Current `wht.test.ts` has TY2027 only in 2
routing tests — no per-section rate coverage yet.)

---

## 3. Ambiguities flagged for HUMAN / LEGAL REVIEW (do not assume)

1. **§236C / §236K late-filer tier.** The enacted Divisions show a single flat
   ATL rate; non-filer doubling flows from Tenth Schedule rule 1. The prior
   *late-filer* intermediate tier is absent from the new Division text. **Does a
   late-filer rate still apply to §236C/§236K for TY2027?** Needs Tenth Schedule
   full read + FBR WHT card confirmation before deciding whether to drop the
   `LATE_FILER` tier for these sections. Conservative interim: model ATL + Non-ATL
   (×2) only, and flag late-filer as "pending."
2. **§154A filer-status differential.** Division IV gives a single 1.25% figure;
   it does not, on its face, state a separate Non-ATL rate for export services.
   **Confirm against the FBR card** whether export-of-services carries the Non-ATL
   doubling or is filer-status-blind (export-incentive policy). Do not silently
   null `atlStatus` without this confirmation.
3. **Division XXVII / XA / VIIIC section mapping.** Confirm which modelled
   calculator sections (if any) these correspond to before applying the 0.5% rate
   / retiring the omitted divisions.
4. **§154/§154A paragraph mapping.** Confirm exactly which fy2026 rules reference
   Division IV paragraphs (1) and (3) so the 1.25% lands correctly.
5. **§152 Division II rate value.** §152(1DA) points to "the Division II (Part III)
   rate"; the Act does not restate a new number in the read range — confirm the
   current Division II value carries forward unchanged.

**No rate has been inferred where the Act is silent.** Every "carry forward" above
rests on the Act's enumerated-amendment list not touching that division; every
"change" cites a specific enacted clause.

---

## 4. Revised recommendation & next phase

- **Option B (rebuild fy2027.ts from fy2026.ts baseline + enacted deltas) remains
  correct**, and is now *easier* than the Backlog assumed: the property-section
  and mutual-fund "architecture" work is cancelled (flat rates / no change), so
  the genuine engineering is concentrated in **§151B and §154B (two new sections)**
  plus the **§149 slab rebuild** and **§153 services restructure**.
- **Phase 2 (next)**: with this report approved, update rule definitions —
  rebuild §149, restructure §153 services, set §153-sportsperson 20%, set §236C
  2.75% / §236K 1.25% flat, apply Division IV 1.25%, and **carry §150/§151/§233/§156
  forward unchanged from fy2026** (discarding fy2027's unsupported edits). Hold
  §151B/§154B for Phase 3 (engine/field work). Hold all four §3 ambiguities for
  human confirmation before coding the affected lines.
- **Phases 4–8** proceed per the Blueprint Go-Live Checklist; `2026` is added to
  `VISIBLE_TAX_YEARS` only at Phase 8 after tests + manual validation + a
  line-by-line cross-check of every implemented rate against the enacted Act and
  the FBR WHT card.

**No code, registry, test, or UI file has been modified in Phase 1.** Awaiting
approval to begin Phase 2.
