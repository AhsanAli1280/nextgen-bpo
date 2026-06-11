'use client';

import { WhtResult } from '@/lib/tax-rules/types';
import { formatPkr } from '@/lib/utils/currency';

interface ExplanationPanelProps {
  result: WhtResult;
}

function formatPKR(val: { toNumber: () => number } | number): string {
  const n = typeof val === 'number' ? val : val.toNumber();
  return formatPkr(n);
}

// Parse the markdown explanation string into renderable sections
function renderExplanation(explanation: string): React.ReactNode {
  const lines = explanation.split('\n');
  const nodes: React.ReactNode[] = [];
  let tableRows: string[] = [];
  let inTable = false;
  let key = 0;

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; return; }
    // header row + separator + data rows
    const [headerRow, , ...dataRows] = tableRows;
    const headers = headerRow.split('|').filter(Boolean).map((h) => h.trim());
    const rows = dataRows.map((r) => r.split('|').filter(Boolean).map((c) => c.trim()));

    nodes.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '12px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--color-surface-mid)',
                    borderBottom: '2px solid var(--color-border)',
                    textAlign: i === 0 ? 'left' : 'right',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-surface)',
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--color-border)',
                      textAlign: ci === 0 ? 'left' : 'right',
                      color: 'var(--color-text-secondary)',
                    }}
                    dangerouslySetInnerHTML={{ __html: boldify(cell) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('|')) {
      inTable = true;
      tableRows.push(line);
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    if (!line) {
      nodes.push(<div key={key++} style={{ height: '8px' }} />);
      continue;
    }

    if (line.startsWith('### ')) {
      nodes.push(
        <h3
          key={key++}
          style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
            marginTop: '4px',
          }}
          dangerouslySetInnerHTML={{ __html: boldify(line.slice(4)) }}
        />
      );
    } else if (line.startsWith('#### ')) {
      nodes.push(
        <h4
          key={key++}
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--color-brand-dark)',
            marginTop: '16px',
            marginBottom: '6px',
            paddingBottom: '4px',
            borderBottom: '1px solid var(--color-border)',
          }}
          dangerouslySetInnerHTML={{ __html: boldify(line.slice(5)) }}
        />
      );
    } else if (line.startsWith('> ')) {
      const inner = line.slice(2).replace(/^\[!NOTE\]\n?>?\s*/, '');
      nodes.push(
        <div
          key={key++}
          style={{
            padding: '12px 16px',
            background: 'var(--color-brand-light)',
            borderLeft: '3px solid var(--color-brand)',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            margin: '8px 0',
          }}
          dangerouslySetInnerHTML={{ __html: boldify(inner) }}
        />
      );
    } else if (line.startsWith('- ')) {
      nodes.push(
        <div
          key={key++}
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            paddingLeft: '4px',
          }}
        >
          <span style={{ color: 'var(--color-brand)', marginTop: '2px', flexShrink: 0 }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: boldify(line.slice(2)) }} />
        </div>
      );
    } else {
      nodes.push(
        <p
          key={key++}
          style={{
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
          }}
          dangerouslySetInnerHTML={{ __html: boldify(line) }}
        />
      );
    }
  }

  if (inTable) flushTable();

  return <>{nodes}</>;
}

function boldify(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--color-text-primary);font-weight:600">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function ExplanationPanel({ result }: ExplanationPanelProps) {
  return (
    <div>
      {/* Inapplicable banner */}
      {!result.applicable && (
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--color-brand-light)',
            border: '1px solid var(--color-brand)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="10" cy="10" r="9" stroke="#39B54A" strokeWidth="1.5" />
              <path d="M10 6v4M10 13h.01" stroke="#39B54A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--color-brand-dark)', fontSize: '0.9375rem', marginBottom: '4px' }}>
                WHT Does Not Apply
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {result.inapplicableReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key numbers summary — applicable results */}
      {result.applicable && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <Metric
            label={result.enteredAmountLabel}
            value={formatPKR(result.enteredAmount)}
            accent={false}
          />
          {result.annualisedAmount && (
            <Metric
              label="Annualised Amount"
              value={formatPKR(result.annualisedAmount)}
              accent={false}
            />
          )}
          <Metric
            label="WHT Rate"
            value={`${result.rate}%`}
            sub={result.rateLabel}
            accent={false}
          />
          <Metric
            label={result.enteredFrequency && result.enteredFrequency !== 'ONE_TIME' ? 'WHT / Period' : 'WHT Amount'}
            value={formatPKR(result.whtAmountPerPeriod)}
            accent={true}
          />
          {result.whtAmountAnnual && result.enteredFrequency && result.enteredFrequency !== 'ONE_TIME' && (
            <Metric
              label="Annual WHT"
              value={formatPKR(result.whtAmountAnnual)}
              accent={false}
            />
          )}
          <Metric
            label="Net Payable"
            value={formatPKR(result.netAmountPerPeriod)}
            accent={false}
          />
        </div>
      )}

      {/* Key numbers summary — threshold-exempt results */}
      {!result.applicable && result.theoreticalRate !== undefined && result.theoreticalWhtAmount !== undefined && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <Metric
            label={result.enteredAmountLabel}
            value={formatPKR(result.enteredAmount)}
            accent={false}
          />
          <Metric
            label="Applicable Rate"
            value={`${result.theoreticalRate}%`}
            sub={result.theoreticalRateLabel}
            accent={false}
          />
          <Metric
            label="Theoretical WHT"
            value={formatPKR(result.theoreticalWhtAmount)}
            sub="Illustrative — not payable"
            accent={false}
          />
          <Metric
            label="Final WHT Payable"
            value="PKR 0"
            accent={true}
          />
        </div>
      )}

      {/* Step-by-step explanation */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--color-brand)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Calculation Breakdown
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {renderExplanation(result.explanation)}
        </div>
      </div>

      {/* Legal reference */}
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-subtle)',
          marginTop: '16px',
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: 'var(--color-text-muted)' }}>Legal Reference:</strong>{' '}
        {result.legalReference} &nbsp;|&nbsp; Finance Act {result.financeActYear}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: boolean;
}) {
  return (
    <div
      style={{
        padding: '14px 16px',
        background: accent
          ? 'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)'
          : 'var(--color-white)',
        border: `1px solid ${accent ? 'var(--color-brand-dark)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: accent ? '0 4px 14px rgba(57,181,74,0.25)' : 'var(--shadow-sm)',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: accent ? 'rgba(255,255,255,0.85)' : 'var(--color-text-muted)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </p>
      <p
        className="wht-num"
        style={{
          fontSize: '1.1875rem',
          fontWeight: 700,
          color: accent ? '#ffffff' : 'var(--color-text-primary)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: '0.75rem',
            color: accent ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)',
            marginTop: '4px',
            lineHeight: 1.4,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
