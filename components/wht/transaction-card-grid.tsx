'use client';

import { WhtSectionConfig } from '@/lib/tax-rules/types';

interface TransactionCardGridProps {
  sections: WhtSectionConfig[];
  value: string;
  onChange: (code: string) => void;
}

// "Section 148 - Imports" -> "Sec 148". All section labels follow the
// "<legal ref> - <name>" convention, so this derives the short reference shown
// on each card without requiring a dedicated config field.
function sectionRef(label: string): string {
  const idx = label.indexOf(' - ');
  const ref = idx === -1 ? label : label.slice(0, idx);
  return ref.replace(/^Section\s+/, 'Sec ');
}

// Professional line-icon set, keyed by section code. Presentation-layer override
// of the emoji icons stored in the rules config — the config is not modified.
// Unknown codes fall back to a generic document icon.
const SECTION_ICON_PATHS: Record<string, React.ReactNode> = {
  // 148 Imports — ship
  '148': <path d="M2 13.5l1.2-4.4L9 7.2l5.8 1.9L16 13.5M9 7.2V3.5M6.5 5h5M3 13.5c1 .9 2 .9 3 0 1 .9 2 .9 3 0 1 .9 2 .9 3 0 1 .9 2 .9 3 0" />,
  // 149 Salary — briefcase
  '149': <path d="M6 5V3.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3V5m-9.5 0h13c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zM2 9h14" />,
  // 150 Dividends — trending up
  '150': <path d="M2 13l4.5-4.5 3 3L15 6m0 0h-4m4 0v4" />,
  // 151 Profit on debt — bank
  '151': <path d="M2 6.5L9 3l7 3.5M3.5 7.5v5M7 7.5v5M11 7.5v5M14.5 7.5v5M2 14.5h14" />,
  // 152 Non-resident payments — globe
  '152': <path d="M9 16A7 7 0 109 2a7 7 0 000 14zM2 9h14M9 2c1.8 1.9 2.8 4.4 2.8 7S10.8 14.1 9 16C7.2 14.1 6.2 11.6 6.2 9S7.2 3.9 9 2z" />,
  // 153a Goods — shopping cart
  '153a': <path d="M2 2.5h2l1.7 8.1c.1.6.6 1 1.2 1h6.5c.6 0 1.1-.4 1.2-1L16 5H4.6M7 14.5a.8.8 0 100 1.6.8.8 0 000-1.6zm6 0a.8.8 0 100 1.6.8.8 0 000-1.6z" />,
  // 153b Services — receipt
  '153b': <path d="M4 2h10v14l-1.7-1.2L10.6 16l-1.6-1.2L7.4 16l-1.7-1.2L4 16V2zM6.5 5.5h5m-5 3h5m-5 3h3" />,
  // 153c Contracts — pen/document
  '153c': <path d="M10 2H4.5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h9c.6 0 1-.4 1-1V6.5L10 2zm0 0v4.5h4.5M6.5 10.5l2-.4 4.6-4.6a1 1 0 00-1.4-1.4L7.1 8.7l-.6 1.8z" />,
  // 6a Digital services — monitor
  '6a': <path d="M2.5 3.5h13c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1v-7c0-.6.4-1 1-1zM6.5 15.5h5M9 12.5v3" />,
  // 155 Rent — home
  '155': <path d="M2.5 8L9 2.5 15.5 8M4 7v7.5c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V7M7.5 15.5v-4.5h3v4.5" />,
  // 236C Property sale — house + tag
  '236C': <path d="M2.5 8L9 2.5 15.5 8M4 7v7.5c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V7M7 10.5h4M7 12.8h2.5" />,
  // 236K Property purchase — key
  '236K': <path d="M11.5 9.5a4 4 0 10-3.9-4.9L2.5 9.7v2.8h2.8v-1.9h1.9V8.7l.7-.7a4 4 0 003.6 1.5zM12 5a.8.8 0 100 1.6A.8.8 0 0012 5z" />,
  // 233 Commission — users/handshake
  '233': <path d="M6.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 15c0-2.5 2-4.5 4.5-4.5S11 12.5 11 15M11.5 8a2.5 2.5 0 100-5M12.5 10.7c2 .4 3.5 2.2 3.5 4.3" />,
  // 156 Prizes — gift
  '156': <path d="M2.5 6.5h13v3h-13v-3zM4 9.5v5c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-5M9 6.5v9M9 6.5C7.5 6.5 5.5 6 5.5 4.5S7.5 2.8 9 6.5zm0 0c1.5 0 3.5-.5 3.5-2S10.5 2.8 9 6.5z" />,
  // 154 Exports — package out
  '154': <path d="M9 2l6 3v6.5L9 15l-6-3.5V5l6-3zM3.3 5.3L9 8.5l5.7-3.2M9 8.5V15" />,
  // 154A IT exports — monitor + arrow
  '154A': <path d="M2.5 3.5h13c.6 0 1 .4 1 1v6.5c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1V4.5c0-.6.4-1 1-1zM6.5 15h5M9 12v3M6.5 7.5L9 5l2.5 2.5M9 5v4.5" />,
};

const FALLBACK_ICON = (
  <path d="M10 2H4.5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h9c.6 0 1-.4 1-1V6.5L10 2zm0 0v4.5h4.5M6.5 9.5h5m-5 3h5" />
);

function SectionIcon({ code }: { code: string }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18" fill="none"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {SECTION_ICON_PATHS[code] ?? FALLBACK_ICON}
    </svg>
  );
}

export function TransactionCardGrid({ sections, value, onChange }: TransactionCardGridProps) {
  const sorted = [...sections].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="wht-card-grid" role="group" aria-label="Select transaction type">
      {sorted.map((s) => {
        const selected = s.code === value;
        return (
          <button
            key={s.code}
            type="button"
            className="wht-tx-card"
            data-selected={selected ? 'true' : undefined}
            aria-pressed={selected}
            aria-label={s.shortDescription
              ? `${s.displayName ?? sectionRef(s.label)} — ${s.shortDescription}`
              : undefined}
            onClick={() => onChange(s.code)}
          >
            <span className="wht-tx-card-icon">
              <SectionIcon code={s.code} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="wht-tx-card-title">{s.displayName ?? sectionRef(s.label)}</span>
              <span className="wht-tx-card-ref">{sectionRef(s.label)}</span>
            </span>
            {selected && (
              <span className="wht-tx-card-check" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            {s.shortDescription && (
              <span className="wht-tx-card-tooltip" aria-hidden="true">{s.shortDescription}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
