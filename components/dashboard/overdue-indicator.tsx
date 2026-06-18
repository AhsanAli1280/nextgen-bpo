import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Always visible, even at zero — absence of red is itself reassuring (UI_UX_BLUEPRINT §1).
export function OverdueIndicator({ count }: { count: number }) {
  const has = count > 0;
  return (
    <Link
      href="/calendar?status=overdue"
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium',
        has ? 'border-status-overdue/30 bg-red-50 text-status-overdue' : 'border-cs-border bg-white text-cs-muted'
      )}
    >
      <AlertTriangle size={16} />
      {has ? `${count} overdue` : 'No overdue items'}
    </Link>
  );
}
