import { PlugZap } from 'lucide-react';

// Shown when a typed integration boundary is hit (Sprint 5B not yet wired).
// Makes the not-yet-implemented state explicit — never fabricates data.
export function BoundaryBanner({ method }: { method?: string }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-cs-border-dark bg-cs-surface px-4 py-3 text-sm text-cs-ink-2">
      <PlugZap size={16} className="mt-0.5 text-cs-muted" />
      <div>
        <p className="font-medium text-cs-ink">Backend integration pending (Sprint 5B / WS0).</p>
        <p className="text-cs-muted">
          UI rendered against a typed boundary — no mock data.
          {method ? ` Awaiting: ${method}.` : ''}
        </p>
      </div>
    </div>
  );
}
