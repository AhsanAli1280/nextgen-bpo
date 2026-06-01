export const BRAND = {
  name: 'NextGen BPO Solutions',
  shortName: 'NextGen BPO',
  tagline: 'CA-led accounting, taxation and back-office outsourcing',
  colors: {
    green: '#39B54A',
    blue: '#3F6FB6',
  },
} as const;

export const CONTACT = {
  phone: '+92-328-4000-398',
  email: 'info@next-genbpo.com',
  location: 'Pakistan',
} as const;

export const SEO = {
  title: 'NextGen BPO Solutions | CA-Led Accounting Outsourcing Services',
  description:
    'CA-led accounting, taxation and back-office outsourcing services for CPA firms, audit firms, tax practices, and growing businesses worldwide.',
  keywords: [
    'accounting outsourcing',
    'bookkeeping services',
    'CPA outsourcing',
    'US tax preparation support',
    'Pakistan taxation services',
    'offshore accounting services',
    'back office support services',
    'audit firm support',
    'payroll processing services',
    'corporate advisory',
  ],
} as const;

export const SERVICE_PAGE_SLUGS = [
  'accounting-outsourcing',
  'cpa-outsourcing',
  'us-tax-preparation',
  'pakistan-taxation',
  'bookkeeping',
  'payroll',
] as const;

export type ServicePageSlug = (typeof SERVICE_PAGE_SLUGS)[number];
