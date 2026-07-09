// Single source of truth for the pricing release. Every consumer (pricing
// page, homepage preview, inquiry form, structured data) imports from here —
// service data must never be duplicated in components.

export const PRICING_CATEGORIES = [
  'Income Tax Return',
  'Sales Tax Registration & Filing',
  'Company Registration',
  'Intellectual Property',
  'USA LLC & Tax Filing',
  'Accounting & Professional Support',
] as const;

export type PricingCategory = (typeof PRICING_CATEGORIES)[number];

export type Currency = 'PKR' | 'USD';

export type ServicePricing =
  | {
      kind: 'fixed';
      amount: number;
      currency: Currency;
      // Approved catalogue labels some single-fee services "Professional Fee"
      // (LLP/AOP, trademark, patent) rather than "Fixed Professional Fee".
      feeLabel?: 'Fixed Professional Fee' | 'Professional Fee';
    }
  | {
      kind: 'starting';
      amount: number;
      currency: Currency;
      // Why the final fee may exceed the starting amount — only factors
      // relevant to the individual service.
      factors: string[];
    }
  | {
      kind: 'tiered';
      currency: Currency;
      tiers: Array<{ label: string; amount: number }>;
    }
  | {
      kind: 'package';
      amount: number;
      currency: Currency;
      includes: string[];
    }
  | {
      kind: 'per-filing';
      amount: number;
      currency: Currency;
      filingNote: string;
    }
  | {
      kind: 'custom';
      statement: string;
      factors: string[];
      potentialCoverage: string[];
    };

export interface PricedService {
  id: string;
  title: string;
  category: PricingCategory;
  description: string;
  pricing: ServicePricing;
  /** Charges billed separately — shown on the card and in schema description. */
  excludedCharges?: string;
  completionTime: string;
  requirements: string[];
  /** How many leading requirements show on the collapsed card (3–4). */
  keyRequirementCount: number;
  /** Existing service page, where one already exists. Never a new route. */
  servicePageHref?: string;
  seoDescription: string;
}

export type CtaType = 'get-started' | 'exact-quote' | 'custom-quote';

export function ctaForPricing(pricing: ServicePricing): { type: CtaType; label: string } {
  switch (pricing.kind) {
    case 'fixed':
    case 'tiered':
    case 'package':
    case 'per-filing':
      return { type: 'get-started', label: 'Get Started' };
    case 'starting':
      return { type: 'exact-quote', label: 'Get an Exact Quote' };
    case 'custom':
      return { type: 'custom-quote', label: 'Request a Custom Quote' };
  }
}

export function formatAmount(amount: number, currency: Currency): string {
  return currency === 'PKR' ? `Rs. ${amount.toLocaleString('en-PK')}` : `US$${amount.toLocaleString('en-US')}`;
}

export const CUSTOM_QUOTE_STATEMENT = 'Pricing is tailored to the scope and requirements of the engagement.';
export const CUSTOM_QUOTE_FOLLOWUP =
  'You will receive a clear quotation after the scope and required deliverables have been reviewed.';

