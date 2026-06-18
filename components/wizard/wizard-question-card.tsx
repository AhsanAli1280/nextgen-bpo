'use client';

import { ChevronRight } from 'lucide-react';
import type { WizardQuestion } from '@/lib/compliance/types';

// One question at a time, single-select cards (UI_UX_BLUEPRINT §4).
export function WizardQuestionCard({
  question,
  onSelect,
}: {
  question: WizardQuestion;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-cs-ink">{question.prompt}</h2>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex min-h-[44px] w-full items-center justify-between rounded-md border border-cs-border-dark bg-white px-4 py-3 text-left text-sm font-medium text-cs-ink transition-colors hover:border-cs-green hover:bg-cs-green-light"
          >
            <span>
              {opt.label}
              {opt.hint && <span className="mt-0.5 block text-xs font-normal text-cs-muted">{opt.hint}</span>}
            </span>
            <ChevronRight size={16} className="text-cs-subtle" />
          </button>
        ))}
      </div>
    </div>
  );
}
