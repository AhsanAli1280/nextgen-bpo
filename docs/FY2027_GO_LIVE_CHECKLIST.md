# FY2026-27 (Tax Year 2027) — Go-Live Readiness Checklist

> **STATUS: CONTROLLED RELEASE APPROVED FOR 2026-07-01.** Business context: the
> new fiscal year begins today and the official FBR TY2027 WHT Rate Card has
> still not been published. Per an explicit go-live decision on 2026-07-01, the
> release proceeds on the enacted Finance Act 2026 text (primary source) cross-
> checked against the Moore Shekha Mufti TY2027 WHT Chart (secondary source),
> per the authoritative source hierarchy: (1) Finance Act 2026, (2) FBR final
> card (unavailable), (3) Moore Shekha Mufti chart, (4) TAGCO (cross-check
> only). The P0 defect that cross-check surfaced (§236C/§236K Non-ATL rates)
> has been corrected — see HOTFIX-002 in `fy2027.ts`. Remaining open items are
> P1 and do not block release; they are tracked below for resolution once the
> FBR card is published.

## Readiness checklist

| # | Item | State | Evidence / note |
|---|---|---|---|
| 1 | Finance Act enacted | ☑ DONE | Act XLIII of 2026, President's assent 26 Jun 2026 (`Finance_Act_2026.md`) |
| 2 | FY2027 implementation completed | ☑ DONE | Batch 1 + Batch 2: 18 sections (16 carried/amended + §151B, §154B) |
| 3 | Full test suite passing | ☑ DONE | 33 test groups, `npm test` → ALL PASSED (incl. HOTFIX-002 §236C/§236K correction) |
| 4 | Typecheck passing | ☑ DONE | `npm run typecheck` (`tsc --noEmit`) clean |
| 5 | Documentation updated | ☑ DONE | Rate Review, Origin Analysis, Blueprint, Backlog, FA Implementation Report, Batch 1 & 2 Audits, Final Implementation Report, this checklist |
| 6 | Explanations validated | ☑ DONE | Batch 3 group G — section refs, rate/filer display, final/minimum/exemption narratives |
| 7 | FY2026 regression confirmed | ☑ DONE | All financeActYear:2025 legacy groups pass unchanged; cross-year isolation verified (group F); `fy2026.ts` git-clean |
| 8 | Hidden-year guard verified | ☑ DONE | HOTFIX-001 + Scenario A/B/C tests; `getDefaultVisibleTaxYear` clamps to `VISIBLE_TAX_YEARS` |
| 9 | **P0 pre-release reconciliation vs Moore TY2027 Chart** | ☑ DONE | §236C/§236K Non-ATL rates were wrongly assumed as a ×2 doubling of the new flat filer rate (5.5%/2.5%); corrected to the actual unchanged-from-FY2025-26 values (11.5% flat / 10.5-14.5-18.5% FMV-banded) per HOTFIX-002. No other P0-level discrepancies found against the Act text or the Moore chart. |
| 10 | FBR TY2027 card reconciled | ☐ **OPEN — P1, post-release** | FBR card still not published; accepted as a release risk per business decision on 2026-07-01 |
| 11 | Remaining P1 interpretation items resolved | ☐ **OPEN — P1, post-release** | Pension surcharge repeal (§149(1A)); §154 combined 2.25% display convention; §153b SPECIFIED 6/12 vs Moore's 7/14 — none rated high-risk enough to block release |
| 12 | Manual validation completed | ☐ OPEN — P1 | Hand-compute 5 random transactions/changed section vs FBR card once published |
| 13 | Registry updated (`VISIBLE_TAX_YEARS` += 2026) | ☑ **DONE** | `registry.ts`: `VISIBLE_TAX_YEARS = [2025, 2026]` |
| 14 | Deployment approved | ☐ OPEN | Awaiting explicit deployment/production-push approval from project owner |

## Post-release follow-up (P1, non-blocking)

1. When the FBR TY2027 WHT Rate Card is published, reconcile every FY2026-27
   rate line-by-line against it (#10); patch any divergence; re-run the full suite.
2. Resolve remaining interpretation items (#11) with tax counsel: pension
   surcharge repeal, §154 2.25% combined-display convention, §153b SPECIFIED.
3. Manual validation (#12): 5 hand-computed transactions per changed/new section
   (§149, §153b, §153c, §236C, §236K, §151B, §154B, §154, §152) vs the FBR card.
4. Re-review this checklist and close out any resulting patches with a new
   HOTFIX entry in `fy2027.ts`, following the same pattern as HOTFIX-001/002.

## Rollback guarantee (must remain true at all times)

- `fy2026.ts` is frozen and unmodified — reverting `VISIBLE_TAX_YEARS` to `[2025]`
  instantly restores TY2025-26-only behaviour with zero data migration.
- FY2026-27 logic is year-isolated (engine gates on `financeActYear` / config
  shape), so enabling or disabling it cannot affect FY2025-26 computations.

**Current gate result: engineering, validation, and the pre-release P0
reconciliation against the Moore Shekha Mufti TY2027 Chart are complete.
`VISIBLE_TAX_YEARS` has been updated to expose FY2026-27. Remaining items
(#10–#12) are P1, tracked for post-release resolution, and do not block
today's controlled release. Awaiting final deployment approval (#14).**
