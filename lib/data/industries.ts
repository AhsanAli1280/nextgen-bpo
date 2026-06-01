import { Industry } from '@/types';

export const INDUSTRIES: Industry[] = [
  {
    id: 'accounting-firms',
    name: 'CPA & Accounting Firms',
    icon: 'Building2',
    useCases: ['Bookkeeping production', 'Tax preparation support', 'Client onboarding support'],
    clientCount: 'Practice-ready support',
    gradient: 'blue',
  },
  {
    id: 'audit-firms',
    name: 'Audit Firms',
    icon: 'Briefcase',
    useCases: ['Workpaper support', 'PBC tracking', 'Schedule preparation'],
    clientCount: 'Reviewer-led delivery',
    gradient: 'green',
  },
  {
    id: 'tax-practices',
    name: 'Tax Practices',
    icon: 'FileText',
    useCases: ['US tax prep support', 'Pakistan tax compliance', 'Document organization'],
    clientCount: 'Tax season capacity',
    gradient: 'blue',
  },
  {
    id: 'growing-businesses',
    name: 'Growing Businesses',
    icon: 'ShoppingCart',
    useCases: ['Monthly close', 'Payroll processing', 'Back-office accounting'],
    clientCount: 'Ongoing finance support',
    gradient: 'green',
  },
];
