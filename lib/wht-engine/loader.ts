import { WhtRateConfig, RATE_REGISTRY } from '../tax-rules';

/**
 * Returns the Pakistani fiscal year (Finance Act Year) corresponding to a given date.
 * Pakistan fiscal year runs from July 1 to June 30.
 * E.g., July 1, 2026 -> Finance Act 2026
 * E.g., June 30, 2026 -> Finance Act 2025
 */
export function getActiveFinanceActYear(date: Date = new Date()): number {
  const month = date.getMonth(); // 0-indexed: 0 = January, 6 = July
  return month >= 6 ? date.getFullYear() : date.getFullYear() - 1;
}

/**
 * Returns the Finance Act year the UI should default to.
 *
 * Resolution priority:
 *  1. The natural active year (derived from date) if it exists in the registry.
 *  2. The largest available year that does NOT exceed the active year — i.e. the
 *     most recently published config the user would already know about.
 *  3. The earliest available year — safety net when the active year predates all
 *     configs in the registry (e.g. the registry contains only future years).
 *
 * Returns null only when the registry is completely empty — callers must treat
 * null as "no data available" and surface an appropriate error.
 *
 * Accepts an optional registry and date so the function is fully testable without
 * side-effects against the global RATE_REGISTRY or the real system clock.
 */
export function getDefaultFinanceActYear(
  registry: Readonly<Record<number, unknown>> = RATE_REGISTRY,
  date: Date = new Date()
): number | null {
  const availableYears = Object.keys(registry).map(Number);
  if (availableYears.length === 0) return null;

  const activeYear = getActiveFinanceActYear(date);

  // 1. Active year is directly available — use it.
  if (registry[activeYear] !== undefined) return activeYear;

  // 2. Find the largest available year that does not exceed the active year.
  const pastYears = availableYears.filter((y) => y <= activeYear);
  if (pastYears.length > 0) return Math.max(...pastYears);

  // 3. Active year predates all configs — fall back to the earliest available year.
  return Math.min(...availableYears);
}

/**
 * Resolves the WhtRateConfig for a specific Finance Act year.
 */
export function getConfigByYear(year: number): WhtRateConfig {
  const config = RATE_REGISTRY[year];
  if (!config) {
    throw new Error(`Tax configuration not found for Finance Act Year ${year}`);
  }
  return config;
}

/**
 * Resolves the WhtRateConfig that covers a specific transaction date.
 */
export function getConfigByTransactionDate(date: Date): WhtRateConfig {
  const time = date.getTime();
  const configs = Object.values(RATE_REGISTRY);

  // Find configuration whose effective interval contains the transaction date
  const matchingConfig = configs.find((config) => {
    const start = new Date(config.effectiveFrom).getTime();
    const end = new Date(config.effectiveTo).getTime();
    return time >= start && time <= end;
  });

  if (!matchingConfig) {
    // Fallback: search by Pakistani fiscal year rule
    const year = getActiveFinanceActYear(date);
    const fallback = RATE_REGISTRY[year];
    if (fallback) {
      return fallback;
    }
    throw new Error(
      `No tax configuration covers transaction date ${date.toISOString().split('T')[0]} and no fallback year config exists.`
    );
  }

  return matchingConfig;
}
