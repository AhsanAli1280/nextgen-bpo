'use client';

import { useState, useEffect } from 'react';
import { FieldDefinition } from '@/lib/tax-rules/types';
import { formatNumber } from '@/lib/utils/currency';

const FREQUENCY_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'SEMI_ANNUAL', label: 'Semi-Annual' },
  { value: 'ANNUALLY', label: 'Annually' },
];

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-white)',
  border: '1px solid var(--color-border-dark)',
  borderRadius: 'var(--radius-md)',
  padding: '10px 14px',
  fontSize: '0.9375rem',
  fontWeight: 400,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family)',
  transition: 'border-color var(--ease-fast), box-shadow var(--ease-fast)',
  outline: 'none',
  minHeight: '44px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  marginBottom: '6px',
};

function focusStyle(el: HTMLElement) {
  el.style.borderColor = 'var(--color-brand)';
  el.style.boxShadow = 'var(--shadow-focus-green)';
}

function blurStyle(el: HTMLElement, hasError: boolean) {
  el.style.borderColor = hasError ? 'var(--color-error)' : 'var(--color-border-dark)';
  el.style.boxShadow = hasError ? 'var(--shadow-focus-error)' : 'none';
}

// ─── AmountField ─────────────────────────────────────────────────────────────
// Uses type="text" with inputMode="numeric" so we can display comma-formatted
// values when the field is not focused. While focused, raw digits are shown so
// the user can edit without fighting cursor-jump artefacts. Commas are stripped
// before parsing; the numeric value propagated to the parent is never formatted.

function AmountField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: {
  field: FieldDefinition;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onBlur?: () => void;
  error?: string;
}) {
  // rawText tracks what the user is typing (no commas).
  // We derive the display value from it: formatted when blurred, raw when focused.
  const [rawText, setRawText] = useState<string>(value != null ? String(value) : '');
  const [focused, setFocused] = useState(false);

  // When the parent resets the field (value → undefined), clear the display.
  useEffect(() => {
    if (value == null) setRawText('');
  }, [value]);

  const displayValue = focused
    ? rawText
    : rawText === '' ? '' : formatNumber(parseFloat(rawText));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={field.key} style={labelStyle}>
        {field.label}
        {field.required && <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        id={field.key}
        type="text"
        inputMode="numeric"
        placeholder={field.placeholder ?? 'Enter amount (PKR)'}
        value={displayValue}
        onChange={(e) => {
          // Strip commas and any non-numeric chars (preserve single decimal point)
          const stripped = e.target.value.replace(/,/g, '').replace(/[^\d.]/g, '');
          setRawText(stripped);
          const parsed = parseFloat(stripped);
          onChange(stripped === '' ? undefined : isNaN(parsed) ? undefined : parsed);
        }}
        style={{
          ...inputBase,
          borderColor: error ? 'var(--color-error)' : 'var(--color-border-dark)',
          boxShadow: error ? 'var(--shadow-focus-error)' : 'none',
        }}
        onFocus={(e) => {
          setFocused(true);
          focusStyle(e.currentTarget);
        }}
        onBlur={(e) => {
          setFocused(false);
          blurStyle(e.currentTarget, !!error);
          onBlur?.();
        }}
        aria-required={field.required}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.key}-error` : field.helperText ? `${field.key}-hint` : undefined}
      />
      {field.helperText && !error && (
        <span id={`${field.key}-hint`} style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {field.helperText}
        </span>
      )}
      {error && (
        <span id={`${field.key}-error`} role="alert" style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────

function SelectField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: {
  field: FieldDefinition;
  value: string | undefined;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={field.key} style={labelStyle}>
        {field.label}
        {field.required && <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          id={field.key}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...inputBase,
            appearance: 'none',
            paddingRight: '36px',
            cursor: 'pointer',
            borderColor: error ? 'var(--color-error)' : 'var(--color-border-dark)',
            boxShadow: error ? 'var(--shadow-focus-error)' : 'none',
            color: value ? 'var(--color-text-primary)' : 'var(--color-text-subtle)',
          }}
          onFocus={(e) => focusStyle(e.currentTarget)}
          onBlur={(e) => { blurStyle(e.currentTarget, !!error); onBlur?.(); }}
          aria-required={field.required}
          aria-invalid={!!error}
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }}
          width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {field.helperText && !error && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{field.helperText}</span>
      )}
      {error && (
        <span role="alert" style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginTop: '2px' }}>{error}</span>
      )}
    </div>
  );
}

// ─── RadioField ───────────────────────────────────────────────────────────────

function RadioField({
  field,
  value,
  onChange,
  error,
  locked,
}: {
  field: FieldDefinition;
  value: string | undefined;
  onChange: (v: string) => void;
  error?: string;
  locked?: boolean;
}) {
  const options = field.options ?? [];
  const displayValue = locked && field.lockedValue
    ? options.find((o) => o.value === field.lockedValue)?.label ?? field.lockedValue
    : null;

  if (locked && displayValue) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={labelStyle}>{field.label}</span>
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--color-surface-mid)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.9375rem',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
          }}
        >
          {displayValue} <span style={{ fontSize: '0.8125rem' }}>(fixed)</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={labelStyle}>
        {field.label}
        {field.required && <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="radiogroup" aria-label={field.label}>
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${checked ? 'var(--color-brand)' : 'var(--color-border)'}`,
                background: checked ? 'var(--color-brand-light)' : 'var(--color-white)',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: checked ? 500 : 400,
                color: checked ? 'var(--color-brand-dark)' : 'var(--color-text-secondary)',
                transition: 'border-color var(--ease-fast), background var(--ease-fast)',
                minHeight: '44px',
                userSelect: 'none',
              }}
            >
              <input
                type="radio"
                name={field.key}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                aria-label={opt.label}
              />
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: `2px solid ${checked ? 'var(--color-brand)' : 'var(--color-border-dark)'}`,
                  background: checked ? 'var(--color-brand)' : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'border-color var(--ease-fast), background var(--ease-fast)',
                }}
              >
                {checked && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'block',
                    }}
                  />
                )}
              </span>
              {opt.label}
            </label>
          );
        })}
      </div>
      {error && (
        <span role="alert" style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginTop: '2px' }}>{error}</span>
      )}
    </div>
  );
}

