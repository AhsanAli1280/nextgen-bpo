import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Bookkeeping Services | NextGen BPO Solutions',
  description: 'Professional bookkeeping services for SMEs and CPA firms. Bank reconciliations, AP/AR ledger maintenance, month-end journals and close packs with CA-led senior review.',
  alternates: { canonical: 'https://next-genbpo.com/bookkeeping-services' },
  openGraph: {
    title: 'Bookkeeping Services | NextGen BPO Solutions',
    description: 'Professional bookkeeping services for SMEs and CPA firms. Bank reconciliations, AP/AR ledger maintenance, month-end journals and close packs with CA-led senior review.',
    url: 'https://next-genbpo.com/bookkeeping-services',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bookkeeping Services',
  description: 'Professional bookkeeping services covering bank reconciliations, AP/AR ledger maintenance, transaction categorisation, and month-end close packs for businesses and CPA firms.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: ['US', 'GB', 'PK', 'SA'],
  serviceType: 'Bookkeeping',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How often will my books be updated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Transaction frequency is agreed during scope setup. Most clients run weekly or monthly updates depending on transaction volume. Higher-volume businesses typically benefit from weekly processing to keep ledgers current and reconciliations manageable.' },
    },
    {
      '@type': 'Question',
      name: 'What if I have a backlog of unrecorded transactions?',
      acceptedAnswer: { '@type': 'Answer', text: 'Backlog catch-up is a standard part of our onboarding work. We agree the period to be covered, access the relevant bank feeds and source documents, and process the backlog before moving to a regular schedule. Backlogs are quoted separately from ongoing monthly bookkeeping.' },
    },
    {
      '@type': 'Question',
      name: 'Do you categorise transactions based on my chart of accounts or yours?',
      acceptedAnswer: { '@type': 'Answer', text: 'We work to your chart of accounts and your categorisation conventions. At the start of an engagement we document your account structure, any specific categorisation rules, and coding preferences so they are applied consistently from the first month.' },
    },
    {
      '@type': 'Question',
      name: 'Can you handle bookkeeping for multiple entities?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Multi-entity bookkeeping is a common requirement for our clients. Each entity is maintained separately with its own ledger and reconciliations. Intercompany transactions are documented and reconciled as part of the monthly process.' },
    },
    {
      '@type': 'Question',
      name: 'Will my bookkeeping be reviewed before delivery?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All bookkeeping output goes through an internal senior review before it is sent to you. The reviewer checks reconciliations, categorisation, journal entries, and the close pack for completeness and accuracy. You receive reviewed output, not a first draft.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Bookkeeping Services', item: 'https://next-genbpo.com/bookkeeping-services' },
  ],
};

