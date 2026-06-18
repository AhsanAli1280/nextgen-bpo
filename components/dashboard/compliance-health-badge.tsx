import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

// Defensible score: "X of Y applicable obligations met on time over trailing 12 months".
// `basis` is the tooltip text. Computation lives server-side (lib/obligations/health-score).
export function ComplianceHealthBadge({ value, basis }: { value: number; basis: string }) {
  const tone = value >= 90 ? 'text-status-filed' : value >= 70 ? 'text-status-due-soon' : 'text-status-overdue';
  return (
    <div className="flex items-center gap-2 rounded-md border border-cs-border bg-white px-3 py-2" title={basis}>
      <Activity size={16} className={cn(tone)} />
      <span className="text-sm font-medium text-cs-ink-2">
        Health <span className={cn('font-semibold', tone)}>{value}%</span>
      </span>
    </div>
  );
}
