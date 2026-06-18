'use client';

import { useEffect, useState } from 'react';
import { compliancePort, IntegrationNotImplemented } from '@/lib/compliance/contracts';
import type { DashboardData } from '@/lib/compliance/types';
import { EventCardDeck } from '@/components/event-cards/event-card-deck';
import { UpcomingRail } from '@/components/dashboard/upcoming-rail';
import { OverdueIndicator } from '@/components/dashboard/overdue-indicator';
import { ComplianceHealthBadge } from '@/components/dashboard/compliance-health-badge';
import { BoundaryBanner } from '@/components/compliance/boundary-banner';

// Dashboard — Event Card deck leads (UI_UX_BLUEPRINT §1). Data via typed port.
// 5A: port unconfigured → renders boundary + empty components (no mock data).
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [boundary, setBoundary] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    compliancePort()
      .loadDashboard('active')
      .then((d) => alive && setData(d))
      .catch((e) => {
        if (e instanceof IntegrationNotImplemented) alive && setBoundary('loadDashboard');
        else if (alive) setBoundary('loadDashboard');
      });
    return () => { alive = false; };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {boundary && <BoundaryBanner method={boundary} />}

      <div className="flex flex-wrap items-center gap-3">
        <OverdueIndicator count={data?.overdueCount ?? 0} />
        {data?.healthScore && (
          <ComplianceHealthBadge value={data.healthScore.value} basis={data.healthScore.basis} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <EventCardDeck cards={data?.eventCards ?? []} />
        <UpcomingRail items={data?.upcoming ?? []} />
      </div>
    </div>
  );
}
