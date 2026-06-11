import { Decimal } from 'decimal.js';

type Monetary = Decimal | number | string;

function toRoundedInt(value: Monetary): number {
  if (value instanceof Decimal) return value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return Math.round(n);
}

/**
 * Formats a monetary value as a comma-separated integer string.
 * Rounds half-up to the nearest whole number before formatting.
 *
 * Examples:
 *   500000   → "500,000"
 *   1200000  → "1,200,000"
 *   12500000 → "12,500,000"
 *   0        → "0"
 *   1200.75  → "1,201"
 */
export function formatNumber(value: Monetary): string {
  const n = toRoundedInt(value);
  // Use en-US grouping (comma thousands separator) — same result as en-PK for integers
  return n.toLocaleString('en-US');
}

/**
 * Formats a monetary value with the "PKR" prefix.
 *
 * Examples:
 *   500000  → "PKR 500,000"
 *   1200000 → "PKR 1,200,000"
 */
export function formatPkr(value: Monetary): string {
  return `PKR ${formatNumber(value)}`;
}
