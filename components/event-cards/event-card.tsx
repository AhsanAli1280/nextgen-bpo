'use client';

import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventCardVM } from '@/lib/compliance/types';

// Large, plain-language, tappable. Icon + prompt only — no deadline/form/legal text
// (UI_UX_BLUEPRINT §1). Tap → Event Wizard host. Select mechanic mirrors WHT card grid.
export function EventCard({ card, className }: { card: EventCardVM; className?: string }) {
  const router = useRouter();
  const Icon = ((Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon]) ?? Icons.FileText;

  return (
    <button
      onClick={() => router.push(`/events/${card.eventTypeId}`)}
      className={cn(
        'group flex min-h-[112px] w-full flex-col items-start gap-3 rounded-lg border border-cs-border bg-white p-5 text-left',
        'shadow-cs-card transition-all duration-200 hover:border-cs-green/40 hover:shadow-cs-card-hover',
        className
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cs-green-light text-cs-green">
        <Icon size={20} />
      </span>
      <span className="text-sm font-semibold text-cs-ink">{card.title}</span>
    </button>
  );
}
