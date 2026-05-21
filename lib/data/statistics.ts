import { Statistic } from '@/types';

export const STATISTICS: Statistic[] = [
  {
    id: 'cost-reduction',
    value: 60,
    suffix: '%',
    label: 'Average Cost Reduction',
    sublabel: 'vs. in-house hiring',
  },
  {
    id: 'accuracy',
    value: 99.7,
    suffix: '%',
    label: 'Delivery Accuracy',
    sublabel: 'QA-verified output',
    decimals: 1,
  },
  {
    id: 'clients',
    value: 200,
    suffix: '+',
    label: 'Global Clients',
    sublabel: 'across 15 countries',
  },
  {
    id: 'satisfaction',
    value: 4.9,
    suffix: '/5',
    label: 'Client Satisfaction',
    sublabel: 'average rating',
    decimals: 1,
  },
];