import { WhtRateConfig } from '../types';
import { configFY2026 } from './fy2026';
import { configFY2027 } from './fy2027';
import { configFY2028 } from './fy2028';

function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
}

export const RATE_REGISTRY: Readonly<Record<number, WhtRateConfig>> = Object.freeze({
  2025: deepFreeze(configFY2026), // Tax Year 2025-26 — FBR validated
  2026: deepFreeze(configFY2027), // Tax Year 2026-27 — Finance Act 2026 implemented; FBR-card reconciliation pending
  2027: deepFreeze(configFY2028), // Tax Year 2027-28 — [PLACEHOLDER], not FBR-validated
});

// Tax years selectable in the UI.
// CONTROLLED RELEASE (2026-07-01): FY2026-27 (2026) is enabled alongside
// FY2025-26 (2025). Every rate traces to the enacted Finance Act 2026 text
// (docs/Finance_Act_2026.md), cross-checked against the Moore Shekha Mufti
// TY2027 WHT Chart; the §236C/§236K Non-ATL P0 defect found during that
// cross-check has been corrected (see fy2027.ts HOTFIX-002). The official
// FBR TY2027 WHT Rate Card was not available at release time — a small set
// of P1 interpretation items (pension surcharge repeal, §154 combined-rate
// display convention, §153b SPECIFIED rate) remain flagged for post-release
// confirmation once the FBR card is published; see
// docs/FY2027_GO_LIVE_CHECKLIST.md. FY2027-28 (2027) remains hidden. To roll
// back to FY2025-26-only, set this back to Object.freeze([2025]).
export const VISIBLE_TAX_YEARS: readonly number[] = Object.freeze([2025, 2026]);