// ─── FrequencySelectField ─────────────────────────────────────────────────────

function FrequencySelectField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: {
  field: FieldDefinition;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={field.key} style={labelStyle}>
        {field.label}
        <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <select
          id={field.key}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          style={{
            ...inputBase,
            appearance: 'none',
            paddingRight: '36px',
            cursor: 'pointer',
            borderColor: error ? 'var(--color-error)' : 'var(--color-border-dark)',
            boxShadow: error ? 'var(--shadow-focus-error)' : 'none',
            color: value ? 'var(--color-text-primary)' : 'var(--color-text-subtle)',
          }}
          onFocus={(e) => focusStyle(e.currentTarget)}
          onBlur={(e) => { blurStyle(e.currentTarget, !!error); onBlur?.(); }}
          aria-required="true"
          aria-invalid={!!error}
        >
          <option value="" disabled>
            Select frequency…
          </option>
          {FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }}
          width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!error && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Required — no default assumed. Select the frequency of this payment.
        </span>
      )}
      {error && (
        <span role="alert" style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginTop: '2px' }}>{error}</span>
      )}
    </div>
  );
}

// ─── SectionInputRenderer (dispatcher) ───────────────────────────────────────

interface RendererProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
  // Called when the field loses focus; used by the parent to mark the field as
  // touched so per-field inline errors can appear before Calculate is clicked.
  onBlur?: (key: string) => void;
  error?: string;
}

export function SectionInputRenderer({ field, value, onChange, onBlur, error }: RendererProps) {
  const isLocked = Boolean(field.lockedValue);

  if (isLocked && field.type === 'radio') {
    return (
      <RadioField
        field={field}
        value={field.lockedValue}
        onChange={() => {}}
        locked={true}
      />
    );
  }

  switch (field.type) {
    case 'number':
      return (
        <AmountField
          field={field}
          value={value as number | undefined}
          onChange={(v) => onChange(field.key, v)}
          onBlur={() => onBlur?.(field.key)}
          error={error}
        />
      );
    case 'select':
      return (
        <SelectField
          field={field}
          value={value as string | undefined}
          onChange={(v) => onChange(field.key, v)}
          onBlur={() => onBlur?.(field.key)}
          error={error}
        />
      );
    case 'radio':
      return (
        <RadioField
          field={field}
          value={value as string | undefined}
          onChange={(v) => onChange(field.key, v)}
          error={error}
        />
      );
    case 'frequency_select':
      return (
        <FrequencySelectField
          field={field}
          value={value as string | undefined}
          onChange={(v) => onChange(field.key, v)}
          onBlur={() => onBlur?.(field.key)}
          error={error}
        />
      );
    default:
      return null;
  }
}
