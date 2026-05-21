import { ProcessStep } from '@/types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Discovery & Alignment',
    description: 'We map your workflows, compliance needs, and success metrics to build a tailored scope and SLA.',
    icon: 'Calendar',
  },
  {
    step: 2,
    title: 'Team Assembly',
    description: 'We assign your dedicated team of CPAs, analysts, and automation experts—vetted, trained, and ready to integrate.',
    icon: 'Users',
  },
  {
    step: 3,
    title: 'Pilot Launch',
    description: 'Start with a low-risk pilot project. Measure accuracy, speed, and ROI before scaling.',
    icon: 'Rocket',
  },
  {
    step: 4,
    title: 'Scale & Optimize',
    description: 'Expand scope, add services, and optimize workflows with continuous feedback and quarterly business reviews.',
    icon: 'TrendingUp',
  },
];