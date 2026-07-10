import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { TaxYear2027Popup } from '@/components/wht/tax-year-2027-popup';
import { ArrowRight, Calculator, ChevronRight, ShieldCheck } from 'lucide-react';

/* ============================================================================
   /tax-year-2027-pakistan — executive briefing on Tax Year 2027 withholding
   tax under the Finance Act 2026. Pure server component, statically generated.
   All rates are sourced from the live TY2026-27 implementation
   (lib/tax-rules/rules/fy2027.ts) and must be kept in sync with it. Visible
   content and JSON-LD are generated from the same typed arrays.
   ============================================================================ */

const PAGE_URL = 'https://next-genbpo.com/tax-year-2027-pakistan';
const CALCULATOR_URL = 'https://next-genbpo.com/wht-calculator';
const PAGE_TITLE =
  'Tax Year 2027 Pakistan | WHT Rate Card TY 2027 | FB 2026 Passed | Pakistan Withholding Tax Calculator';
const PAGE_DESCRIPTION =
  'Tax Year 2027 Pakistan guide covering Finance Act 2026 amendments, WHT Rate Card TY 2027 updates, withholding tax changes and an interactive Pakistan Withholding Tax Calculator.';

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  keywords: [
    'Tax Year 2027 Pakistan',
    'WHT Rate Card TY 2027',
    'WHT Rate Card TY 2027 FB 2026 Passed',
    'Withholding Tax Card 2027',
    'Pakistan Tax Card 2027',
    'Pakistan Withholding Tax Calculator',
    'Finance Act 2026 withholding tax changes',
    'FBR Tax Card 2027',
    'WHT Rates Pakistan 2027',
    'Salary Tax Pakistan 2027',
    'Property Withholding Tax Pakistan 2027',
  ],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    siteName: 'NextGen BPO Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

/* ── Typed content arrays (single source for visible content + JSON-LD) ──── */

// Salary slabs — mirrors fy2027.ts §149 slabs (Finance Act 2026, Div I Pt I 1st Sch).
const SALARY_SLABS: ReadonlyArray<{ range: string; rate: string; fixedTax: string }> = [
  { range: 'Up to Rs. 600,000', rate: 'Nil', fixedTax: 'Nil' },
  { range: 'Rs. 600,001 to 1,200,000', rate: '1%', fixedTax: 'Nil' },
  { range: 'Rs. 1,200,001 to 2,200,000', rate: '11%', fixedTax: 'Rs. 6,000' },
  { range: 'Rs. 2,200,001 to 3,200,000', rate: '20%', fixedTax: 'Rs. 116,000' },
  { range: 'Rs. 3,200,001 to 4,100,000', rate: '25%', fixedTax: 'Rs. 316,000' },
  { range: 'Rs. 4,100,001 to 5,600,000', rate: '29%', fixedTax: 'Rs. 541,000' },
  { range: 'Rs. 5,600,001 to 7,000,000', rate: '32%', fixedTax: 'Rs. 976,000' },
  { range: 'Above Rs. 7,000,000', rate: '35%', fixedTax: 'Rs. 1,424,000' },
];

