/**
 * Converts a Finance Act year integer to the standard Pakistani tax year label.
 *
 * In Pakistan the fiscal year runs 1 July to 30 June. The Finance Act passed in
 * (approximately) June of year Y governs the period July Y → June Y+1, universally
 * referred to in business, FBR documentation, and professional practice as
 * "Tax Year Y-(Y+1 last two digits)".
 *
 * This is the single source-of-truth formatter used everywhere a year is shown to
 * the user. Do NOT format years inline; always call taxYearLabel().
 *
 * Examples:
 *   taxYearLabel(2025) → "2025-26"
 *   taxYearLabel(2026) → "2026-27"
 *   taxYearLabel(2027) → "2027-28"
 */
export function taxYearLabel(financeActYear: number): string {
  const next = financeActYear + 1;
  return `${financeActYear}-${String(next).slice(2)}`;
}
