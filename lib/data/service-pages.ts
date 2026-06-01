export interface ServicePageData {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    badge: string;
    heading: string;
    subheading: string;
  };
  audience: string[];
  includes: string[];
  deliverables: string[];
  whyUs: Array<{ heading: string; body: string }>;
}

export const SERVICE_PAGES: Record<string, ServicePageData> = {
  'accounting-outsourcing': {
    slug: 'accounting-outsourcing',
    meta: {
      title: 'Accounting Outsourcing Services',
      description:
        'CA-led accounting outsourcing for CPA firms, SMEs and growing businesses. Bank reconciliations, AP/AR, month-end close, management reporting and senior review built in.',
    },
    hero: {
      badge: 'Accounting Outsourcing',
      heading: 'Dedicated accounting support with senior review built in',
      subheading:
        'We handle recurring accounting work for CPA firms, growing businesses and finance teams: reconciliations, close support, reporting and AP/AR, all under Chartered Accountant-led supervision.',
    },
    audience: [
      'CPA and accounting firms needing back-office capacity',
      'SMEs that need reliable monthly accounting without a full-time hire',
      'Growing businesses scaling their finance operations',
      'Finance teams that need support during peak periods',
    ],
    includes: [
      'Bank and credit card reconciliations',
      'Accounts payable and receivable support',
      'Transaction categorisation and ledger maintenance',
      'Month-end close support and close packs',
      'Management account preparation',
      'Variance commentary and exception notes',
      'Intercompany and balance sheet reconciliations',
      'Trial balance review and adjustment support',
    ],
    deliverables: [
      'Reconciled ledgers and bank statements',
      'Month-end close pack with commentary',
      'AP/AR ageing schedules',
      'Management accounts and financial summaries',
      'Exception and variance notes',
      'Reviewer-signed deliverable checklist',
    ],
    whyUs: [
      {
        heading: 'CA-led team with senior review',
        body: 'All accounting work is supervised and reviewed by a qualified Chartered Accountant before delivery. No deliverable leaves the team without a sign-off.',
      },
      {
        heading: 'Confidential and access-controlled',
        body: 'NDA-backed engagement, role-based access to your systems, and documented handoffs ensure your client and business data stays protected.',
      },
      {
        heading: 'Built for firms and finance teams',
        body: 'We work within your tools (QuickBooks, Xero, Excel, or your own portal) and follow your review process, not ours.',
      },
      {
        heading: 'Consistent, named support',
        body: 'You work with the same team every engagement cycle. No rotating staff, no retraining, no lost context between months.',
      },
    ],
  },

  'bookkeeping': {
    slug: 'bookkeeping',
    meta: {
      title: 'Bookkeeping Services',
      description:
        'Professional bookkeeping services for small businesses, CPA firms and growing companies. Clean books, reconciliations, AP/AR, and monthly close packs with senior review.',
    },
    hero: {
      badge: 'Bookkeeping Services',
      heading: 'Clean books, reviewed and ready for your accountant',
      subheading:
        'We provide reliable bookkeeping support for businesses and accounting firms: bank reconciliations, expense categorisation, AP/AR maintenance, and monthly close packs, with senior review before every delivery.',
    },
    audience: [
      'Small and medium businesses needing reliable monthly bookkeeping',
      'CPA and accounting firms offloading bookkeeping production work',
      'Business owners who want clean, up-to-date books without an in-house hire',
      'Finance teams needing additional bookkeeping capacity',
    ],
    includes: [
      'Bank and credit card reconciliations',
      'Daily or weekly transaction entry and categorisation',
      'Accounts payable processing and vendor records',
      'Accounts receivable tracking and debtor schedules',
      'Payroll journal entries and expense posting',
      'Monthly close pack preparation',
      'Fixed asset schedules and depreciation entries',
      'Software support: QuickBooks, Xero, Sage and Excel',
    ],
    deliverables: [
      'Reconciled bank and ledger statements',
      'Monthly profit and loss summary',
      'Balance sheet with supporting schedules',
      'AP and AR ageing reports',
      'Payroll and expense journals',
      'Close checklist with reviewer sign-off',
    ],
    whyUs: [
      {
        heading: 'Reviewed before it reaches you',
        body: 'Every bookkeeping deliverable is checked by a senior reviewer before it is sent. You receive clean, reliable books rather than a first draft.',
      },
      {
        heading: 'Software-native team',
        body: 'Our team works directly in QuickBooks Online, Xero, Sage, and Excel. We adapt to your chart of accounts, your categories, and your process.',
      },
      {
        heading: 'Consistent and dependable',
        body: 'Same team, same process, every month. Your books are maintained on a defined schedule with no gaps, no delays, and no re-work required from your end.',
      },
      {
        heading: 'Confidential handling',
        body: 'We operate under NDA, use role-based access, and document every handoff. Suitable for businesses and practices handling sensitive financial data.',
      },
    ],
  },

  'payroll': {
    slug: 'payroll',
    meta: {
      title: 'Payroll Processing Services',
      description:
        'Reliable payroll processing services for businesses and CPA firms. Payroll inputs, compliance calendars, employee records, variance checks and review-ready payroll summaries.',
    },
    hero: {
      badge: 'Payroll Processing',
      heading: 'Accurate, reviewed payroll support for businesses and firms',
      subheading:
        'We support payroll preparation, input processing, compliance calendars, and summary reporting for businesses and CPA firms. Senior review and documented handoffs are part of every stage.',
    },
    audience: [
      'Businesses needing reliable payroll preparation support',
      'CPA and accounting firms managing payroll for multiple clients',
      'SMEs without a dedicated payroll resource',
      'Finance teams handling multi-location or multi-entity payroll',
    ],
    includes: [
      'Payroll input collection and data preparation',
      'Gross-to-net calculation support',
      'Payroll compliance calendar management',
      'Benefits and deduction record maintenance',
      'Employee records and change management support',
      'Payroll journal entries for accounting integration',
      'Variance and exception checks before finalisation',
      'Payroll summary and reconciliation reports',
    ],
    deliverables: [
      'Payroll input summary for client or provider review',
      'Gross-to-net payroll schedule',
      'Payroll compliance calendar with key dates',
      'Employee deductions and benefits summary',
      'Payroll journal for accounting system posting',
      'Variance and exception report',
    ],
    whyUs: [
      {
        heading: 'Senior review before every submission',
        body: 'Payroll figures are checked against prior periods, employee records, and compliance requirements before submission to your team or payroll provider.',
      },
      {
        heading: 'Compliance-aware support',
        body: 'We track payroll deadlines, manage compliance calendars, and flag exceptions so nothing falls through the cracks during busy periods.',
      },
      {
        heading: 'Confidential and access-controlled',
        body: 'Payroll data is handled under NDA with role-based access and documented handoff protocols. Suitable for multi-client firm environments.',
      },
      {
        heading: 'Integrated with your accounting',
        body: 'Payroll journals and reconciliation entries are prepared in a format ready to post to your general ledger, reducing manual work at month-end.',
      },
    ],
  },

  'cpa-outsourcing': {
    slug: 'cpa-outsourcing',
    meta: {
      title: 'CPA Firm Outsourcing Support',
      description:
        'Dedicated back-office capacity for CPA firms. Bookkeeping production, tax season support, workpaper preparation, client onboarding and reviewer handoff, all CA-led.',
    },
    hero: {
      badge: 'CPA Firm Support',
      heading: 'Back-office capacity for CPA and accounting firms',
      subheading:
        'We give CPA firms a reliable, CA-led back-office team for bookkeeping production, tax season surge, workpaper preparation, and client onboarding. No need to expand in-house staff to cover it.',
    },
    audience: [
      'CPA firms managing tax season capacity pressure',
      'Accounting practices with high bookkeeping production volume',
      'Firms onboarding new clients and needing scalable support',
      'Partners and managers who want review-ready work, not first drafts',
    ],
    includes: [
      'Bookkeeping production for client portfolios',
      'Tax season surge capacity for 1040, 1120, 1065 and related returns',
      'Source document collection and organisation',
      'Workpaper preparation and indexing',
      'Prior-year comparison and variance notes',
      'Client onboarding and data migration support',
      'Trial balance and ledger review support',
      'Recurring monthly or quarterly engagement management',
    ],
    deliverables: [
      'Client-ready bookkeeping packs with reviewer notes',
      'Organised source document files by client and period',
      'Workpaper files ready for preparer or reviewer sign-off',
      'Prior-year comparison schedules',
      'Onboarding checklists and data migration summaries',
      'Engagement status reports per client',
    ],
    whyUs: [
      {
        heading: 'CA-led and designed for accounting firm standards',
        body: 'Our team is supervised by a Chartered Accountant. Deliverables are prepared to meet the review and documentation standards your firm expects, not a generic outsourcing standard.',
      },
      {
        heading: 'Tax season capacity without temporary hires',
        body: 'We provide scalable capacity during your peak periods. Onboarding is fast, SOPs are documented, and you stay in control of review and sign-off.',
      },
      {
        heading: 'Confidential multi-client handling',
        body: 'Client data is handled with strict access controls, NDA-backed workflows, and clear separation between engagements. Built for the multi-client firm environment.',
      },
      {
        heading: 'Partner and manager time freed for review',
        body: 'We do the production work. Your senior staff focus on review, client relationships, and advisory, not data entry, reconciliations, and file preparation.',
      },
    ],
  },

  'us-tax-preparation': {
    slug: 'us-tax-preparation',
    meta: {
      title: 'US Tax Preparation Support Services',
      description:
        'US tax preparation support for CPA and tax firms. Source document organisation, prior-year review, checklist management, and preparer-ready workpapers for 1040, 1120, 1065 and more.',
    },
    hero: {
      badge: 'US Tax Preparation Support',
      heading: 'Preparer-ready US tax support for CPA and tax firms',
      subheading:
        'We support US individual and business tax preparation for CPA and tax firms. We organise source documents, complete prior-year reviews, maintain checklists, and deliver preparer-ready workpaper packages with senior sign-off.',
    },
    audience: [
      'CPA and tax firms managing high-volume individual and business tax returns',
      'Tax practices managing 1040, 1120, 1065 and related compliance work',
      'Firms looking to reduce partner and preparer time on document organisation',
      'Tax practices scaling capacity during the January to April filing season',
    ],
    includes: [
      'Source document collection and organisation by return type',
      'Prior-year tax return review and comparison schedules',
      'Engagement and preparation checklist management',
      'Income, deduction and credit schedule preparation',
      'K-1, 1099 and W-2 reconciliation support',
      'Depreciation schedule maintenance and review',
      'Workpaper file preparation and indexing',
      'Query lists and missing document tracking',
    ],
    deliverables: [
      'Organised source document file by return and period',
      'Prior-year comparison schedule with variance notes',
      'Completed preparation checklist',
      'Income, deduction and credit schedules',
      'Depreciation and fixed asset schedules',
      'Preparer-ready workpaper package with reviewer notes',
      'Outstanding query and missing document list',
    ],
    whyUs: [
      {
        heading: 'Preparer-ready, not first-draft quality',
        body: 'Work is reviewed by a senior before it reaches your preparer. Schedules are complete, cross-references are checked, and queries are flagged, so your team can focus on review and finalisation.',
      },
      {
        heading: 'Tax season capacity at short notice',
        body: 'We can scale support quickly during the January to April peak. Engagements are scoped, access is documented, and we follow your workpaper format and standards.',
      },
      {
        heading: 'Confidential client data handling',
        body: 'Tax documents are handled under NDA with strict access controls, client-level separation, and documented handoff procedures appropriate for a multi-client firm environment.',
      },
      {
        heading: 'US tax workflow expertise',
        body: 'Our team has experience supporting 1040, 1120, 1065, 1041 and related schedules. We understand the documents, the formats, and the preparation process.',
      },
    ],
  },

  'pakistan-taxation': {
    slug: 'pakistan-taxation',
    meta: {
      title: 'Pakistan Taxation Services',
      description:
        'Pakistan income tax, sales tax, withholding tax and FBR compliance services for businesses, professionals and SMEs. CA-led advisory, filing support and compliance calendars.',
    },
    hero: {
      badge: 'Pakistan Taxation Services',
      heading: 'CA-led Pakistan taxation and FBR compliance services',
      subheading:
        'We provide Pakistan income tax, sales tax (GST/SRB), withholding tax, and FBR compliance support for businesses, professionals and SMEs. All work is led by Chartered Accountants and covers end-to-end filing assistance.',
    },
    audience: [
      'Businesses and companies operating in Pakistan',
      'Professionals and sole traders with Pakistan tax obligations',
      'SMEs managing FBR income tax and sales tax compliance',
      'International businesses with Pakistan-based entities or employees',
    ],
    includes: [
      'Pakistan income tax return preparation and filing (individuals and companies)',
      'FBR sales tax registration, return preparation and filing',
      'Withholding tax compliance: deduction, deposit and statements',
      'SRB (Sindh Revenue Board) and PRA sales tax support',
      'Advance tax computation and quarterly payment management',
      'Tax compliance calendar and deadline management',
      'FBR audit support and representation assistance',
      'Corporate tax planning and advisory',
    ],
    deliverables: [
      'Filed income tax returns with acknowledgement',
      'Monthly or quarterly sales tax returns',
      'Withholding tax statements (monthly and annual)',
      'Advance tax computation schedule',
      'Tax compliance calendar with deadlines and payment schedules',
      'FBR correspondence and notice response support',
      'Tax advisory notes and planning memos',
    ],
    whyUs: [
      {
        heading: 'Chartered Accountant-led Pakistan tax team',
        body: 'Our team is led by qualified Chartered Accountants with direct experience in Pakistani income tax, sales tax, withholding tax, and FBR compliance requirements.',
      },
      {
        heading: 'End-to-end compliance support',
        body: 'We handle the full compliance cycle: registration, return preparation, filing, payment management, and correspondence with FBR. Your team does not need to manage the process in detail.',
      },
      {
        heading: 'Deadline and calendar management',
        body: 'We maintain your tax compliance calendar, track due dates, and ensure filings and payments are submitted on time to avoid penalties and default surcharges.',
      },
      {
        heading: 'Advisory alongside compliance',
        body: 'Beyond filing, we provide structured tax planning notes, advance tax management, and advisory on Pakistan corporate and personal tax positions.',
      },
    ],
  },
};
