import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { StatusChip } from '@/components/ui/status-chip';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarClock } from 'lucide-react';
import type { UpcomingObligationVM } from '@/lib/compliance/types';

// Date-driven obligations nothing was declared to create (AGM, Annual Return).
// Beside the deck, not beneath it (UI_UX_BLUEPRINT §1).
export function UpcomingRail({ items }: { items: UpcomingObligationVM[] }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cs-muted">Upcoming</h2>
      {items.length === 0 ? (
        <EmptyState icon={<CalendarClock size={24} />} title="Nothing upcoming" description="Recurring obligations will appear here." className="min-h-[140px]" />
      ) : (
        <div className="space-y-2">
          {items.map((o) => (
            <Link key={o.obligationId} href={`/obligations/${o.obligationId}`}>
              <Card hover className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cs-ink">{o.title}</p>
                  <p className="text-xs text-cs-muted">
                    {o.formNumber ? `${o.formNumber} · ` : ''}due {o.dueDate}
                    {o.triggerNote ? ` · ${o.triggerNote}` : ''}
                  </p>
                </div>
                <StatusChip status={o.status} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
