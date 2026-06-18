'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { WizardProgress } from './wizard-progress';
import { WizardQuestionCard } from './wizard-question-card';
import {
  initialState, totalSteps, isDateStep, answer, setEventDate, back, isComplete,
  type WizardState,
} from '@/lib/wizard/state-machine';
import type { WizardConfig, WizardAnswers } from '@/lib/compliance/types';

// Drives the wizard navigation (state machine). On completion, hands answers + date
// to onComplete — which calls the create-event-instance Edge Fn (rule engine). The
// wizard itself resolves no rules.
export function EventWizard({
  config,
  onComplete,
  busy = false,
  error = null,
}: {
  config: WizardConfig;
  onComplete: (answers: WizardAnswers, eventDate: string) => void;
  busy?: boolean;
  error?: string | null;
}) {
  const [state, setState] = useState<WizardState>(initialState());
  const total = totalSteps(config);
  const onDate = isDateStep(config, state);
  const done = isComplete(config, state);

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5 flex items-center gap-3">
        {state.stepIndex > 0 && (
          <button onClick={() => setState(back(state))} className="text-cs-muted hover:text-cs-ink" aria-label="Back">
            <ChevronLeft size={18} />
          </button>
        )}
        <WizardProgress total={total} current={Math.min(state.stepIndex, total - 1)} />
      </div>

      <h1 className="mb-1 text-xs font-semibold uppercase tracking-wide text-cs-muted">{config.title}</h1>

      {!onDate && state.stepIndex < config.questions.length && (
        <WizardQuestionCard
          question={config.questions[state.stepIndex]}
          onSelect={(v) => setState(answer(config, state, v))}
        />
      )}

      {onDate && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-cs-ink">When did this happen?</h2>
          <Field label="Event date" required htmlFor="event-date">
            <Input
              id="event-date"
              type="date"
              value={state.eventDate ?? ''}
              onChange={(e) => setState(setEventDate(state, e.target.value))}
            />
          </Field>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-status-overdue">{error}</p>}

      {done && (
        <Button
          className="mt-5 w-full"
          disabled={busy}
          onClick={() => onComplete(state.answers, state.eventDate!)}
        >
          {busy ? 'Generating…' : 'Add to Calendar'}
        </Button>
      )}
    </div>
  );
}