// Finance Act 2026 key changes — before/after summary.
const KEY_CHANGES: ReadonlyArray<{ area: string; before: string; after: string }> = [
  {
    area: 'Salary slabs (Section 149)',
    before: 'Six slabs, top threshold Rs. 4.1 million, 9% high-earner surcharge',
    after: 'Eight slabs up to Rs. 7 million at 35%. Surcharge no longer payable',
  },
  {
    area: 'Property sale (Section 236C)',
    before: 'Nine rates: three FMV bands across three filer tiers (4.5% to 11.5%)',
    after: 'Single flat 2.75% filer rate on gross consideration; 11.5% for non-filers',
  },
  {
    area: 'Property purchase (Section 236K)',
    before: 'Nine rates: three FMV bands across three filer tiers (1.5% to 18.5%)',
    after: 'Flat 1.25% filer rate on fair market value; non-filer rates remain FMV-banded',
  },
  {
    area: 'Services (Section 153(1)(b))',
    before: 'Specified services 6%, residual services 15%',
    after: 'Specified services 7%; new tiers for independent professionals (15%) and terminal and port operators (12%); residual services 14%',
  },
  {
    area: 'Export of goods (Section 154)',
    before: '1% minimum tax',
    after: '1.25% minimum tax',
  },
  {
    area: 'Life insurance payouts (Section 151B)',
    before: 'No dedicated withholding section',
    after: 'New section: 15% or 10% depending on policy age, applied to payout less premiums, as final tax. Exempt after four years or on death or disability',
  },
  {
    area: 'Social media revenue (Section 154B)',
    before: 'No dedicated withholding section',
    after: 'New section: flat 5% on amounts received from social media platforms',
  },
  {
    area: 'IT export regime (Section 154A)',
    before: 'Concessionary 0.25% regime expiring Tax Year 2026',
    after: 'Regime extended through Tax Year 2028-29',
  },
];

// WHT Rate Card TY 2027 — grouped summary tables. Rates mirror fy2027.ts.
type RateRow = { section: string; transaction: string; filer: string; nonFiler: string };

const RATES_EMPLOYMENT_INVESTMENT: ReadonlyArray<RateRow> = [
  { section: '149', transaction: 'Salary', filer: 'Slabs 0% to 35%', nonFiler: 'Same slabs' },
  { section: '149(3)', transaction: 'Directorship / BoD fee', filer: '20%', nonFiler: '20%' },
  { section: '150', transaction: 'Dividends (general / listed)', filer: '15%', nonFiler: '30%' },
  { section: '150', transaction: 'Dividends (IPPs)', filer: '7.5%', nonFiler: '15%' },
  { section: '151', transaction: 'Profit on debt (bank deposits)', filer: '20%', nonFiler: '40%' },
  { section: '151', transaction: 'National Savings Schemes', filer: '20%', nonFiler: '40%' },
  { section: '151B', transaction: 'Life insurance payout (within 1 year)', filer: '15%', nonFiler: '15%' },
  { section: '151B', transaction: 'Life insurance payout (1 to 4 years)', filer: '10%', nonFiler: '10%' },
];

const RATES_GOODS_SERVICES: ReadonlyArray<RateRow> = [
  { section: '153(1)(a)', transaction: 'Goods (companies)', filer: '5%', nonFiler: '10%' },
  { section: '153(1)(a)', transaction: 'Goods (individuals / AOPs)', filer: '5.5%', nonFiler: '11%' },
  { section: '153(1)(b)', transaction: 'Specified services', filer: '7%', nonFiler: '14%' },
  { section: '153(1)(b)', transaction: 'IT and IT-enabled services', filer: '4%', nonFiler: '8%' },
  { section: '153(1)(b)', transaction: 'Independent professionals', filer: '15%', nonFiler: '30%' },
  { section: '153(1)(b)', transaction: 'Terminal and port services', filer: '12%', nonFiler: '24%' },
  { section: '153(1)(b)', transaction: 'Other services (residual)', filer: '14%', nonFiler: '28%' },
  { section: '153(1)(c)', transaction: 'Contracts (companies)', filer: '7.5%', nonFiler: '15%' },
  { section: '153(1)(c)', transaction: 'Contracts (individuals / AOPs)', filer: '8%', nonFiler: '16%' },
];

const RATES_EXPORTS_DIGITAL: ReadonlyArray<RateRow> = [
  { section: '154', transaction: 'Export of goods (minimum tax)', filer: '1.25%', nonFiler: '1.25%' },
  { section: '154A', transaction: 'IT / ITeS exports (PSEB-registered)', filer: '0.25%', nonFiler: '0.25%' },
  { section: '154A', transaction: 'Other exported services', filer: '1%', nonFiler: '1%' },
  { section: '154B', transaction: 'Social media platform revenue', filer: '5%', nonFiler: '5%' },
  { section: '152(1C)', transaction: 'Offshore digital services', filer: '15%', nonFiler: '15%' },
];

