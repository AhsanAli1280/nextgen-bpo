'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { compliancePort, IntegrationNotImplemented } from '@/lib/compliance/contracts';
import type { WizardConfig, WizardAnswers, ObligationChainVM } from '@/lib/compliance/types';
import { EventWizard } from '@/components/wizard/event-wizard';
import { ObligationChainResult } from '@/components/wizard/obligation-chain-result';
import { BoundaryBanner } from '@/components/compliance/boundary-banner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Loader2 } from 'lucide-react';

// Event Wizard host. Config + creation come from the typed port (rule engine via
// create-event-instance Edge Fn in 5B). No rule logic in the UI.
export default function EventWizardPage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const router = useRouter();

  const [config, setConfig] = useState<WizardConfig | null>(null);
  const [boundary, setBoundary] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ObligationChainVM | null>(null);

  useEffect(() => {
    let alive = true;
    compliancePort()
      .getWizardConfig(eventTypeId)
      .then((c) => alive && setConfig(c))
      .catch((e) => alive && setBoundary(e instanceof IntegrationNotImplemented ? 'getWizardConfig' : 'getWizardConfig'));
    return () => { alive = false; };
  }, [eventTypeId]);

  async function handleComplete(answers: WizardAnswers, eventDate: string) {
    setBusy(true);
    setError(null);
    try {
      const chain = await compliancePort().createEventInstance({
        companyId: 'active', eventTypeId, answers, eventDate,
      });
      setResult(chain);
    } catch (e) {
      setError(e instanceof IntegrationNotImplemented
        ? 'Event creation is wired in Sprint 5B.'
        : (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-md space-y-5">
        <h1 className="text-lg font-semibold text-cs-ink">Obligations created</h1>
        <ObligationChainResult chain={result} />
        <Button className="w-full" onClick={() => router.push('/calendar')}>View on Calendar</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {boundary && <BoundaryBanner method={boundary} />}
      {config ? (
        <EventWizard config={config} onComplete={handleComplete} busy={busy} error={error} />
      ) : boundary ? (
        <EmptyState
          title="Wizard config unavailable"
          description="Event taxonomy + disambiguation resolve from the server in Sprint 5B."
        />
      ) : (
        <div className="flex justify-center py-12 text-cs-muted"><Loader2 className="animate-spin" /></div>
      )}
    </div>
  );
}
