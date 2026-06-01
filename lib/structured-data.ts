const BASE_URL = 'https://next-genbpo.com';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'NextGen BPO Solutions',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-328-4000-398',
    email: 'info@next-genbpo.com',
    contactType: 'customer service',
    areaServed: ['PK', 'US', 'GB', 'SA'],
    availableLanguage: 'English',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lahore',
    addressCountry: 'PK',
  },
  sameAs: [] as string[],
};

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#service`,
  name: 'NextGen BPO Solutions',
  url: BASE_URL,
  description: 'CA-led accounting, taxation and back-office outsourcing services for CPA firms, audit firms, tax practices, and growing businesses worldwide.',
  telephone: '+92-328-4000-398',
  email: 'info@next-genbpo.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lahore',
    addressCountry: 'PK',
  },
  areaServed: [
    { '@type': 'Country', name: 'Pakistan' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Saudi Arabia' },
  ],
  serviceType: [
    'Accounting Outsourcing',
    'Bookkeeping Services',
    'CPA Firm Support',
    'Audit Firm Support',
    'US Tax Preparation',
    'Pakistan Taxation',
    'Payroll Processing',
    'Financial Reporting',
    'Offshore Accounting Staffing',
    'Corporate Advisory',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Accounting & BPO Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Accounting Outsourcing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bookkeeping Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Payroll Processing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'US Tax Preparation Support' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pakistan Taxation Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CPA Firm Support' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Audit Firm Support' } },
    ],
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'NextGen BPO Solutions',
  description: 'CA-led accounting, taxation and back-office outsourcing services for CPA firms, audit firms, tax practices, and growing businesses worldwide.',
  publisher: { '@id': `${BASE_URL}/#organization` },
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where do most firms start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most start with a single recurring workflow: bookkeeping, bank reconciliations, payroll support, or tax document preparation. Starting small makes it easy to test the process, build confidence, and expand from there.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is confidential financial information protected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All engagements are NDA-backed. Access to your systems and files is role-based and restricted to the team handling your work. Handoffs are documented, and we follow clear responsibility rules for every workflow involving sensitive client or business data.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the review process actually look like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Work is prepared by the assigned team member and then reviewed by a senior finance professional before it is returned to you. The reviewer checks for completeness, accuracy, assumptions, and any items that need your decision. You receive the output with notes, not just a file.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you work in our accounting software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We work directly in QuickBooks, Xero, NetSuite, Zoho Books, Excel, and Google Workspace. We follow your chart of accounts, your naming conventions, and your preferred file formats, not a generic template.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can we get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After an initial conversation, we typically agree on scope and access within a few days. The first deliverable usually follows shortly after that. There is no lengthy setup process. Most of the groundwork is covered through a short call and a clear scope document.',
      },
    },
  ],
};
