/**
 * Event Wizard state machine — pure UI navigation over a WizardConfig.
 *
 * This is presentation/navigation logic only. It does NOT resolve rules, deadlines,
 * or obligations — that is the rule engine, invoked server-side via the
 * create-event-instance Edge Function when the wizard completes.
 */

import type { WizardConfig, WizardAnswers } from '@/lib/compliance/types';

export interface WizardState {
  stepIndex: number;            // 0..questions.length (last = event date if required)
  answers:   WizardAnswers;
  eventDate: string | null;
}

export function initialState(): WizardState {
  return { stepIndex: 0, answers: {}, eventDate: null };
}

export function totalSteps(config: WizardConfig): number {
  return config.questions.length + (config.requiresEventDate ? 1 : 0);
}

export function isDateStep(config: WizardConfig, s: WizardState): boolean {
  return config.requiresEventDate && s.stepIndex === config.questions.length;
}

export function answer(config: WizardConfig, s: WizardState, value: string): WizardState {
  if (isDateStep(config, s)) return s;
  const q = config.questions[s.stepIndex];
  return { ...s, answers: { ...s.answers, [q.id]: value }, stepIndex: s.stepIndex + 1 };
}

export function setEventDate(s: WizardState, date: string): WizardState {
  return { ...s, eventDate: date };
}

export function back(s: WizardState): WizardState {
  return { ...s, stepIndex: Math.max(0, s.stepIndex - 1) };
}

export function isComplete(config: WizardConfig, s: WizardState): boolean {
  const allAnswered = config.questions.every((q) => s.answers[q.id] != null);
  const dateOk = !config.requiresEventDate || !!s.eventDate;
  return allAnswered && dateOk;
}