export const PRICING_CATALOG: PricedService[] = [
  // ── Category 1: Income Tax Return ──────────────────────────────────────
  {
    id: 'ntn-registration-salaried',
    title: 'NTN Registration – Salaried',
    category: 'Income Tax Return',
    description: 'FBR National Tax Number registration for salaried individuals, prepared and filed on your behalf. This is the first step towards becoming a filer.',
    pricing: { kind: 'fixed', amount: 1500, currency: 'PKR' },
    completionTime: '1–2 working days',
    requirements: [
      'Colour copy of CNIC',
      'Latest paid electricity bill',
      'Phone number',
      'Email address',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'NTN registration service for salaried individuals in Pakistan. Fixed professional fee of Rs. 1,500, completed in 1–2 working days.',
  },
  {
    id: 'ntn-registration-business',
    title: 'NTN Registration – Business',
    category: 'Income Tax Return',
    description: 'FBR National Tax Number registration for sole proprietors and business owners. This is the first step towards becoming a filer.',
    pricing: { kind: 'fixed', amount: 2500, currency: 'PKR' },
    completionTime: '1–2 working days',
    requirements: [
      'Colour copy of CNIC',
      'Rent agreement or ownership documents of office premises',
      'Business letterhead',
      'Latest paid electricity bill',
      'Phone number',
      'Email address',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Business NTN registration service in Pakistan. Fixed professional fee of Rs. 2,500, completed in 1–2 working days.',
  },
  {
    id: 'quarterly-withholding-statements',
    title: 'Quarterly Withholding Statements Tax Filing',
    category: 'Income Tax Return',
    description: 'Preparation and e-filing of quarterly withholding tax statements with FBR.',
    pricing: {
      kind: 'starting',
      amount: 5000,
      currency: 'PKR',
      factors: ['Transaction volume', 'Turnover', 'Nature of business activity', 'Scope of work'],
    },
    completionTime: '3–4 working days',
    requirements: [
      'Details of taxes deducted at source during each quarter',
      'Other information as required',
    ],
    keyRequirementCount: 2,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Quarterly withholding statement filing in Pakistan. Professional fees starting from Rs. 5,000 depending on transaction volume and scope.',
  },
  {
    id: 'income-tax-filing-salaried',
    title: 'Annual Income Tax Filing – Salaried',
    category: 'Income Tax Return',
    description: 'Complete annual income tax return preparation and filing for salaried individuals, including wealth statement.',
    pricing: { kind: 'fixed', amount: 3900, currency: 'PKR' },
    completionTime: '3–5 working days',
    requirements: [
      'Annual salary certificate',
      'Details of other income sources, if any',
      'Annual personal expenses',
      'Details of all owned assets',
      'Investments made during the year',
      'Assets disposed of during the year',
      'Other inflows and outflows during the year',
      'Other information as required',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Annual income tax return filing for salaried persons in Pakistan. Fixed professional fee of Rs. 3,900, filed within 3–5 working days.',
  },
  {
    id: 'income-tax-filing-sole-proprietor',
    title: 'Annual Income Tax Filing – Sole Proprietor',
    category: 'Income Tax Return',
    description: 'Annual income tax return preparation and filing for sole proprietors and business individuals.',
    pricing: {
      kind: 'starting',
      amount: 5000,
      currency: 'PKR',
      factors: ['Turnover', 'Transaction volume', 'Nature of business activity', 'Quality of accounting records', 'Complexity'],
    },
    completionTime: '3–5 working days',
    requirements: [
      'Annual accounts',
      'Details of other income sources, if any',
      'Annual personal expenses',
      'Details of all owned assets',
      'Investments made during the year',
      'Assets disposed of during the year',
      'Other inflows and outflows during the year',
      'Other information as required',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Income tax return filing for sole proprietors in Pakistan. Professional fees starting from Rs. 5,000 depending on turnover and complexity.',
  },
  {
    id: 'income-tax-filing-partnership-company',
    title: 'Annual Income Tax Filing – Partnership / Private Company',
    category: 'Income Tax Return',
    description: 'Annual corporate income tax return preparation and filing for partnerships, AOPs, and private companies.',
    pricing: {
      kind: 'starting',
      amount: 10000,
      currency: 'PKR',
      factors: ['Turnover', 'Transaction volume', 'Nature of business activity', 'Quality of accounting records', 'Complexity'],
    },
    completionTime: '5 working days',
    requirements: [
      'Annual audited accounts',
      'Details of taxes deducted at source',
      'Other information as required',
    ],
    keyRequirementCount: 3,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Company and partnership income tax return filing in Pakistan. Professional fees starting from Rs. 10,000 depending on turnover and records.',
  },
  {
    id: 'income-tax-filing-npo-trust',
    title: 'Annual Income Tax Filing – NPO / Charitable Trust',
    category: 'Income Tax Return',
    description: 'Annual income tax return preparation and filing for non-profit organisations and charitable trusts.',
    pricing: {
      kind: 'starting',
      amount: 15000,
      currency: 'PKR',
      factors: ['Activities', 'Turnover', 'Transaction volume', 'Regulatory requirements', 'Complexity'],
    },
    completionTime: '5 working days',
    requirements: [
      'Annual audited accounts',
      'Details of taxes deducted at source',
      'Other information as required',
    ],
    keyRequirementCount: 3,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Income tax return filing for NPOs and charitable trusts in Pakistan. Professional fees starting from Rs. 15,000 depending on activities and regulatory requirements.',
  },

  // ── Category 2: Sales Tax Registration & Filing ────────────────────────
  {
    id: 'gst-registration',
    title: 'GST Registration',
    category: 'Sales Tax Registration & Filing',
    description: 'Federal sales tax (GST) registration with FBR, including biometric and premises verification support.',
    pricing: {
      kind: 'tiered',
      currency: 'PKR',
      tiers: [
        { label: 'Manufacturer', amount: 18000 },
        { label: 'Other Applicants', amount: 15000 },
      ],
    },
    completionTime: '2–3 working days',
    requirements: [
      'Bank-account certificate',
      'Acquisition date, capacity, and business activity',
      'Particulars of all branches, if any',
      'Authorisation of principal officer',
      'GPS-tagged photographs of business premises',
      'Consumer numbers with utility suppliers',
      'Photographs of utility meters',
      'GPS-tagged photographs of machinery for manufacturers',
      'Colour copies of CNICs of partners',
      'Rent agreement or ownership documents',
      'Latest paid electricity bill',
      'Biometric verification',
      'Post-registration verification for manufacturers',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'GST (sales tax) registration in Pakistan. Fixed professional fee: Rs. 18,000 for manufacturers, Rs. 15,000 for other applicants. 2–3 working days.',
  },
  {
    id: 'monthly-sales-tax-return',
    title: 'Monthly Federal / Provincial Sales Tax Return Filing',
    category: 'Sales Tax Registration & Filing',
    description: 'Monthly sales tax return preparation and e-filing across federal and provincial jurisdictions.',
    pricing: {
      kind: 'starting',
      amount: 5000,
      currency: 'PKR',
      factors: [
        'Turnover',
        'Invoice volume',
        'Transaction volume',
        'Number of tax jurisdictions',
        'Nature of business activity',
        'Complexity',
      ],
    },
    completionTime: '3–4 working days',
    requirements: [
      'Copies of sales invoices',
      'Copies of purchase invoices',
      'Bank statements',
      'Other information as required',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Monthly sales tax return filing in Pakistan (federal and provincial). Professional fees starting from Rs. 5,000 per month depending on invoice volume and jurisdictions.',
  },
  {
    id: 'provincial-sales-tax-registration',
    title: 'Provincial Sales Tax Registration – Individual / Company / Partnership',
    category: 'Sales Tax Registration & Filing',
    description: 'Sales tax registration with provincial revenue authorities for services businesses.',
    pricing: { kind: 'fixed', amount: 15000, currency: 'PKR' },
    completionTime: '7–10 working days',
    requirements: [
      'Colour copy of CNIC',
      'Rent agreement or ownership documents',
      'Business letterhead',
      'Latest paid electricity bill',
      'Phone number',
      'Email address',
      'Bank-account certificate',
      'Acquisition date, capacity, and business activity',
      'Particulars of all branches, if any',
      'Authorisation of principal officer',
      'Signed application form',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/pakistan-taxation-services',
    seoDescription:
      'Provincial sales tax registration in Pakistan for individuals, companies, and partnerships. Fixed professional fee of Rs. 15,000, completed in 7–10 working days.',
  },

  // ── Category 3: Company Registration ───────────────────────────────────
  {
    id: 'private-limited-company-registration',
    title: 'Private Limited Company / Single Member Company Registration',
    category: 'Company Registration',
    description: 'End-to-end SECP incorporation of a private limited or single member company, from name reservation to certificate of incorporation.',
    pricing: {
      kind: 'starting',
      amount: 25000,
      currency: 'PKR',
      factors: ['Authorised capital (drives SECP fees)', 'Applicable regulatory requirements'],
    },
    excludedCharges: 'SECP fees are excluded and depend on authorised capital and applicable regulatory requirements.',
    completionTime: '3–10 working days, depending on name availability, document readiness, and regulatory processing',
    requirements: [
      'Three proposed company names',
      'Scanned copies of CNICs of proposed directors and nominees',
      'Registered or correspondence address',
      'Principal business and nature of activity',
      'Authorised-capital details',
      'Paid-up-capital details',
      'Value-per-share configuration',
      'Name of chief executive',
      'Telephone numbers of directors',
      'Email addresses of directors',
      'SECP login details, if available',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/corporate-advisory-services',
    seoDescription:
      'Private limited and single member company registration with SECP in Pakistan. Professional fees starting from Rs. 25,000; SECP fees charged separately.',
  },
  {
    id: 'llp-aop-registration',
    title: 'Limited Liability Partnership / AOP Registration',
    category: 'Company Registration',
    description: 'Registration of limited liability partnerships and associations of persons, including partnership documentation.',
    pricing: { kind: 'fixed', amount: 45000, currency: 'PKR', feeLabel: 'Professional Fee' },
    excludedCharges: 'Applicable SECP, government, regulatory, and official fees are excluded.',
    completionTime: '7–15 working days, subject to timely provision of documents and regulatory processing',
    requirements: [
      'Three proposed names',
      'Clear scanned copies of CNICs of partners',
      'FBR credentials of proposed partners',
      'Registered or correspondence address',
      'Principal business and nature of activity',
      'Agreed ownership or partnership structure',
      'Telephone numbers of partners',
      'Email addresses of partners',
      'Business letterhead for AOP',
      'Paid utility bills',
    ],
    keyRequirementCount: 4,
    servicePageHref: '/corporate-advisory-services',
    seoDescription:
      'LLP and AOP registration in Pakistan. Professional fee Rs. 45,000; SECP, government, and regulatory fees charged separately.',
  },

  // ── Category 4: Intellectual Property ──────────────────────────────────
  {
    id: 'trademark-copyright-registration',
    title: 'Trademark / Copyright Registration',
    category: 'Intellectual Property',
    description: 'Trademark and copyright application preparation, filing, and follow-up with the Intellectual Property Organization of Pakistan.',
    pricing: { kind: 'fixed', amount: 70000, currency: 'PKR', feeLabel: 'Professional Fee' },
    completionTime: 'Subject to standard intellectual-property registration and regulatory timelines',
    requirements: [
      'Applicable trademark application or copies of protected work',
      'Required representations, where applicable',
      'CNIC of owner, applicant, or partners',
      'Specification of goods or services',
      'Residential address or business letterhead',
      'No-objection certificate from publisher, where applicable',
      'Power of attorney',
    ],
    keyRequirementCount: 4,
    seoDescription:
      'Trademark and copyright registration services in Pakistan. Professional fee Rs. 70,000; registration subject to standard IPO timelines.',
  },
  {
    id: 'patent-registration',
    title: 'Patent Registration',
    category: 'Intellectual Property',
    description: 'Patent application drafting support, filing, and prosecution follow-up with the Intellectual Property Organization.',
    pricing: { kind: 'fixed', amount: 150000, currency: 'PKR', feeLabel: 'Professional Fee' },
    completionTime: 'Subject to standard Intellectual Property Organization processing timelines',
    requirements: [
      'Applicable patent application forms',
      'Required specification forms',
      'Patent specifications',
      'Detailed drawings',
      'Demand draft or pay order for applicable fees',
      'Power of attorney',
      'Priority documents, where applicable',
      'CNIC of applicant',
    ],
    keyRequirementCount: 4,
    seoDescription:
      'Patent registration services in Pakistan. Professional fee Rs. 150,000; processing subject to Intellectual Property Organization timelines.',
  },

  // ── Category 5: USA LLC & Tax Filing ───────────────────────────────────
  {
    id: 'usa-company-formation',
    title: 'USA Company Formation – LLC / Inc. (C Corporation)',
    category: 'USA LLC & Tax Filing',
    description: 'Formation of a US LLC or C Corporation from Pakistan, in your selected state.',
    pricing: { kind: 'fixed', amount: 120, currency: 'USD' },
    excludedCharges: 'Applicable US state filing fees are charged separately.',
    completionTime: 'Approximately 3 business days, subject to the selected state and applicable processing timelines',
    requirements: [
      'Two proposed company names',
      'English-language CNIC or passport of director or owner',
    ],
    keyRequirementCount: 2,
    seoDescription:
      'USA LLC and C Corporation formation from Pakistan. Fixed professional fee US$120; US state filing fees charged separately. Approximately 3 business days.',
  },
  {
    id: 'usa-company-formation-package',
    title: 'USA Company Formation – Complete Package',
    category: 'USA LLC & Tax Filing',
    description: 'Complete US company setup: formation, EIN application, and US business bank-account assistance.',
    pricing: {
      kind: 'package',
      amount: 349,
      currency: 'USD',
      includes: [
        'Company formation',
        'Employer Identification Number (EIN) application',
        'Assistance with US business-bank-account setup',
      ],
    },
    excludedCharges: 'Applicable US state filing fees are charged separately.',
    completionTime:
      'Formation: ~3 business days · EIN: ~30 days · Bank-account assistance: ~30 days after EIN issuance',
    requirements: [
      'Two proposed company names',
      'English-language CNIC or passport of director or owner',
      'Articles or certificate of organisation, where applicable',
    ],
    keyRequirementCount: 3,
    seoDescription:
      'Complete USA company formation package from Pakistan: formation, EIN, and bank-account assistance for US$349. US state filing fees charged separately.',
  },
  {
    id: 'usa-tax-filing',
    title: 'USA Tax Filing – State / Federal',
    category: 'USA LLC & Tax Filing',
    description: 'Preparation and filing of US state and federal tax returns for US entities owned from Pakistan.',
    pricing: {
      kind: 'per-filing',
      amount: 200,
      currency: 'USD',
      filingNote: 'State and federal tax filings are treated as separate filings.',
    },
    completionTime: 'Approximately 3 business days, subject to completeness and quality of information',
    requirements: [
      'Financial statements',
      "Previous year's tax return, where applicable",
    ],
    keyRequirementCount: 2,
    servicePageHref: '/us-tax-preparation-support',
    seoDescription:
      'USA state and federal tax filing service. US$200 per separate filing; state and federal filings are treated separately.',
  },

  // ── Category 6: Accounting & Professional Support (must be last) ───────
  {
    id: 'bookkeeping-accounting-services',
    title: 'Bookkeeping & Accounting Services',
    category: 'Accounting & Professional Support',
    description: 'CA-supervised bookkeeping and accounting support for businesses and firms, scoped to your systems and reporting needs.',
    pricing: {
      kind: 'custom',
      statement: CUSTOM_QUOTE_STATEMENT,
      factors: [
        'Scope of work',
        'Transaction volume',
        'Number of entities',
        'Number of bank accounts',
        'Accounting-system requirements',
        'Reporting frequency',
        'Required deliverables',
        'Complexity',
        'Required level of support',
      ],
      potentialCoverage: [
        'Transaction recording',
        'Bank reconciliations',
        'Accounts receivable',
        'Accounts payable',
        'General-ledger maintenance',
        'Monthly closing support',
        'Financial-statement preparation',
        'Management reporting',
        'Accounting clean-up',
        'Accounting-system support',
      ],
    },
    completionTime: 'Agreed per engagement scope',
    requirements: [],
    keyRequirementCount: 0,
    servicePageHref: '/bookkeeping-services',
    seoDescription:
      'Bookkeeping and accounting services with pricing tailored to the scope and requirements of the engagement. Request a custom quote.',
  },
  {
    id: 'audit-support-services',
    title: 'Audit Support Services',
    category: 'Accounting & Professional Support',
    description: 'Audit-readiness and audit-support services: schedules, reconciliations, and document coordination for your audit engagement.',
    pricing: {
      kind: 'custom',
      statement: CUSTOM_QUOTE_STATEMENT,
      factors: [
        'Nature of engagement',
        'Entity size',
        'Scope of work',
        'Number of locations',
        'Quality of accounting records',
        'Required schedules',
        'Expected deliverables',
        'Engagement timeline',
        'Level of support',
      ],
      potentialCoverage: [
        'Audit-readiness support',
        'Preparation of audit schedules',
        'Reconciliation support',
        'Trial-balance review',
        'Financial-statement support',
        'Audit-document coordination',
        'Supporting-document organisation',
        'Assistance with audit queries',
        'Information coordination',
      ],
    },
    completionTime: 'Agreed per engagement scope',
    requirements: [],
    keyRequirementCount: 0,
    servicePageHref: '/audit-firm-support',
    seoDescription:
      'Audit support services — schedules, reconciliations, and audit coordination — with pricing tailored to the scope of the engagement.',
  },
  {
    id: 'cpa-firm-support-services',
    title: 'CPA Firm Support Services',
    category: 'Accounting & Professional Support',
    description: 'Outsourced professional support for CPA firms: bookkeeping, tax-preparation support, workpapers, and scalable offshore resources.',
    pricing: {
      kind: 'custom',
      statement: CUSTOM_QUOTE_STATEMENT,
      factors: [
        'Scope of work',
        'Expected workload',
        'Required expertise',
        'Engagement duration',
        'Assigned resources',
        'Service-delivery model',
        'Required working hours',
        'Turnaround requirements',
        'Reporting requirements',
        'Complexity',
      ],
      potentialCoverage: [
        'Outsourced bookkeeping support',
        'Accounting support',
        'Tax-preparation support',
        'Workpaper preparation',
        'Financial-statement support',
        'Reconciliation support',
        'Audit-support activities',
        'Back-office accounting support',
        'Scalable offshore professional resources',
      ],
    },
    completionTime: 'Agreed per engagement scope',
    requirements: [],
    keyRequirementCount: 0,
    servicePageHref: '/cpa-firm-support',
    seoDescription:
      'Outsourced professional support for CPA firms with pricing tailored to scope, workload, and delivery model. Request a custom quote.',
  },
];

export function servicesByCategory(category: PricingCategory): PricedService[] {
  return PRICING_CATALOG.filter((s) => s.category === category);
}
