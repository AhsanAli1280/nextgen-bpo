'use client';

import { WhtSectionConfig } from '@/lib/tax-rules/types';

interface SectionSelectorProps {
  sections: WhtSectionConfig[];
  value: string;
  onChange: (code: string) => void;
}

export function SectionSelector({ sections, value, onChange }: SectionSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor="section-select"
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
        }}
      >
        WHT Section <span style={{ color: 'var(--color-error)' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <select
          id="section-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 36px 10px 14px',
            fontSize: '0.9375rem',
            fontWeight: 400,
            color: value ? 'var(--color-text-primary)' : 'var(--color-text-subtle)',
            fontFamily: 'var(--font-family)',
            appearance: 'none',
            cursor: 'pointer',
            transition: 'border-color var(--ease-fast), box-shadow var(--ease-fast)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand)';
            e.currentTarget.style.boxShadow = 'var(--shadow-focus-green)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-dark)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          aria-required="true"
        >
          <option value="" disabled>
            Select a WHT section…
          </option>
          {[...sections].sort((a, b) => a.displayOrder - b.displayOrder).map((s) => (
            <option key={s.code} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>
        {/* chevron */}
        <svg
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--color-text-muted)',
          }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
