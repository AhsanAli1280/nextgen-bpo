import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Financial Reporting Services | NextGen BPO Solutions',
  description: 'CA-led financial reporting services for businesses and CPA firms. Monthly MIS packs, management accounts, variance analysis, cash flow statements and board-ready reports.',
  alternates: { canonical: 'https://next-genbpo.com/financial-reporting-services' },
  openGraph: {
    title: 'Financial Reporting Services | NextGen BPO Solutions',
    description: 'CA-led financial reporting services for businesses and CPA firms. Monthly MIS packs, management accounts, variance analysis, cash flow statements and board-ready reports.',
    url: 'https://next-genbpo.com/financial-reporting-services',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Financial Reporting Services',
  description: 'CA-led financial reporting including monthly MIS packs, management accounts, variance analysis, cash flow reporting, and board-ready financial summaries.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: ['US', 'GB', 'PK', 'SA'],
  serviceType: 'Financial Reporting',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does a monthly MIS pack typically include?',
      acceptedAnswer: { '@type': 'Answer', text: 'A standard MIS pack includes an income statement with budget versus actual comparison, balance sheet, cash flow statement, AR and AP ageing summaries, and a variance commentary section explaining material movements. The specific contents are agreed with you at the start of the engagement based on what your management team or board actually uses for decisions.' },
    },
    {
      '@type': 'Question',
      name: 'How long after month-end do we receive the financial reports?',
      acceptedAnswer: { '@type': 'Answer', text: 'Turnaround depends on when source data is available. For clients where we also handle the underlying bookkeeping, reports are typically delivered within 5 to 7 working days of month-end. For clients where we receive finalised data from a third party, we work to a turnaround agreed during scope discussions.' },
    },
    {
      '@type': 'Question',
      name: 'Can you produce financial reports against a budget or forecast?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Budget versus actual reporting is a standard component of our management reporting service. You provide the budget figures, and we incorporate them into the monthly report with variance calculations and commentary explaining the key differences. We can also assist with building or updating the budget file if that is a requirement.' },
    },
    {
      '@type': 'Question',
      name: 'Do your financial reports follow a specific accounting standard?',
      acceptedAnswer: { '@type': 'Answer', text: 'Report format and standard depend on the client requirement. We produce management accounts and MIS packs for internal use, which do not require statutory compliance. For financial statements intended for external purposes, we follow the applicable standard — IFRS, US GAAP, or local Pakistan GAAP — as agreed with the client.' },
    },
    {
      '@type': 'Question',
      name: 'Can you produce KPI dashboards alongside financial statements?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We produce KPI schedules covering operational and financial metrics relevant to the business. Common KPIs include gross margin percentage, debtor days, creditor days, burn rate, and revenue by segment. The specific KPIs are defined with you at the start and updated each month with the financial report.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Financial Reporting Services', item: 'https://next-genbpo.com/financial-reporting-services' },
  ],
};