const RATES_PROPERTY: ReadonlyArray<RateRow> = [
  { section: '236C', transaction: 'Sale of property', filer: '2.75%', nonFiler: '11.5%' },
  { section: '236K', transaction: 'Purchase (≤ Rs. 50M)', filer: '1.25%', nonFiler: '10.5%' },
  { section: '236K', transaction: 'Purchase (Rs. 50M–100M)', filer: '1.25%', nonFiler: '14.5%' },
  { section: '236K', transaction: 'Purchase (> Rs. 100M)', filer: '1.25%', nonFiler: '18.5%' },
  { section: '155', transaction: 'Rent (companies)', filer: '15%', nonFiler: '30%' },
  { section: '155', transaction: 'Rent (individuals / AOPs)', filer: 'Slabs 0% to 25%', nonFiler: 'Doubled' },
];

const RATE_GROUPS: ReadonlyArray<{
  heading: string;
  rows: ReadonlyArray<RateRow>;
  commentary: string;
}> = [
  {
    heading: 'Employment and Investment Income',
    rows: RATES_EMPLOYMENT_INVESTMENT,
    commentary:
      'Salary withholding under Section 149 operates through the revised eight-slab table set out above. Section 151B applies to the payout less aggregate premiums paid and constitutes final tax; payouts made after four years of policy issuance, or on death or disability, are exempt from deduction.',
  },
  {
    heading: 'Goods, Services and Contracts',
    rows: RATES_GOODS_SERVICES,
    commentary:
      'Reduced rates apply to specific supply categories, including rice, cotton seed and edible oils (1.5%), yarn traders (0.5%), pharmaceutical distribution (1%) and cigarette distribution (2.5%). Sportsperson contracts are subject to 15%, or 30% for non-filers. Annual payment thresholds of Rs. 75,000 (goods) and Rs. 30,000 (services) apply before withholding is triggered.',
  },
  {
    heading: 'Exports, IT and Digital',
    rows: RATES_EXPORTS_DIGITAL,
    commentary:
      'Export regimes under Sections 154 and 154A apply a single rate without a filer distinction. The 0.25% concessionary rate for PSEB-registered IT exporters is available through Tax Year 2028-29. Section 154B deductions are minimum tax for residents and final tax for non-residents without a permanent establishment.',
  },
  {
    heading: 'Property',
    rows: RATES_PROPERTY,
    commentary:
      'The filer rates under Sections 236C and 236K are now flat and no longer vary with property value. Non-filer purchase rates remain value-banded. The late-filer tier that previously sat between the two has been abolished.',
  },
];

