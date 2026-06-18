import { ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusChip } from '@/components/ui/status-chip';
import type { ObligationChainVM } from '@/lib/compliance/types';

// Shows resolved obligation(s); chained obligations rendered sequentially (Step 1 → Step 2),
// explicitly NOT duplicates (UI_UX_BLUEPRINT §4; DIR-001/DIR-002).
export function ObligationChainResult({ chain }: { chain: ObligationChainVM }) {
  return (
    <div className="space-y-2">
      {chain.obligations.map((o, i) => (
        <div key={o.obligationId}>
          {i > 0 && (
            <div className="flex justify-center py-1 text-cs-subtle">
              <ArrowDown size={16} />
            </div>
          )}
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {o.stepLabel && <span className="text-xs font-semibold text-cs-green">{o.stepLabel}</span>}
                <p className="truncate text-sm font-semibold text-cs-ink">{o.title}</p>
                <p className="text-xs text-cs-muted">
                  {o.formNumber ? `${o.formNumber} · ` : ''}within {o.deadlineDays} days
                  {o.dueDate ? ` · due ${o.dueDate}` : ''}
                </p>
                {o.legalBasis && <p className="mt-1 text-xs text-cs-subtle">{o.legalBasis}</p>}
              </div>
              <StatusChip status={o.status} />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
