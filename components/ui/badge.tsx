import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'green' | 'red' | 'amber';

const tones: Record<Tone, string> = {
  neutral: 'bg-cs-surface-mid text-cs-ink-2',
  green:   'bg-cs-green-light text-cs-green-dark',
  red:     'bg-red-50 text-status-overdue',
  amber:   'bg-amber-50 text-status-due-soon',
};

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