// FAQ — single source for visible FAQ and FAQPage JSON-LD.
const FAQ_ITEMS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'When does Tax Year 2027 start and end in Pakistan?',
    answer:
      'Tax Year 2027 covers the income year from 1 July 2026 to 30 June 2027. Pakistan follows a July-to-June fiscal year, and each tax year takes the name of the calendar year in which it ends. Withholding on payments made during this period is governed by the rates enacted through the Finance Act 2026.',
  },
  {
    question: 'Has Finance Bill 2026 been passed?',
    answer:
      'Yes. Finance Bill 2026 was enacted as the Finance Act 2026 (Act No. XLIII of 2026) and received presidential assent on 26 June 2026. Its provisions took effect on 1 July 2026 and govern withholding tax for Tax Year 2027.',
  },
  {
    question: 'Where can I find the WHT Rate Card TY 2027?',
    answer:
      'The WHT Rate Card TY 2027 is based on the enacted Finance Act 2026. This page sets out the key withholding rates for Tax Year 2027 in summary tables, and the Pakistan Withholding Tax Calculator applies the full rate tables automatically, including filer and non-filer treatment and section-specific thresholds.',
  },
  {
    question: 'What are the salary tax slabs for Tax Year 2027?',
    answer:
      'Salary income in Tax Year 2027 is taxed through eight progressive slabs. Income up to Rs. 600,000 is exempt. The marginal rate then rises through 1%, 11%, 20%, 25%, 29% and 32% bands to a top rate of 35% on annual taxable income above Rs. 7,000,000. The high-earner surcharge that applied in the prior year is no longer payable.',
  },
  {
    question: 'What is the withholding tax on property sale and purchase in Tax Year 2027?',
    answer:
      'Under Section 236C, sellers on the Active Taxpayer List pay a flat 2.75% of the gross consideration and non-filers pay 11.5%. Under Section 236K, buyers on the ATL pay a flat 1.25% of fair market value, while non-filer buyers pay 10.5% up to Rs. 50 million, 14.5% between Rs. 50 and 100 million, and 18.5% above Rs. 100 million. The Finance Act 2026 removed the FMV-banded filer rates and the late-filer tier.',
  },
  {
    question: 'What new withholding sections were introduced by Finance Act 2026?',
    answer:
      'Two new sections apply from Tax Year 2027. Section 151B requires life insurance companies and takaful operators to deduct 15% on payouts made within one year of policy issuance, or 10% between one and four years, computed on the payout less premiums paid, as final tax. Payouts after four years, or on death or disability, are exempt. Section 154B requires banks and financial institutions to deduct a flat 5% on revenues received from social media platforms.',
  },
  {
    question: 'What is the difference between filer and non-filer withholding rates?',
    answer:
      'Persons on the FBR Active Taxpayer List pay the standard withholding rates. Persons not on the ATL are generally subject to higher withholding, in many sections double the filer rate under the Tenth Schedule of the Income Tax Ordinance 2001. Certain regimes, including exports under Sections 154 and 154A, apply a single rate regardless of filer status.',
  },
  {
    question: 'How do I calculate my withholding tax for Tax Year 2027?',
    answer:
      'The Pakistan Withholding Tax Calculator covers salary, dividends, profit on debt, goods, services, contracts, exports, rent, property transactions, life insurance payouts and social media revenue. Select the transaction type, enter the amount and filer status, and the calculator applies the enacted Finance Act 2026 rates with a step-by-step explanation of the computation and its statutory basis.',
  },
];

