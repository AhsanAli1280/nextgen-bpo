import { PilotScopeItem, ProofPoint } from '@/types';

export const TRUST_PILLS = [
  'Chartered Accountant-led',
  'Senior review process',
  'NDA-backed confidentiality',
  'CPA and audit firm support',
  'US and Pakistan tax support',
  'Accounting and back-office expertise',
] as const;

export const PROOF_POINTS: ProofPoint[] = [
  {
    label: 'Chartered Accountant-led team',
    detail: 'Work supervised by finance professionals with accounting, taxation, reporting, and advisory experience.',
  },
  {
    label: 'Senior review before delivery',
    detail: 'Bookkeeping, tax, payroll, reporting, and audit support work is checked before it reaches your team.',
  },
  {
    label: 'Confidential delivery model',
    detail: 'NDA-backed workflows, restricted access, documented handoffs, and clear responsibility for finance data.',
  },
];

export const PILOT_SCOPE: PilotScopeItem[] = [
  {
    title: 'Discovery and scope',
    description: 'We review workflows, volume, tools, and team structure to define the right scope of support.',
  },
  {
    title: 'Engagement plan',
    description: 'You receive a clear plan covering access, handoffs, review steps, turnaround, and responsibilities.',
  },
  {
    title: 'Reviewed delivery',
    description: 'A named team handles work with documented SOPs, reviewer sign-off, and regular status reporting.',
  },
  {
    title: 'Ongoing support',
    description: 'We review quality, exceptions, and scope regularly and adjust capacity as requirements change.',
  },
];
