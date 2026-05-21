import { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'us-taxation',
    title: 'US Taxation Services',
    description: 'Expert preparation, filing, and advisory for federal, state, and local tax compliance—GAAP-aligned and deadline-guaranteed.',
    icon: 'FileText',
    gradient: 'green',
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping',
    description: 'Accurate, real-time ledger management with bank reconciliation, AP/AR, and month-end close—integrated with your existing tools.',
    icon: 'ClipboardList',
    gradient: 'blue',
  },
  {
    id: 'payroll',
    title: 'Payroll Services',
    description: 'End-to-end payroll processing for US/UK teams: calculations, filings, benefits admin, and compliance—delivered on time, every time.',
    icon: 'Users',
    gradient: 'green',
  },
  {
    id: 'accounting-outsourcing',
    title: 'Accounting Outsourcing',
    description: 'Scale your finance function with dedicated CPAs and analysts who become a seamless extension of your team.',
    icon: 'Workflow',
    gradient: 'blue',
  },
  {
    id: 'corporate-advisory',
    title: 'Corporate Advisory',
    description: 'Strategic financial guidance for growth, fundraising, and operational optimization—from startup to enterprise.',
    icon: 'Lightbulb',
    gradient: 'green',
  },
  {
    id: 'financial-reporting',
    title: 'Financial Reporting',
    description: 'Board-ready reports, KPI dashboards, and regulatory filings with 99.7% accuracy and audit-ready documentation.',
    icon: 'BarChart3',
    gradient: 'blue',
  },
];