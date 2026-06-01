import { ProcessStep } from '@/types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Tell us what you need',
    description: 'Share your firm type, the work involved, current volume, and what you want to hand off. No lengthy forms. A short conversation is enough.',
    icon: 'Calendar',
  },
  {
    step: 2,
    title: 'We define the scope together',
    description: 'We set out the exact scope, turnaround expectations, access requirements, review steps, and who is responsible for what.',
    icon: 'Users',
  },
  {
    step: 3,
    title: 'Work starts with full review coverage',
    description: 'Your named team begins the work. Every deliverable goes through a senior reviewer before it reaches you, without exception.',
    icon: 'FileCheck2',
  },
  {
    step: 4,
    title: 'We adjust as you grow',
    description: 'Once a workflow is running well, we review quality, exceptions, and any changes in your requirements and adjust capacity accordingly.',
    icon: 'TrendingUp',
  },
];