export default function BookkeepingServicesPage() {
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
              Bookkeeping Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Bookkeeping services that are reviewed before they reach you
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We maintain accurate books for businesses and accounting firms — bank reconciliations, AP/AR ledger management, transaction categorisation, and monthly close packs — with a qualified Chartered Accountant reviewing every deliverable before it is sent.
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
            <p className="text-xs text-brand-gray mt-4">Confidential consultation. Defined scope. No commitment to start.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What our bookkeeping service covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Bookkeeping is the foundation of every reliable financial reporting process. When it is done properly — transactions coded correctly, reconciliations completed on schedule, AP and AR maintained accurately — every downstream process works better. Management accounts are cleaner. Tax preparation is faster. Audit queries are fewer. Our bookkeeping service is built to maintain that foundation consistently, every month, without variation in quality.</p>
              <p>We work directly in your accounting software — QuickBooks Online, Xero, Sage, or Excel — using your chart of accounts and your categorisation conventions. We do not impose a generic process on your business. Each engagement begins with a documented scope that covers transaction types, software access, close schedule, and deliverable format. From that point, your bookkeeping runs on a defined schedule with the same team each month.</p>
              <p>For CPA and accounting firms, our bookkeeping service handles production work across your client portfolio. We prepare client-ready bookkeeping packs that your reviewers can work from directly, rather than spending time correcting first-draft output. For businesses, we provide clean, reviewed books that are ready for your accountant, management team, or investor reporting whenever needed.</p>
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
              { title: 'Small and medium businesses', description: 'Businesses that need accurate monthly books maintained by a qualified team without the commitment or cost of a full-time bookkeeper on staff.' },
              { title: 'CPA and accounting firms', description: 'Practices that need reliable bookkeeping production capacity for their client portfolio, delivered to a standard that does not require significant rework before review.' },
              { title: 'Business owners managing growth', description: 'Founders and directors who currently manage their own books but need to hand this off to a professional team as transaction volume and complexity increase.' },
              { title: 'Finance teams needing additional capacity', description: 'Internal finance departments that need bookkeeping support during system transitions, staff gaps, or high-volume periods.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Common bookkeeping problems we address</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Unreconciled bank accounts', description: 'Bank statements that have not been matched to ledger entries for weeks or months, making the true financial position unclear.' },
              { title: 'Miscategorised transactions', description: 'Expenses coded to the wrong account consistently, which distorts management accounts and creates problems at tax preparation time.' },
              { title: 'AP and AR backlogs', description: 'Vendor invoices or customer receipts that are not posted promptly, leaving the business uncertain about what is owed and what is outstanding.' },
              { title: 'Delayed monthly close', description: 'Close packs that are produced two to three weeks after month-end because bookkeeping has not been maintained on a current basis throughout the month.' },
              { title: 'Inconsistent coding between months', description: 'Transaction categorisation that varies month to month depending on who processed the entries, making period-over-period comparisons unreliable.' },
              { title: 'Accumulated historical errors', description: 'Errors from prior months that were never corrected, which have compounded over time and now require a backlog clean-up before current books are reliable.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of bookkeeping services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">Specific deliverables included in our bookkeeping engagements. Scope is confirmed at the start based on your transaction types and reporting requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Bank account reconciliations (all accounts, monthly)',
              'Credit card statement reconciliations and coding',
              'Transaction entry and categorisation to chart of accounts',
              'Accounts payable invoice posting and vendor ledger maintenance',
              'Accounts receivable posting and customer ledger management',
              'AP ageing schedule — outstanding payables by vendor and due date',
              'AR ageing schedule — outstanding receivables by customer and due date',
              'Month-end accruals journal entries (rent, utilities, subscriptions)',
              'Prepayment amortisation journals and prepaid asset schedule',
              'Depreciation journal entries from fixed asset register',
              'Payroll journal entries and reconciliation to payroll reports',
              'Petty cash reconciliation and posting',
              'Inter-entity and intercompany transaction recording',
              'Fixed asset register maintenance (additions, disposals)',
              'Balance sheet account reconciliations (each account tied to sub-ledger or schedule)',
              'Trial balance preparation and tie-out',
              'Monthly close pack — P&L, balance sheet, supporting schedules',
              'Soft close and pre-close checklist management',
              'Historical backlog catch-up and ledger clean-up',
              'Chart of accounts review and restructuring support',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why businesses outsource bookkeeping</h2>
            <div className="space-y-6">
              {[
                { title: 'Time spent on bookkeeping is disproportionate to its value', description: 'Business owners and managers who maintain their own books typically spend 10–20 hours per month on tasks that a trained bookkeeper handles in half the time. That time has a higher-value use.' },
                { title: 'In-house bookkeepers are expensive relative to output', description: 'A part-time or full-time bookkeeper comes with salary, benefits, and software costs, plus the risk of quality variation. Outsourcing provides reviewed output at a lower total cost with no recruitment overhead.' },
                { title: 'Quality control is difficult without a review layer', description: 'A single in-house bookkeeper has no independent reviewer. Errors can persist for months before they surface at year-end or during tax preparation. An outsourced team with a built-in review layer catches errors within the production cycle.' },
                { title: 'Continuity through staff changes', description: 'When a bookkeeper leaves, so does their knowledge of the business, their access credentials, and their undocumented processes. An outsourced engagement maintains documented procedures, consistent team access, and no disruption at handover.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why clients choose NextGen BPO for bookkeeping</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'Reviewed output, not first drafts', body: 'Every bookkeeping deliverable is checked by a qualified CA before it is sent to you. Reconciliations are signed off. Journals are verified. The close pack is complete before delivery. You are not expected to do the quality control.' },
              { heading: 'Your tools, your process', body: 'We work in your accounting software using your chart of accounts and your categorisation rules. Nothing is imposed on your business. The setup documentation we produce at the start of the engagement becomes your permanent process record.' },
              { heading: 'Same team each month', body: 'Your bookkeeping is handled by the same people every month. They know your business, your transactions, and your patterns. This consistency means fewer queries, faster processing, and better catch of anomalies over time.' },
              { heading: 'NDA and access controls from day one', body: 'We operate under a signed NDA and use role-based system access limited to the exact scope of work. Bookkeeping data is handled with the same level of confidentiality your business or clients expect.' },
              { heading: 'Flexible scope as you grow', body: 'Whether you add entities, increase transaction volume, or need to add payroll journals or foreign currency, scope adjustments are handled through a documented change process — no need to start the engagement again.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How a bookkeeping engagement works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Scope and software setup', description: 'We review your chart of accounts, transaction types, and software access. A written scope confirms what is included, at what frequency, and in what format.' },
              { step: '02', title: 'NDA and access configuration', description: 'NDA is signed, role-based access is set up, and the engagement SOP is documented. Historical backlog (if any) is scoped separately.' },
              { step: '03', title: 'Regular processing and review cycle', description: 'Bookkeeping is processed on the agreed schedule. Senior review is completed before each delivery. You receive a close pack with supporting schedules.' },
              { step: '04', title: 'Ongoing refinement', description: 'We flag anomalies, ask targeted queries (not general ones), and adjust scope when your transaction volume or business structure changes.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Bookkeeping services — frequently asked questions</h2>
            <div className="space-y-6">
              {[
                { q: 'How often will my books be updated?', a: 'Transaction frequency is agreed during scope setup. Most clients run weekly or monthly updates depending on transaction volume. Higher-volume businesses typically benefit from weekly processing to keep ledgers current and reconciliations manageable.' },
                { q: 'What if I have a backlog of unrecorded transactions?', a: 'Backlog catch-up is a standard part of our onboarding work. We agree the period to be covered, access the relevant bank feeds and source documents, and process the backlog before moving to a regular schedule. Backlogs are quoted separately from ongoing monthly bookkeeping.' },
                { q: 'Do you categorise transactions based on my chart of accounts or yours?', a: 'We work to your chart of accounts and your categorisation conventions. At the start of an engagement we document your account structure, any specific categorisation rules, and coding preferences so they are applied consistently from the first month.' },
                { q: 'Can you handle bookkeeping for multiple entities?', a: 'Yes. Multi-entity bookkeeping is a common requirement for our clients. Each entity is maintained separately with its own ledger and reconciliations. Intercompany transactions are documented and reconciled as part of the monthly process.' },
                { q: 'Will my bookkeeping be reviewed before delivery?', a: 'Yes. All bookkeeping output goes through an internal senior review before it is sent to you. The reviewer checks reconciliations, categorisation, journal entries, and the close pack for completeness and accuracy. You receive reviewed output, not a first draft.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about bookkeeping services</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your business type, software, and transaction volume. We will provide a clear scope and confirm what is included before anything starts.</p>
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
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting support including month-end close, balance sheet reconciliations, and management reporting.' },
              { title: 'Payroll Processing Services', href: '/payroll-processing-services', description: 'Payroll input processing, gross-to-net calculations, compliance calendars, and payroll journals for accounting integration.' },
              { title: 'Financial Reporting Services', href: '/financial-reporting-services', description: 'Monthly MIS packs, management accounts, variance commentary, and board-ready financial reports.' },
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
