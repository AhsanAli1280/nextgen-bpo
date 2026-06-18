import { cn } from '@/lib/utils';

export function WizardProgress({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full',
            i < current ? 'bg-cs-green' : i === current ? 'bg-cs-green/60' : 'bg-cs-border'
          )}
        />
      ))}
    </div>
  );
}
