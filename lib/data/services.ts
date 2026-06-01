import { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'accounting-outsourcing',
    title: 'Accounting Outsourcing',
    description:
      'Dedicated accounting support for recurring transaction processing, reconciliations, month-end close, and management reporting under senior review.',
    icon: 'ClipboardList',
    gradient: 'green',
    href: '/accounting-outsourcing',
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping Services',
    description:
      'Clean books, bank and credit card reconciliations, AP/AR support, expense categorization, and monthly close packs for businesses and firms.',
    icon: 'BookOpenCheck',
    gradient: 'blue',
    href: '/bookkeeping',
  },
  {
    id: 'payroll',
    title: 'Payroll Processing',
    description:
      'Payroll input preparation, recurring payroll calendars, benefits coordination, employee records support, and review-ready payroll summaries.',
    icon: 'Users',
    gradient: 'green',
    href: '/payroll',
  },
  {
    id: 'financial-reporting',
    title: 'Financial Reporting',
    description:
      'Monthly MIS packs, financial statements, variance commentary, cash flow reporting, KPI schedules, and board-ready finance summaries.',
    icon: 'BarChart3',
    gradient: 'blue',
  },
  {
    id: 'cpa-firm-support',
    title: 'CPA Firm Support',
    description:
      'Back-office capacity for CPA firms including bookkeeping production, tax season support, client onboarding, workpaper preparation, and reviewer handoff.',
    icon: 'ClipboardList',
    gradient: 'blue',
    href: '/cpa-outsourcing',
  },
  {
    id: 'audit-firm-support',
    title: 'Audit Firm Support',
    description:
      'Audit file organization, PBC tracking, confirmations support, schedules, sampling support, and workpaper indexing for audit teams.',
    icon: 'FileCheck2',
    gradient: 'green',
  },
  {
    id: 'us-tax-preparation',
    title: 'US Tax Preparation Support',
    description:
      'Support for US individual and business tax preparation, source document organization, prior-year review, checklists, and preparer-ready workpapers.',
    icon: 'FileText',
    gradient: 'blue',
    href: '/us-tax-preparation',
  },
  {
    id: 'pakistan-taxation',
    title: 'Pakistan Taxation Services',
    description:
      'Pakistan income tax, sales tax, withholding tax, compliance calendars, filing support, and advisory for businesses and professionals.',
    icon: 'Landmark',
    gradient: 'green',
    href: '/pakistan-taxation',
  },
  {
    id: 'offshore-accounting-staffing',
    title: 'Offshore Accounting Staffing',
    description:
      'Dedicated offshore accounting resources for firms that need reliable capacity, defined workflows, and supervised delivery.',
    icon: 'Briefcase',
    gradient: 'blue',
  },
  {
    id: 'corporate-advisory',
    title: 'Corporate Advisory',
    description:
      'Financial modeling, business planning, management reporting, internal controls support, and corporate finance assistance for growing companies.',
    icon: 'TrendingUp',
    gradient: 'green',
  },
];
