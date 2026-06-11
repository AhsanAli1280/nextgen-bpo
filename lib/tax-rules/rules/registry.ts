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
  2026: deepFreeze(configFY2027), // Tax Year 2026-27 — [PLACEHOLDER], not FBR-validated
  2027: deepFreeze(configFY2028), // Tax Year 2027-28 — [PLACEHOLDER], not FBR-validated
});

// Tax years selectable in the production UI. FY2026-27 and FY2027-28 remain
// in RATE_REGISTRY for architecture/testing but are hidden from end users
// until validated against a future Finance Act and FBR rate card.
export const VISIBLE_TAX_YEARS: readonly number[] = Object.freeze([2025]);
