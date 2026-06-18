import { cn } from '@/lib/utils';
import type { ObligationStatus } from '@/lib/compliance/types';

const MAP: Record<ObligationStatus, { dot: string; text: string; label: string }> = {
  overdue:        { dot: 'bg-status-overdue',  text: 'text-status-overdue',  label: 'Overdue' },
  due_soon:       { dot: 'bg-status-due-soon', text: 'text-status-due-soon', label: 'Due soon' },
  upcoming:       { dot: 'bg-status-upcoming', text: 'text-cs-muted',        label: 'Upcoming' },
  filed:          { dot: 'bg-status-filed',    text: 'text-status-filed',    label: 'Filed' },
  not_applicable: { dot: 'bg-cs-subtle',       text: 'text-cs-subtle',       label: 'N/A' },
  superseded:     { dot: 'bg-cs-subtle',       text: 'text-cs-subtle',       label: 'Superseded' },
};

export function StatusDot({ status, className }: { status: ObligationStatus; className?: string }) {
  return <span className={cn('inline-block h-2 w-2 rounded-full', MAP[status].dot, className)} aria-hidden />;
}

export function StatusChip({ status, className }: { status: ObligationStatus; className?: string }) {
  const m = MAP[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', m.text, className)}>
      <StatusDot status={status} />
      {m.label}
    </span>
  );
}
