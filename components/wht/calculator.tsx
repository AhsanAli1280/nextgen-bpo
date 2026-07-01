'use client';

import { useState, useMemo, useCallback, useTransition, useRef, useEffect } from 'react';
import { computeWht } from '@/lib/wht-engine/engine';
import { getConfigByYear, getDefaultVisibleTaxYear } from '@/lib/wht-engine/loader';
import { VISIBLE_TAX_YEARS } from '@/lib/tax-rules/rules/registry';
import { WhtResult, FieldDefinition } from '@/lib/tax-rules/types';
import { taxYearLabel } from '@/lib/utils/tax-year';
import { SectionSelector } from './section-selector';
import { TransactionCardGrid } from './transaction-card-grid';
import { SectionInputRenderer } from './section-input-renderer';
import { ResultPanel } from './result-panel';

// ─── CSS variables block ──────────────────────────────────────────────────────
// All design-system tokens are scoped to [data-wht-calculator] so this component
// is fully self-contained. The host site's :root is never touched.
// The --wht-font-inter variable is injected by next/font via the fontClass prop.
const WHT_CSS_VARS = `
[data-wht-calculator] {
  /* Brand */
  --color-brand:           #39B54A;
  --color-brand-dark:      #2E9B3E;
  --color-brand-light:     #EBF8EC;

  /* Neutrals */
  --color-white:           #FFFFFF;
  --color-surface:         #F9FAFB;
  --color-surface-mid:     #F3F4F6;
  --color-border:          #E5E7EB;
  --color-border-dark:     #D1D5DB;
  --color-text-primary:    #111827;
  --color-text-secondary:  #374151;
  --color-text-muted:      #6B7280;
  --color-text-subtle:     #9CA3AF;

  /* Dark / footer */
  --color-dark:            #111827;
  --color-dark-mid:        #1F2937;
  --color-dark-text:       #F9FAFB;
  --color-dark-muted:      #9CA3AF;

  /* Semantic */
  --color-error:           #DC2626;
  --color-success:         #39B54A;

  /* Typography — falls back to system stack if Inter is not loaded */
  --font-family: var(--wht-font-inter, 'Inter'), -apple-system, BlinkMacSystemFont,
                 'Segoe UI', Helvetica, Arial, sans-serif;

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:           0 1px 3px rgba(0,0,0,0.07);
  --shadow-md:           0 4px 12px rgba(0,0,0,0.10);
  --shadow-focus-green:  0 0 0 3px rgba(57,181,74,0.15);
  --shadow-focus-error:  0 0 0 3px rgba(220,38,38,0.12);

  /* Transitions */
  --ease-fast:     150ms ease;
  --ease-default:  200ms ease;
  --ease-moderate: 300ms ease;
  --ease-slow:     400ms ease-out;

  /* Isolation */
  box-sizing: border-box;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}

[data-wht-calculator] *, [data-wht-calculator] *::before, [data-wht-calculator] *::after {
  box-sizing: inherit;
}

/* Responsive two-column layout — scoped to this calculator */
@media (min-width: 1024px) {
  [data-wht-calculator] .wht-layout {
    grid-template-columns: 420px minmax(0, 1fr) !important;
    align-items: start;
  }
}

/* Transaction type card grid — mobile 1-2 col, tablet 3, desktop 4-5 */
[data-wht-calculator] .wht-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
@media (min-width: 380px) {
  [data-wht-calculator] .wht-card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  [data-wht-calculator] .wht-card-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1024px) {
  [data-wht-calculator] .wht-card-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (min-width: 1280px) {
  [data-wht-calculator] .wht-card-grid { grid-template-columns: repeat(5, 1fr); }
}

/* Hero — gradient background with subtle dot pattern */
[data-wht-calculator] .wht-hero {
  position: relative;
  background: linear-gradient(135deg, #0B1220 0%, #111827 55%, #16243F 100%);
  overflow: hidden;
}
[data-wht-calculator] .wht-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
  background-size: 28px 28px;
  pointer-events: none;
}
[data-wht-calculator] .wht-hero::after {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(57,181,74,0.14) 0%, transparent 65%);
  pointer-events: none;
}
[data-wht-calculator] .wht-hero-inner {
  position: relative;
  z-index: 1;
}
[data-wht-calculator] .wht-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 1024px) {
  [data-wht-calculator] .wht-hero-grid {
    grid-template-columns: 1.4fr 1fr;
    align-items: center;
    gap: 48px;
  }
}

/* Trust badge cards — replace the old single-line status bar */
[data-wht-calculator] .wht-trust-badges {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 28px;
}
@media (min-width: 640px) {
  [data-wht-calculator] .wht-trust-badges {
    grid-template-columns: repeat(3, 1fr);
  }
}
[data-wht-calculator] .wht-trust-badge {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
[data-wht-calculator] .wht-trust-badge__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: rgba(57,181,74,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand);
}

/* Tax Year selector card — glass panel on the right of the hero */
[data-wht-calculator] .wht-year-card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
}

[data-wht-calculator] .wht-tx-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 14px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  font-family: var(--font-family);
  transition: border-color var(--ease-fast), box-shadow var(--ease-fast),
              transform var(--ease-fast), background var(--ease-fast);
}
[data-wht-calculator] .wht-tx-card:hover,
[data-wht-calculator] .wht-tx-card:focus-visible {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  z-index: 30;
}
[data-wht-calculator] .wht-tx-card:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}
[data-wht-calculator] .wht-tx-card[data-selected='true'] {
  border-color: var(--color-brand);
  background: var(--color-brand-light);
  box-shadow: var(--shadow-focus-green);
}
[data-wht-calculator] .wht-tx-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--color-surface-mid);
  color: var(--color-text-secondary);
  transition: background var(--ease-fast), color var(--ease-fast);
}
[data-wht-calculator] .wht-tx-card:hover .wht-tx-card-icon,
[data-wht-calculator] .wht-tx-card[data-selected='true'] .wht-tx-card-icon {
  background: rgba(57,181,74,0.12);
  color: var(--color-brand-dark);
}
[data-wht-calculator] .wht-tx-card-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
[data-wht-calculator] .wht-tx-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.25;
}
[data-wht-calculator] .wht-tx-card-ref {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-brand-dark);
}

/* Description tooltip — hidden by default, shown on hover/focus */
[data-wht-calculator] .wht-tx-card-tooltip {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  padding: 8px 10px;
  background: var(--color-dark);
  color: var(--color-dark-text);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.45;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity var(--ease-fast), transform var(--ease-fast);
  pointer-events: none;
}
[data-wht-calculator] .wht-tx-card:hover .wht-tx-card-tooltip,
[data-wht-calculator] .wht-tx-card:focus-visible .wht-tx-card-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Advanced mode disclosure (section-number selector) */
[data-wht-calculator] details.wht-advanced > summary {
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 4px 0;
  user-select: none;
}
[data-wht-calculator] details.wht-advanced > summary::-webkit-details-marker {
  display: none;
}
[data-wht-calculator] details.wht-advanced > summary .wht-chevron {
  transition: transform var(--ease-fast);
  color: var(--color-text-muted);
}
[data-wht-calculator] details.wht-advanced[open] > summary .wht-chevron {
  transform: rotate(180deg);
}
[data-wht-calculator] details.wht-advanced > .wht-advanced-body {
  margin-top: 12px;
}

/* Numbered step chip — consistent across all stage headers */
[data-wht-calculator] .wht-step-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-brand-dark);
  margin-bottom: 6px;
}
[data-wht-calculator] .wht-step-chip__num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-brand);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0;
}

/* Tabular numerals — finance-grade number alignment */
[data-wht-calculator] .wht-num {
  font-variant-numeric: tabular-nums;
}

/* Remove number input spinners within the calculator */
[data-wht-calculator] input[type=number]::-webkit-inner-spin-button,
[data-wht-calculator] input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
[data-wht-calculator] input[type=number] {
  -moz-appearance: textfield;
}

/* Print: hide action buttons */
@media print {
  [data-wht-calculator] .wht-no-print { display: none !important; }
}

@keyframes wht-spin { to { transform: rotate(360deg); } }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldValues = Record<string, unknown>;
type FieldErrors = Record<string, string>;

// ─── Validation ───────────────────────────────────────────────────────────────

// Strip trailing annotations like "(PKR)" or "(fixed)" from field labels so
// validation messages read naturally: "Payment Amount is required." not
// "Payment Amount (PKR) is required."
function cleanLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function isFieldVisible(field: FieldDefinition, values: FieldValues): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.field] === field.visibleWhen.equals;
}

function validateFields(fields: FieldDefinition[], values: FieldValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of fields) {
    if (field.lockedValue) continue;
    if (!isFieldVisible(field, values)) continue;

    const val = values[field.key];
    const isEmpty = val === undefined || val === null || val === '';

    // Cover both required=true and blocksSubmitIfEmpty=true (e.g. frequency_select)
    if ((field.required || field.blocksSubmitIfEmpty) && isEmpty) {
      const label = cleanLabel(field.label);
      if (field.type === 'radio' || field.type === 'select' || field.type === 'frequency_select') {
        errors[field.key] = `Please select ${label}.`;
      } else {
        errors[field.key] = `${label} is required.`;
      }
      continue;
    }

    if (field.type === 'number' && !isEmpty) {
      const n = Number(val);
      if (isNaN(n) || n <= 0) {
        errors[field.key] = 'Please enter a valid positive amount.';
      }
    }
  }
  return errors;
}

function isFormReady(fields: FieldDefinition[], values: FieldValues): boolean {
  for (const field of fields) {
    if (field.lockedValue) continue;
    if (!isFieldVisible(field, values)) continue;
    const val = values[field.key];
    const isEmpty = val === undefined || val === null || val === '';
    if ((field.required || field.blocksSubmitIfEmpty) && isEmpty) return false;
    if (field.type === 'number' && !isEmpty && (isNaN(Number(val)) || Number(val) <= 0)) return false;
  }
  return true;
}

// ─── Finance Act Year Selector ───────────────────────────────────────────────

function YearSelector({ value, onChange }: { value: number; onChange: (y: number) => void }) {
  const years = VISIBLE_TAX_YEARS.slice().sort((a, b) => b - a);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 36px 12px 14px',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--color-dark-text)',
          fontFamily: 'var(--font-family)',
          appearance: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label="Select Tax Year"
      >
        {years.map((y) => (
          <option key={y} value={y} style={{ background: '#1F2937', color: '#F9FAFB' }}>
            {taxYearLabel(y)}
          </option>
        ))}
      </select>
      <svg
        style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
          color: 'rgba(255,255,255,0.6)',
        }}
        width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Hero Trust Badges ────────────────────────────────────────────────────────

// Static metadata for the hero trust-badge cards.
// Add entries here to extend the row without touching layout.
const TRUST_BADGES: ReadonlyArray<{ title: string; description: string; icon: 'shield' | 'check' | 'badge' }> = [
  { title: 'Finance Act 2026 Compliant', description: 'Built on the latest enacted withholding tax law', icon: 'shield' },
  { title: 'Tax Year 2026-27 Release', description: 'Updated for the current tax year under Finance Act 2026', icon: 'check' },
  { title: 'FY2026-27 Rates Verified', description: 'Cross-checked against Finance Act 2026 and published rate sources', icon: 'badge' },
];

function TrustBadgeIcon({ icon }: { icon: 'shield' | 'check' | 'badge' }) {
  if (icon === 'shield') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5l5 1.8v3.4c0 3.2-2.1 5.9-5 6.8-2.9-.9-5-3.6-5-6.8V3.3l5-1.8z"
          stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M5.5 8l1.8 1.8L10.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === 'check') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.25 8.25l1.75 1.75L10.75 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5l1.6 3.2 3.6.5-2.6 2.5.6 3.6L8 9.6l-3.2 1.7.6-3.6L2.8 5.2l3.6-.5L8 1.5z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function TrustBadges() {
  return (
    <div className="wht-trust-badges">
      {TRUST_BADGES.map((badge) => (
        <div key={badge.title} className="wht-trust-badge">
          <span className="wht-trust-badge__icon">
            <TrustBadgeIcon icon={badge.icon} />
          </span>
          <span>
            <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-dark-text)' }}>
              {badge.title}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-dark-muted)', marginTop: '2px', lineHeight: 1.4 }}>
              {badge.description}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ animation: 'wht-spin 0.7s linear infinite', flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── WhtCalculator ────────────────────────────────────────────────────────────

interface WhtCalculatorProps {
  /** CSS variable class injected by next/font — e.g. inter.variable from the page.
   *  Optional: if the host site already loads Inter globally, omit this prop. */
  fontClass?: string;
}

export function WhtCalculator({ fontClass }: WhtCalculatorProps) {
  // HOTFIX-001: the initial active year is resolved over VISIBLE_TAX_YEARS only,
  // never the full RATE_REGISTRY. If the date-derived natural Finance Act year is
  // not visible (e.g. a not-yet-enabled future year), this falls back to the
  // latest visible year — so a hidden config can never become the default, be
  // computed, or be rendered. Returns null only when there are no visible years.
  const defaultYear = getDefaultVisibleTaxYear(VISIBLE_TAX_YEARS);
  const [activeYear, setActiveYear] = useState<number>(defaultYear ?? 0);
  const [sectionCode, setSectionCode] = useState<string>('');
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<WhtResult | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  // Per-field blur tracking: once a field appears in this set it is "touched"
  // and its validation error (if any) will be shown even before Calculate is clicked.
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Ref attached to the result panel container. Used to scroll it into view after
  // a successful calculation. On mobile the layout is single-column (form above,
  // result below), so the result is below the fold when Calculate is clicked.
  // On desktop the two-column side-by-side layout already keeps the result visible,
  // so scrollIntoView with block:'start' is effectively a no-op there.
  const resultPanelRef = useRef<HTMLDivElement>(null);

  // Ref attached to the "Transaction Details" form card. Selecting a card from
  // the transaction-type grid scrolls this into view, since on mobile the form
  // (and its now-revealed fields) sits below the card grid, off-screen.
  const formCardRef = useRef<HTMLDivElement>(null);

  // Scroll the result panel into view whenever result transitions to non-null.
  // This fires only on a successful calculation:
  //   - validation failure  → result stays null  → effect does not scroll
  //   - reset / year change → result set to null  → effect does not scroll
  //   - initial page load   → result starts null  → effect does not scroll
  //   - successful calc     → result set to WhtResult → effect scrolls
  useEffect(() => {
    if (result !== null) {
      resultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);


  const config = useMemo(() => {
    try { return getConfigByYear(activeYear); } catch { return null; }
  }, [activeYear]);

  const section = useMemo(
    () => config?.sections.find((s) => s.code === sectionCode) ?? null,
    [config, sectionCode]
  );

  const fields = useMemo<FieldDefinition[]>(
    () => (section ? (section.transactionFields as FieldDefinition[]) : []),
    [section]
  );

  const seedLockedValues = useCallback((newFields: FieldDefinition[]): FieldValues => {
    const seeds: FieldValues = {};
    for (const f of newFields) { if (f.lockedValue) seeds[f.key] = f.lockedValue; }
    return seeds;
  }, []);

  const handleSectionChange = useCallback((code: string) => {
    setSectionCode(code);
    setResult(null);
    setEngineError(null);
    setSubmitted(false);
    setTouchedFields(new Set());
    setFieldErrors({});
    const newSection = config?.sections.find((s) => s.code === code);
    setFieldValues(newSection ? seedLockedValues(newSection.transactionFields as FieldDefinition[]) : {});
  }, [config, seedLockedValues]);

  // Card-grid selection: same as handleSectionChange, plus scroll the form card
  // into view (the card grid sits above the form, so on mobile it's off-screen).
  const handleCardSelect = useCallback((code: string) => {
    handleSectionChange(code);
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [handleSectionChange]);

  const handleYearChange = useCallback((year: number) => {
    setActiveYear(year);
    setSectionCode('');
    setFieldValues({});
    setFieldErrors({});
    setTouchedFields(new Set());
    setResult(null);
    setEngineError(null);
    setSubmitted(false);
  }, []);

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // Called when any field loses focus. Marks the field as touched and re-runs
  // full validation so the error for that field (and any already-visible errors)
  // stays current. Errors are only rendered for touched fields, so untouched
  // sibling fields remain silent until Calculate is clicked.
  const handleFieldBlur = useCallback((key: string) => {
    setTouchedFields((prev) => new Set([...prev, key]));
    setFieldErrors(validateFields(fields, fieldValues));
  }, [fields, fieldValues]);

  const formReady = useMemo(
    () => sectionCode !== '' && isFormReady(fields, fieldValues),
    [sectionCode, fields, fieldValues]
  );

  const handleCalculate = () => {
    setSubmitted(true);
    const errors = validateFields(fields, fieldValues);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setEngineError(null);
    startTransition(() => {
      try {
        setResult(computeWht({ sectionCode, financeActYear: activeYear, sectionSpecific: fieldValues }));
      } catch (err) {
        setEngineError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        setResult(null);
      }
    });
  };

  // Handles clicks on the Calculate button regardless of whether the form is ready.
  // If the form has missing fields, marks every non-locked field as touched so all
  // pending inline errors become visible at once — answering "why is the button
  // disabled?" without requiring users to tab through each field individually.
  // If the form is ready, delegates to handleCalculate for the actual computation.
  const handleSubmitAttempt = () => {
    if (isPending) return;
    if (!formReady) {
      const allKeys = fields.filter((f) => !f.lockedValue).map((f) => f.key);
      const errs = validateFields(fields, fieldValues);
      setTouchedFields(new Set(allKeys));
      setFieldErrors(errs);
      return;
    }
    handleCalculate();
  };

  const handleReset = useCallback(() => {
    setSectionCode('');
    setFieldValues({});
    setFieldErrors({});
    setTouchedFields(new Set());
    setResult(null);
    setEngineError(null);
    setSubmitted(false);
  }, []);

  const handleClearResult = useCallback(() => {
    setResult(null);
    setEngineError(null);
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    // data-wht-calculator: scoping root for all CSS variables and selectors.
    // fontClass: the CSS variable class from next/font/google, applied here so
    // --wht-font-inter resolves to the loaded Inter face.
    <div data-wht-calculator="" className={fontClass ?? ''}>

      {/* Scoped styles injected once per mount — no global pollution */}
      <style dangerouslySetInnerHTML={{ __html: WHT_CSS_VARS }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="wht-hero" style={{ padding: '64px 24px 56px' }}>
        <div className="wht-hero-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="wht-hero-grid">
            {/* Left: title, value proposition, trust badges */}
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--color-brand)', marginBottom: '14px',
              }}>
                Accounting &amp; Tax Tools
              </p>
              <h1 style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', fontWeight: 800,
                color: 'var(--color-dark-text)', letterSpacing: '-0.02em',
                lineHeight: 1.15, marginBottom: '16px',
              }}>
                Pakistan Withholding Tax Calculator
              </h1>
              <p style={{
                fontSize: '1.0625rem', color: 'var(--color-dark-muted)',
                lineHeight: 1.65, maxWidth: '560px',
              }}>
                Eliminate manual rate-card lookups. Calculate Pakistan withholding
                taxes instantly using Finance Act 2026 rates for Tax Year 2026-27
                with complete calculation transparency.
              </p>

              <TrustBadges />
            </div>

            {/* Right: Tax Year selector card */}
            <div className="wht-year-card">
              <p style={{
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--color-dark-muted)', marginBottom: '10px',
              }}>
                Tax Year
              </p>
              <YearSelector value={activeYear} onChange={handleYearChange} />
              <p style={{
                fontSize: '0.8125rem', color: 'var(--color-dark-muted)',
                lineHeight: 1.6, marginTop: '14px',
              }}>
                All calculations use the latest Finance Act 2026 withholding tax rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 64px' }}>
        {defaultYear === null ? (
          // Registry is completely empty — no Finance Act data is loaded at all.
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <p style={{ color: 'var(--color-error)', fontWeight: 500 }}>
              No Finance Act rate data is available. Please contact the administrator.
            </p>
          </div>
        ) : !config ? (
          // A specific selected year has no config (should not normally occur because
          // YearSelector only lists years present in the registry).
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <p style={{ color: 'var(--color-error)', fontWeight: 500 }}>
              No tax configuration found for Tax Year {taxYearLabel(activeYear)}. Please select another year above.
            </p>
          </div>
        ) : (
          <>
            {/* ── Transaction type selector ────────────────────────────── */}
            <div style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '24px',
              marginBottom: '24px',
            }}>
              <p className="wht-step-chip">
                <span className="wht-step-chip__num">1</span>
                Transaction Type
              </p>
              <h2 style={{
                fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-primary)',
                marginBottom: '16px',
              }}>
                What kind of transaction is this?
              </h2>
              <TransactionCardGrid
                sections={config.sections as any}
                value={sectionCode}
                onChange={handleCardSelect}
              />
            </div>

          <div
            className="wht-layout"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '24px' }}
          >
            {/* ── Left: Transaction Form ─────────────────────────────────── */}
            <div ref={formCardRef} style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}>
              {/* Form header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}>
                <p className="wht-step-chip">
                  <span className="wht-step-chip__num">2</span>
                  Transaction Details
                </p>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Enter transaction information
                </h2>
              </div>

              {/* Form body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <details className="wht-advanced">
                  <summary>
                    <svg className="wht-chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Advanced Mode — Select by Section Number
                  </summary>
                  <div className="wht-advanced-body">
                    <SectionSelector
                      sections={config.sections as any}
                      value={sectionCode}
                      onChange={handleSectionChange}
                    />
                  </div>
                </details>

                {section && (
                  <>
                    <div style={{
                      height: '1px', background: 'var(--color-border)',
                      margin: '0 -24px', width: 'calc(100% + 48px)',
                    }} />
                    {fields
                      .filter((field) => {
                        if (!field.visibleWhen) return true;
                        return fieldValues[field.visibleWhen.field] === field.visibleWhen.equals;
                      })
                      .map((field) => (
                        <SectionInputRenderer
                          key={field.key}
                          field={field}
                          value={fieldValues[field.key]}
                          onChange={handleFieldChange}
                          onBlur={handleFieldBlur}
                          error={(submitted || touchedFields.has(field.key))
                            ? fieldErrors[field.key]
                            : undefined}
                        />
                      ))}
                  </>
                )}

                {!sectionCode && (
                  <p style={{
                    fontSize: '0.875rem', color: 'var(--color-text-muted)',
                    fontStyle: 'italic', textAlign: 'center', padding: '12px 0',
                  }}>
                    Select a transaction type above to see the required fields.
                  </p>
                )}

                {engineError && (
                  <div style={{
                    padding: '12px 16px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-error)', lineHeight: 1.5 }}>
                      <strong>Error:</strong> {engineError}
                    </p>
                  </div>
                )}
              </div>

              {/* Form actions */}
              <div className="wht-no-print" style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex', gap: '10px', alignItems: 'center',
              }}>
                <button
                  onClick={handleSubmitAttempt}
                  disabled={isPending}
                  style={{
                    flex: 1,
                    display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    padding: '13px 28px',
                    borderRadius: 'var(--radius-md)', border: 'none',
                    background: formReady && !isPending ? 'var(--color-brand)' : 'var(--color-text-subtle)',
                    color: '#ffffff', fontSize: '1rem', fontWeight: 600,
                    fontFamily: 'var(--font-family)',
                    cursor: formReady && !isPending ? 'pointer' : 'not-allowed',
                    transition: 'background var(--ease-fast), box-shadow var(--ease-fast)',
                    boxShadow: formReady && !isPending ? '0 4px 14px rgba(57,181,74,0.35)' : 'none',
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) => {
                    if (formReady && !isPending) e.currentTarget.style.background = 'var(--color-brand-dark)';
                  }}
                  onMouseLeave={(e) => {
                    if (formReady && !isPending) e.currentTarget.style.background = 'var(--color-brand)';
                  }}
                >
                  {isPending ? (
                    <><Spinner /> Calculating…</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Calculate WHT
                    </>
                  )}
                </button>

                {(sectionCode || result) && (
                  <button
                    onClick={handleReset}
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      justifyContent: 'center', gap: '6px',
                      padding: '13px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--color-border)',
                      background: 'transparent',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.9375rem', fontWeight: 600,
                      fontFamily: 'var(--font-family)', cursor: 'pointer',
                      transition: 'border-color var(--ease-fast), color var(--ease-fast)',
                      minHeight: '44px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-dark)';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }}
                    aria-label="Reset form"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1.5 7A5.5 5.5 0 107 1.5a5.47 5.47 0 00-3.5 1.27M1.5 3v2.5H4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>

              {sectionCode && !formReady && (
                <div style={{ padding: '12px 24px', borderTop: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', lineHeight: 1.5 }}>
                    Complete all required fields to enable calculation.
                  </p>
                </div>
              )}
            </div>

            {/* ── Right: Result Panel ────────────────────────────────────── */}
            {/* resultPanelRef: scroll target after successful calculation */}
            <div ref={resultPanelRef}>
              <ResultPanel result={result} onClear={handleClearResult} />
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
