import { Industry } from '@/types';

export const INDUSTRIES: Industry[] = [
  {
    id: 'accounting-firms',
    name: 'Accounting Firms',
    icon: 'Building2',
    useCases: ['Tax season surge support', 'Client ledger management', 'Compliance documentation'],
    clientCount: '120+ firms',
    gradient: 'blue',
  },
  {
    id: 'smes',
    name: 'SMEs',
    icon: 'Briefcase',
    useCases: ['Fractional CFO services', 'Cash flow forecasting', 'Investor reporting'],
    clientCount: '50+ SMEs',
    gradient: 'green',
  },
  {
    id: 'startups',
    name: 'Startups',
    icon: 'Rocket',
    useCases: ['Cap table management', 'Burn rate analysis', 'Fundraising financials'],
    clientCount: '30+ startups',
    gradient: 'blue',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: 'ShoppingCart',
    useCases: ['Multi-channel reconciliation', 'Inventory accounting', 'Sales tax compliance'],
    clientCount: '40+ stores',
    gradient: 'green',
  },
];