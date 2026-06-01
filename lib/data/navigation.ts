import { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Services',
    href: '#services',
    children: [
      { label: 'Accounting Outsourcing', href: '/accounting-outsourcing' },
      { label: 'Bookkeeping Services', href: '/bookkeeping-services' },
      { label: 'Payroll Processing', href: '/payroll-processing-services' },
      { label: 'Financial Reporting', href: '/financial-reporting-services' },
      { label: 'CPA Firm Support', href: '/cpa-firm-support' },
      { label: 'Audit Firm Support', href: '/audit-firm-support' },
      { label: 'US Tax Preparation', href: '/us-tax-preparation-support' },
      { label: 'Pakistan Taxation', href: '/pakistan-taxation-services' },
      { label: 'Offshore Accounting Staffing', href: '/offshore-accounting-staffing' },
      { label: 'Corporate Advisory', href: '/corporate-advisory-services' },
    ],
  },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Industries', href: '#industries' },
  { label: 'Our Team', href: '#our-team' },
];

export const FOOTER_LINKS = {
  services: [
    { label: 'Accounting Outsourcing', href: '/accounting-outsourcing' },
    { label: 'Bookkeeping Services', href: '/bookkeeping-services' },
    { label: 'Payroll Processing', href: '/payroll-processing-services' },
    { label: 'Financial Reporting', href: '/financial-reporting-services' },
    { label: 'CPA Firm Support', href: '/cpa-firm-support' },
    { label: 'Audit Firm Support', href: '/audit-firm-support' },
    { label: 'US Tax Preparation', href: '/us-tax-preparation-support' },
    { label: 'Pakistan Taxation', href: '/pakistan-taxation-services' },
    { label: 'Offshore Accounting Staffing', href: '/offshore-accounting-staffing' },
    { label: 'Corporate Advisory', href: '/corporate-advisory-services' },
  ],
  company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Our Team', href: '/#our-team' },
    { label: 'Process', href: '/#process' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Contact', href: '/#contact' },
  ],
  resources: [
    { label: 'Confidentiality', href: '/#trust' },
    { label: 'Review Process', href: '/#process' },
    { label: 'CPA Firm Support', href: '/cpa-firm-support' },
    { label: 'US Tax Support', href: '/us-tax-preparation-support' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/#contact' },
    { label: 'Terms of Engagement', href: '/#contact' },
    { label: 'Sitemap', href: '/sitemap.xml' },
  ],
};