export default function FinancialReportingServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-br from-white via-brand-light to-white overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold tracking-wide uppercase mb-6">
              Financial Reporting Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Financial reporting that management and boards can act on
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We produce monthly MIS packs, management accounts, variance commentary, cash flow statements, and KPI schedules for businesses and their advisors — prepared under CA supervision and structured to give decision-makers clear, accurate financial information each month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/#contact">
                  Request a Consultation
                  <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/#services">See All Services</Link>
              </Button>
            </div>
            <p className="text-xs text-brand-gray mt-4">CA-led delivery. Board-ready format. Clear scope from day one.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What financial reporting services cover</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Financial reporting is what turns accounting records into useful management information. A well-prepared monthly pack tells management where the business stands relative to budget, where cash is moving, which cost lines are running ahead or behind, and what is driving material variances. When this information arrives late, is incomplete, or requires the reader to interpret raw numbers without commentary, it fails to serve its purpose.</p>
              <p>Our financial reporting service is built around what management and boards actually need from monthly numbers. We produce management accounts, MIS packs, and cash flow reporting that follow your format and your reporting calendar. Variance commentary is written specifically to explain what happened — not just to note that a variance exists — drawing on knowledge of your business that develops over successive reporting periods.</p>
              <p>For businesses that also use us for underlying bookkeeping, financial reports are produced as a natural extension of the monthly close cycle. For businesses with existing in-house or outsourced bookkeeping teams, we can take a trial balance or data export and produce reports from that source. In both cases, all reporting output is reviewed by a qualified Chartered Accountant before delivery.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Who We Help */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Who we work with</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'SMEs and growing businesses', description: 'Businesses that need professional monthly management accounts but do not have a CFO or financial controller to produce them.' },
              { title: 'Investor-backed businesses', description: 'Companies with board members or investors who require regular, structured financial reporting in a consistent format.' },
              { title: 'CPA and advisory firms', description: 'Practices that prepare management accounts for business clients and need reliable production support for the reporting work.' },
              { title: 'Multi-entity and group businesses', description: 'Businesses with multiple subsidiaries or operating entities that need consolidated group reporting alongside individual entity accounts.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-brand-border/60 bg-white p-6">
                <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Challenges */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Financial reporting problems we address</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Reports delivered too late to be useful', description: 'Monthly accounts arriving three to four weeks after month-end, by which time management is already well into the following period.' },
              { title: 'No explanation of the numbers', description: 'Reports that present financial statements without commentary, leaving management to guess what drove the variances.' },
              { title: 'Inconsistent format month to month', description: 'Reports that change structure each period, making period-over-period comparison difficult and reducing confidence in the figures.' },
              { title: 'No budget or forecast integration', description: 'Management accounts that show actuals but no comparison to what was planned, removing the most useful context for decision-making.' },
              { title: 'Cash flow reporting absent or incomplete', description: 'Businesses that monitor P&L closely but have no structured view of cash movement, leaving them exposed to liquidity surprises.' },
              { title: 'KPI reporting disconnected from financials', description: 'Operational metrics tracked separately from financial results, with no integrated monthly view linking business performance to financial outcomes.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-brand-dark text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Scope of Services */}
      <section className="py-16 lg:py-20 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of financial reporting services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following lists the specific reports, schedules, and deliverables available within our financial reporting service. Scope is confirmed at engagement start based on reporting requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Monthly income statement (profit and loss account)',
              'Balance sheet with prior period and budget comparative columns',
              'Cash flow statement — direct or indirect method',
              'Budget versus actual variance report with percentage variances',
              'Variance commentary — written explanation of material movements',
              'Revenue analysis by product, segment, or geography',
              'Cost analysis by department or cost centre',
              'Gross margin analysis and trend schedule',
              'Operating expense schedule by category',
              'AR ageing schedule and debtor days calculation',
              'AP ageing schedule and creditor days calculation',
              'KPI schedule — financial and operational metrics',
              'Cash flow forecast — rolling 13-week or monthly forward view',
              'Working capital movement analysis',
              'Consolidated group accounts across multiple entities',
              'Inter-entity elimination schedule for group reporting',
              'Year-to-date performance summary',
              'Board pack preparation and formatting',
              'Management commentary and narrative for executive reporting',
              'Financial ratio analysis (liquidity, profitability, leverage)',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl border border-brand-border/60 p-4">
                <ChevronRight className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-gray">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Outsource */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why businesses outsource financial reporting</h2>
            <div className="space-y-6">
              {[
                { title: 'Producing management accounts requires specific skills that are distinct from bookkeeping', description: 'Bookkeeping and financial reporting require different skill sets. Many businesses have competent bookkeeping but no one with the experience to translate the ledger into a management pack with proper commentary and analysis.' },
                { title: 'Timeliness is difficult to maintain without dedicated resource', description: 'When reporting is handled by someone with other responsibilities, it is reliably the task that slips. Dedicated reporting support with a fixed turnaround commitment keeps reporting on schedule every period.' },
                { title: 'Format consistency requires discipline and documentation', description: 'Consistent, comparable reports across 12 months require a documented format and coding structure that is maintained by the same team every month. This is easier to achieve with an outsourced team focused on that consistency.' },
                { title: 'Investor and board expectations require professional output', description: 'Once a business has external investors or a formal board, management accounts need to meet a standard that reflects the maturity of the organisation. Outsourcing this to a CA-led team provides that standard without requiring an internal CFO.' },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-brand-green pl-5">
                  <h3 className="font-semibold text-brand-dark mb-1">{item.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Why NextGen BPO */}
      <section className="py-16 lg:py-20 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why clients choose NextGen BPO for financial reporting</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'CA-reviewed before delivery', body: 'Every management pack, MIS report, and financial statement is reviewed by a qualified Chartered Accountant before it is sent. The review covers figures, commentary accuracy, and format — not just the arithmetic.' },
              { heading: 'Commentary that explains, not just describes', body: 'Variance commentary is written by team members familiar with your business, explaining what drove each movement — not just noting that a difference exists. This is the part of financial reporting that requires judgement, and we treat it accordingly.' },
              { heading: 'Fixed format, consistent each month', body: 'Reports follow a format agreed at the start of the engagement and maintained consistently. This allows period-over-period comparison and builds a reporting record that management and investors can rely on.' },
              { heading: 'Works from your data source', body: 'We produce reports from trial balances, accounting software exports, or fully managed ledgers. If you have an existing bookkeeping process, we work from its output. If we also handle bookkeeping, reporting is a natural extension of the close cycle.' },
              { heading: 'Multi-entity and consolidation experience', body: 'We have experience producing consolidated group accounts across multiple entities with inter-company eliminations. Group reporting requirements are scoped and handled as part of the standard reporting engagement.' },
            ].map((item) => (
              <div key={item.heading} className="rounded-2xl border border-brand-border/60 bg-white p-6">
                <h3 className="text-base font-semibold text-brand-dark mb-2">{item.heading}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we deliver financial reporting</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Reporting requirements review', description: 'We review what management or investors need from monthly reports, agree the format, KPIs, and commentary structure, and document these as the reporting specification.' },
              { step: '02', title: 'Data source and close schedule', description: 'We confirm the source data (our own close work or third-party data), agree the month-end data cutoff, and set the turnaround target for first delivery.' },
              { step: '03', title: 'Monthly report production and CA review', description: 'Reports are produced from the agreed data source, reviewed by a CA for accuracy and commentary quality, and delivered in the agreed format by the agreed date.' },
              { step: '04', title: 'Refinement and format development', description: 'Over successive months we refine commentary quality, adjust KPIs as the business changes, and respond to feedback from management or board reviewers.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-brand-border/60 bg-brand-light p-6">
                <span className="text-3xl font-extrabold text-brand-green/30 mb-3 block">{item.step}</span>
                <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-brand-light">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Financial reporting — frequently asked questions</h2>
            <div className="space-y-6">
              {[
                { q: 'What does a monthly MIS pack typically include?', a: 'A standard MIS pack includes an income statement with budget versus actual comparison, balance sheet, cash flow statement, AR and AP ageing summaries, and a variance commentary section explaining material movements. The specific contents are agreed with you at the start of the engagement based on what your management team or board actually uses for decisions.' },
                { q: 'How long after month-end do we receive the financial reports?', a: 'Turnaround depends on when source data is available. For clients where we also handle the underlying bookkeeping, reports are typically delivered within 5 to 7 working days of month-end. For clients where we receive finalised data from a third party, we work to a turnaround agreed during scope discussions.' },
                { q: 'Can you produce financial reports against a budget or forecast?', a: 'Yes. Budget versus actual reporting is a standard component of our management reporting service. You provide the budget figures, and we incorporate them into the monthly report with variance calculations and commentary explaining the key differences. We can also assist with building or updating the budget file if that is a requirement.' },
                { q: 'Do your financial reports follow a specific accounting standard?', a: 'Report format and standard depend on the client requirement. We produce management accounts and MIS packs for internal use, which do not require statutory compliance. For financial statements intended for external purposes, we follow the applicable standard — IFRS, US GAAP, or local Pakistan GAAP — as agreed with the client.' },
                { q: 'Can you produce KPI dashboards alongside financial statements?', a: 'Yes. We produce KPI schedules covering operational and financial metrics relevant to the business. Common KPIs include gross margin percentage, debtor days, creditor days, burn rate, and revenue by segment. The specific KPIs are defined with you at the start and updated each month with the financial report.' },
              ].map((item) => (
                <div key={item.q} className="border border-brand-border/60 rounded-xl bg-white p-6">
                  <h3 className="font-semibold text-brand-dark mb-2">{item.q}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about financial reporting services</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us what your management team or board needs from monthly reporting. We will outline a format and scope that fits your business and reporting calendar.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" asChild>
                <a href={`mailto:${CONTACT.email}`}>
                  Email Us Directly
                  <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
                </a>
              </Button>
              <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20" asChild>
                <Link href="/#contact">Use Contact Form</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Related services</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting including bank reconciliations, AP/AR, month-end close, and management account preparation.' },
              { title: 'Bookkeeping Services', href: '/bookkeeping-services', description: 'Transaction processing, ledger maintenance, and close packs that feed into the monthly reporting cycle.' },
              { title: 'Corporate Advisory Services', href: '/corporate-advisory-services', description: 'Financial modelling, business planning, and management reporting frameworks for growing businesses.' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-brand-border/60 bg-brand-light p-6 hover:border-brand-green/40 transition-colors group">
                <h3 className="font-semibold text-brand-dark mb-2 group-hover:text-brand-green transition-colors">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