/* ── JSON-LD (generated from the arrays above) ────────────────────────────── */

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Tax Year 2027 Pakistan', item: PAGE_URL },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tax Year 2027 Pakistan: WHT Rate Card TY 2027 Following Finance Act 2026',
  description: PAGE_DESCRIPTION,
  datePublished: '2026-07-01',
  dateModified: '2026-07-02',
  mainEntityOfPage: PAGE_URL,
  author: { '@id': 'https://next-genbpo.com/#organization' },
  publisher: { '@id': 'https://next-genbpo.com/#organization' },
  about: [
    { '@type': 'Thing', name: 'Finance Act 2026 Pakistan' },
    { '@type': 'Thing', name: 'Withholding tax Pakistan' },
    { '@type': 'Thing', name: 'Tax Year 2027' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

// References the calculator entity declared on /wht-calculator.
const calculatorSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': CALCULATOR_URL,
  name: 'Pakistan Withholding Tax Calculator',
  url: CALCULATOR_URL,
  applicationCategory: 'FinanceApplication',
};

/* ── Presentational helpers (server-side only) ────────────────────────────── */

function CalculatorCta({ label }: { label: string }) {
  return (
    <Button asChild size="lg">
      <Link href="/wht-calculator">
        <Calculator className="w-5 h-5 mr-2" aria-hidden="true" />
        {label}
        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
      </Link>
    </Button>
  );
}

function RateTable({ caption, rows }: { caption: string; rows: ReadonlyArray<RateRow> }) {
  return (
    <div className="relative">
      {/* Right-edge fade: signals horizontally scrollable content on narrow screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-px right-px w-8 rounded-r-2xl bg-gradient-to-l from-white to-transparent sm:hidden"
      />
      <div className="overflow-x-auto rounded-2xl border border-brand-border/60">
        <table className="w-full text-sm text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-brand-dark text-white">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Section</th>
            <th scope="col" className="px-4 py-3 font-semibold">Transaction</th>
            <th scope="col" className="px-4 py-3 font-semibold">Filer (ATL)</th>
            <th scope="col" className="px-4 py-3 font-semibold">Non-Filer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border/60">
          {rows.map((row) => (
            <tr key={`${row.section}-${row.transaction}`} className="bg-white">
              <th scope="row" className="px-4 py-3 font-semibold text-brand-dark whitespace-nowrap align-top">{row.section}</th>
              <td className="px-4 py-3 text-brand-dark align-top">{row.transaction}</td>
              <td className="px-4 py-3 text-brand-gray align-top">{row.filer}</td>
              <td className="px-4 py-3 text-brand-gray align-top">{row.nonFiler}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TaxYear2027PakistanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }} />

      {/* Conversion popup — client-only, appears ~6s after load, once per session */}
      <TaxYear2027Popup />

      {/* Breadcrumb — mirrors BreadcrumbList schema */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <ol className="flex items-center gap-1.5 text-sm text-brand-gray">
            <li>
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
            <li aria-current="page" className="text-brand-dark font-medium">Tax Year 2027 Pakistan</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Finance Act 2026 · Effective 1 July 2026
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Tax Year 2027 Pakistan: WHT Rate Card TY 2027 Following Finance Act 2026
            </h1>
            <p className="text-sm text-white/60 mb-6">Published 1 July 2026</p>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-3xl">
              The Finance Act 2026 has been enacted and governs withholding tax for Tax Year 2027.
              This briefing summarises the principal amendments, presents the revised rate tables,
              and sets out the practical implications for withholding agents and taxpayers.
            </p>
            <CalculatorCta label="Launch Pakistan WHT Calculator" />
          </div>
        </Container>
      </section>

      {/* Executive Summary — highlighted briefing panel */}
      <section className="py-14 lg:py-16 bg-white">
        <Container>
          <div className="max-w-3xl bg-brand-light rounded-2xl border border-brand-border/60 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4">Executive Summary</h2>
            <p className="text-brand-gray leading-relaxed mb-4">
              The Finance Act 2026 (Act No. XLIII of 2026) received presidential assent on
              26 June 2026 and took effect on 1 July 2026. It governs withholding tax for
              Tax Year 2027, the income year ending 30 June 2027.
            </p>
            <p className="text-brand-gray leading-relaxed mb-4">
              The Act restructures several high-volume withholding regimes. Salary withholding
              under Section 149 moves to an eight-slab table with the high-earner surcharge
              abolished. Property withholding under Sections 236C and 236K is simplified to flat
              filer rates of 2.75% on sale and 1.25% on purchase. The services withholding
              structure under Section 153(1)(b) is recalibrated, the Section 154 export minimum
              tax rises to 1.25%, and two new withholding sections take effect: Section 151B on
              life insurance and takaful payouts, and Section 154B on social media platform
              revenue.
            </p>
            <p className="text-brand-gray leading-relaxed">
              Withholding agents must apply the revised rates to all payments made on or after
              1 July 2026. Deduction at superseded rates exposes the agent to recovery of the
              shortfall together with default surcharge. The{' '}
              <Link href="/wht-calculator" className="text-brand-green font-medium hover:underline">
                Pakistan Withholding Tax Calculator
              </Link>{' '}
              applies the enacted Tax Year 2027 rates across all covered sections.
            </p>
          </div>
        </Container>
      </section>

      {/* Major changes table */}
      <section className="py-14 lg:py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4">
            Major Withholding Tax Changes under Finance Act 2026
          </h2>
          <p className="text-brand-gray leading-relaxed mb-8 max-w-3xl">
            The table below summarises the principal withholding amendments between Tax Year 2026
            and Tax Year 2027.
          </p>
          {/* Mobile: stacked before/after cards */}
          <div className="sm:hidden space-y-4">
            {KEY_CHANGES.map((row) => (
              <div key={row.area} className="bg-white rounded-2xl border border-brand-border/60 p-5">
                <h3 className="text-sm font-bold text-brand-dark mb-3">{row.area}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">Tax Year 2026</p>
                <p className="text-sm text-brand-gray leading-relaxed mb-3">{row.before}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark mb-1">Tax Year 2027</p>
                <p className="text-sm text-brand-dark leading-relaxed">{row.after}</p>
              </div>
            ))}
          </div>

          {/* Desktop: comparison table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-brand-border/60">
            <table className="w-full text-sm text-left">
              <caption className="sr-only">Finance Act 2026 withholding tax changes for Tax Year 2027 Pakistan</caption>
              <thead className="bg-brand-dark text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Area</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tax Year 2026</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tax Year 2027</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {KEY_CHANGES.map((row) => (
                  <tr key={row.area} className="bg-white">
                    <th scope="row" className="px-4 py-3 font-medium text-brand-dark align-top">{row.area}</th>
                    <td className="px-4 py-3 text-brand-gray align-top">{row.before}</td>
                    <td className="px-4 py-3 text-brand-gray align-top">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Significant changes by section */}
      <section className="py-14 lg:py-16 bg-white">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-8">
            Significant Changes by Section
          </h2>

          <div className="max-w-3xl space-y-12">
            <div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Salary (Section 149)</h3>
              <p className="text-brand-gray leading-relaxed mb-6">
                The Finance Act 2026 replaces the six-slab salary table with an eight-slab
                structure and abolishes the high-earner surcharge. Employers must apply the
                revised slabs to estimated annual taxable salary, including bonus and allowances,
                from the July 2026 payroll onwards. Directors&apos; board meeting fees are taxed
                separately at a flat 20% under Section 149(3). Pensions exceeding Rs. 10 million
                paid to recipients below the age of 70 attract 5% on the excess under
                Section 149(1A).
              </p>
              <div className="overflow-x-auto rounded-2xl border border-brand-border/60">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Salary tax slabs Pakistan Tax Year 2027 under Finance Act 2026</caption>
                  <thead className="bg-brand-dark text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Annual Taxable Income</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Rate on Exceeding Amount</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Fixed Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {SALARY_SLABS.map((slab) => (
                      <tr key={slab.range} className="bg-white">
                        <th scope="row" className="px-4 py-3 font-medium text-brand-dark">{slab.range}</th>
                        <td className="px-4 py-3 text-brand-gray">{slab.rate}</td>
                        <td className="px-4 py-3 text-brand-gray">{slab.fixedTax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Services and Contracts (Section 153)</h3>
              <p className="text-brand-gray leading-relaxed">
                The services withholding structure under Section 153(1)(b) is recalibrated. The
                specified-services rate rises from 6% to 7%. Independent professionals, including
                doctors, lawyers, architects, accountants and software engineers working
                independently, are assigned a dedicated 15% tier. Terminal and port operating
                services are set at 12%, and the residual services rate moves from 15% to 14%.
                IT and IT-enabled services retain the concessionary 4% rate. Contract execution
                rates under Section 153(1)(c) are unchanged at 7.5% for companies and 8% for
                individuals and AOPs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Exports and IT (Sections 154 and 154A)</h3>
              <p className="text-brand-gray leading-relaxed">
                The Section 154 minimum tax on export realization rises from 1% to 1.25%. The
                Section 154A concessionary regime for the export of services is extended through
                Tax Year 2028-29, retaining the 0.25% rate for PSEB-registered IT and IT-enabled
                service exporters and 1% for other exported services. Both export regimes apply a
                single rate without a filer distinction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Property Transactions (Sections 236C and 236K)</h3>
              <p className="text-brand-gray leading-relaxed">
                Property withholding is restructured. On sale, Section 236C now applies a single
                flat rate of 2.75% of the gross consideration for sellers on the Active Taxpayer
                List; non-filer sellers are subject to 11.5%. On purchase, Section 236K applies a
                flat 1.25% of fair market value for filers irrespective of property size, while
                non-filer buyers remain subject to value-banded rates of 10.5%, 14.5% and 18.5%.
                The late-filer tier is abolished in both sections. The differential between filer
                and non-filer treatment is now the dominant cost variable in property
                transactions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">New Sections: 151B and 154B</h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                <strong className="text-brand-dark">Section 151B.</strong> Life insurance companies, family takaful
                and window takaful operators must deduct tax on payouts, surrender values and
                maturity proceeds paid to individuals. The taxable base is the gross payout less
                aggregate premiums paid. The rate is 15% where the payout occurs within one year
                of policy issuance and 10% between one and four years. Payouts after four years,
                or on death or disability, are exempt. The deduction constitutes final tax.
              </p>
              <p className="text-brand-gray leading-relaxed">
                <strong className="text-brand-dark">Section 154B.</strong> Banks and financial institutions must
                deduct a flat 5% on amounts credited or received as revenue from social media
                platforms. The deduction is minimum tax for residents and final tax for
                non-residents without a permanent establishment in Pakistan. The section applies
                to content creators, digital agencies and any person monetising platforms such as
                YouTube, Facebook, Instagram and TikTok.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Rate card — grouped tables */}
      <section className="py-14 lg:py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4">
            WHT Rate Card TY 2027: Summary Tables
          </h2>
          <p className="text-brand-gray leading-relaxed mb-10 max-w-3xl">
            The WHT Rate Card TY 2027 set out below reflects the enacted Finance Act 2026 and
            serves as the Withholding Tax Card 2027 reference for the most commonly applied
            sections of the Income Tax Ordinance 2001. Section-specific thresholds, exemptions
            and reduced-rate categories apply; the{' '}
            <Link href="/wht-calculator" className="text-brand-green font-medium hover:underline">
              calculator
            </Link>{' '}
            resolves these automatically.
          </p>

          <div className="space-y-12">
            {RATE_GROUPS.map((group) => (
              <div key={group.heading}>
                <h3 className="text-xl font-bold text-brand-dark mb-4">{group.heading}</h3>
                <RateTable caption={`WHT Rate Card TY 2027 — ${group.heading}`} rows={group.rows} />
                <p className="text-sm text-brand-gray leading-relaxed mt-4 max-w-3xl">{group.commentary}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-brand-gray mt-10 max-w-3xl">
            Rates per the Finance Act 2026 (Act No. XLIII of 2026). This summary is for general
            information and is not a substitute for professional tax advice.
          </p>
        </Container>
      </section>

      {/* Practical implications */}
      <section className="py-14 lg:py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4">
              Practical Implications for Businesses and Taxpayers
            </h2>
            <ul className="space-y-5 text-brand-gray leading-relaxed list-none">
              <li className="border-l-2 border-brand-green/70 pl-5 py-1">
                <strong className="text-brand-dark">Payroll.</strong> The revised Section 149 slabs apply from the
                first payroll cycle of July 2026. Employers should recalibrate withholding for
                every employee, re-estimate annual taxable salary including bonus and allowance
                projections, and confirm that the abolished surcharge is no longer being applied
                to high earners.
              </li>
              <li className="border-l-2 border-brand-green/70 pl-5 py-1">
                <strong className="text-brand-dark">Service providers and their customers.</strong> Withholding agents
                paying for services should re-map vendors to the restructured Section 153(1)(b)
                tiers, in particular the new professional and terminal-and-port categories.
                Misclassification between the 7%, 14% and 15% tiers produces either
                under-deduction exposure or unnecessary cost to the vendor.
              </li>
              <li className="border-l-2 border-brand-green/70 pl-5 py-1">
                <strong className="text-brand-dark">Exporters.</strong> The increase to 1.25% under Section 154
                affects cash flow on every export realization. IT exporters should confirm PSEB
                registration status to retain the 0.25% concessionary rate, which is now available
                through Tax Year 2028-29.
              </li>
              <li className="border-l-2 border-brand-green/70 pl-5 py-1">
                <strong className="text-brand-dark">Property parties.</strong> Filer status should be verified before
                any transfer is registered. For a purchase above Rs. 100 million, the difference
                between the filer and non-filer rate is 17.25 percentage points of fair market
                value. Appearing on the Active Taxpayer List before the transaction date is the
                single most effective withholding mitigation available.
              </li>
              <li className="border-l-2 border-brand-green/70 pl-5 py-1">
                <strong className="text-brand-dark">Insurers and financial institutions.</strong> Life insurers and
                takaful operators must implement Section 151B deduction at source, including the
                net-of-premiums computation and the four-year and death-or-disability exemptions.
                Banks must identify social media platform receipts and apply Section 154B at 5%.
              </li>
              <li className="border-l-2 border-brand-green/70 pl-5 py-1">
                <strong className="text-brand-dark">Compliance review.</strong> Withholding statements, vendor
                masters and payment workflows should be updated for the Tax Year 2027 rates before
                the first statutory filing of the year. Our{' '}
                <Link href="/pakistan-taxation-services" className="text-brand-green font-medium hover:underline">
                  Pakistan taxation and income tax return filing services
                </Link>{' '}
                and{' '}
                <Link href="/payroll-processing-services" className="text-brand-green font-medium hover:underline">
                  payroll processing services
                </Link>{' '}
                teams support both exercises.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Calculator CTA */}
      <section className="py-16 lg:py-20 bg-brand-dark">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Pakistan Withholding Tax Calculator
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              The calculator applies the enacted Finance Act 2026 rates for Tax Year 2027 across
              salary, dividends, profit on debt, goods, services, contracts, exports, rent,
              property transactions, life insurance payouts and social media revenue. Each
              computation includes filer and non-filer treatment and a step-by-step explanation
              with its statutory basis.
            </p>
            <CalculatorCta label="Launch Pakistan WHT Calculator" />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white" aria-labelledby="ty2027-faq-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="ty2027-faq-heading" className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-brand-gray mb-8">
              Common questions on Tax Year 2027, the WHT Rate Card TY 2027 and withholding under
              the Finance Act 2026.
            </p>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group bg-white rounded-2xl border border-brand-border/60 overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-base font-semibold text-brand-dark [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-brand-gray transition-transform duration-200 group-open:rotate-180"
                      viewBox="0 0 20 20" fill="none" aria-hidden="true"
                    >
                      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="px-6 pb-5 text-sm text-brand-gray leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Related links */}
      <section className="py-14 lg:py-16 bg-brand-light">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Related Resources</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/wht-calculator" className="text-brand-green font-medium hover:underline inline-flex items-center gap-1">
                  Pakistan Withholding Tax Calculator
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link href="/pakistan-taxation-services" className="text-brand-green font-medium hover:underline inline-flex items-center gap-1">
                  Income Tax Return Filing &amp; Pakistan Taxation Services
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link href="/payroll-processing-services" className="text-brand-green font-medium hover:underline inline-flex items-center gap-1">
                  Payroll Processing Services
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link href="/corporate-advisory-services" className="text-brand-green font-medium hover:underline inline-flex items-center gap-1">
                  Corporate Advisory Services
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
