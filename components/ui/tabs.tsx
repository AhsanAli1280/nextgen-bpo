'use client';

import { cn } from '@/lib/utils';

export interface TabItem { value: string; label: string }

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-1 border-b border-cs-border', className)} role="tablist">
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'min-h-[44px] px-3 text-sm font-medium transition-colors',
              '-mb-px border-b-2',
              active
                ? 'border-cs-green text-cs-green-dark'
                : 'border-transparent text-cs-muted hover:text-cs-ink'
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
