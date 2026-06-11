'use client';

import { useState } from 'react';
import { WhtResult } from '@/lib/tax-rules/types';
import { ExplanationPanel } from './explanation-panel';

interface ResultPanelProps {
  result: WhtResult | null;
  onClear: () => void;
}

const DISCLAIMER =
  'This calculator is for informational purposes only. Results are based on the Income Tax Ordinance 2001 and the applicable Finance Act. Always consult a qualified tax professional before making withholding tax decisions. NextGen BPO Solutions accepts no liability for errors or omissions.';

export function ResultPanel({ result, onClear }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for environments without clipboard API
      const ta = document.createElement('textarea');
      ta.value = result.explanation;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ─── Empty state ──────────────────────────────────────────────────────────

  if (!result) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border-dark)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          minHeight: '320px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--color-brand-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 7h6M9 11h6M9 15h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#39B54A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p
            style={{
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
            }}
          >
            No result yet
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', maxWidth: '280px' }}>
            Select a WHT section, complete all required fields, and click Calculate.
          </p>
        </div>
      </div>
    );
  }

  // ─── Result state ─────────────────────────────────────────────────────────

  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--color-surface)',
        }}
      >
        <div>
          <p className="wht-step-chip">
            <span className="wht-step-chip__num">3</span>
            Calculation Result
          </p>
          <h3
            style={{
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.35,
            }}
          >
            {result.sectionLabel}
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
              lineHeight: 1.5,
            }}
          >
            {result.transactionSummary}
          </p>
        </div>
        {/* Status badge */}
        <span
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: result.applicable ? 'var(--color-brand-light)' : 'var(--color-surface-mid)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: result.applicable ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: result.applicable ? 'var(--color-brand)' : 'var(--color-text-muted)',
              display: 'inline-block',
            }}
          />
          {result.applicable ? 'WHT Applicable' : 'Exempt'}
        </span>
      </div>

      {/* Explanation content */}
      <div style={{ padding: '24px' }}>
        <ExplanationPanel result={result} />
      </div>

      {/* Action bar */}
      <div
        className="wht-no-print"
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          background: 'var(--color-surface)',
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 22px',
            borderRadius: 'var(--radius-md)',
            border: copied ? '2px solid var(--color-brand)' : '2px solid var(--color-border)',
            background: copied ? 'var(--color-brand-light)' : 'transparent',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: copied ? 'var(--color-brand-dark)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            transition: 'border-color var(--ease-fast), color var(--ease-fast), background var(--ease-fast)',
            minHeight: '44px',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = 'var(--color-brand)';
              e.currentTarget.style.color = 'var(--color-brand)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
          aria-label="Copy calculation result to clipboard"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3 3 7-7" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.25" />
                <path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Copy result
            </>
          )}
        </button>

        <button
          onClick={() => window.print()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 22px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--color-border)',
            background: 'transparent',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            transition: 'border-color var(--ease-fast), color var(--ease-fast)',
            minHeight: '44px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand)';
            e.currentTarget.style.color = 'var(--color-brand)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          aria-label="Print calculation result"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 5V2h8v3M4 11H2V6h12v5h-2M4 9h8v5H4V9z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Print
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={onClear}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 22px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--color-border)',
            background: 'transparent',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            transition: 'border-color var(--ease-fast), color var(--ease-fast)',
            minHeight: '44px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-error)';
            e.currentTarget.style.borderColor = 'var(--color-error)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
          aria-label="Clear result and reset form"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Clear result
        </button>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}
      >
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Disclaimer: </strong>
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
