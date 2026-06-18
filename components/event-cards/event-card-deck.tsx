import { FileStack } from 'lucide-react';
import { EventCard } from './event-card';
import { EmptyState } from '@/components/ui/empty-state';
import type { EventCardVM } from '@/lib/compliance/types';

// "What Happened?" deck. Cards are applicability-filtered UPSTREAM by the rule engine
// (the port supplies only applicable cards) — this component never filters itself.
export function EventCardDeck({ cards }: { cards: EventCardVM[] }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cs-muted">What happened?</h2>
      {cards.length === 0 ? (
        <EmptyState
          icon={<FileStack size={28} />}
          title="No event cards yet"
          description="Applicable event categories appear here once the company's rule set is resolved."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <EventCard key={c.eventTypeId} card={c} />
          ))}
        </div>
      )}
    </section>
  );
}
