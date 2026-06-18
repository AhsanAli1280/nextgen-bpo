import { cn } from '@/lib/utils';

// Dashed empty/boundary box — pattern from wht/result-panel empty state.
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg',
        'border border-dashed border-cs-border-dark bg-cs-surface px-8 py-10 text-center',
        className
      )}
    >
      {icon && <div className="text-cs-subtle">{icon}</div>}
      <p className="text-sm font-semibold text-cs-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-cs-muted">{description}</p>}
      {action}
    </div>
  );
}
