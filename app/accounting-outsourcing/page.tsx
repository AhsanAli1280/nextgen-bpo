import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Accounting Outsourcing Services | NextGen BPO Solutions',
  description: 'CA-led accounting outsourcing for CPA firms, SMEs and growing businesses. Bank reconciliations, AP/AR, month-end close and management reporting with senior review.',
  alternates: { canonical: 'https://next-genbpo.com/accounting-outsourcing' },
  openGraph: {
    title: 'Accounting Outsourcing Services | NextGen BPO Solutions',
    description: 'CA-led accounting outsourcing for CPA firms, SMEs and growing businesses. Bank reconciliations, AP/AR, month-end close and management reporting with senior review.',
    url: 'https://next-genbpo.com/accounting-outsourcing',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Accounting Outsourcing Services',
  description: 'CA-led accounting outsourcing covering bank reconciliations, AP/AR, month-end close, and management reporting for CPA firms, SMEs and growing businesses.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: ['US', 'GB', 'PK', 'SA'],
  serviceType: 'Accounting Outsourcing',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What accounting software does your team work in?',
      acceptedAnswer: { '@type': 'Answer', text: 'We work directly in QuickBooks Online, Xero, Sage, and Microsoft Excel. If you use a different platform, we assess compatibility during scope discussions before starting any engagement.' },
    },
    {
      '@type': 'Question',
      name: 'How is data security handled for outsourced accounting?',
      acceptedAnswer: { '@type': 'Answer', text: 'All engagements are covered by a signed NDA. We use role-based access controls, limit permissions to what is required for the scope, and maintain documented handoff records. No client data is stored outside secured systems.' },
    },
    {
      '@type': 'Question',
      name: 'Will I work with the same person each month?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. You are assigned a named team with a consistent point of contact. We do not rotate staff across engagements, which means no lost context, no retraining, and no disruption to your monthly process.' },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum engagement size for accounting outsourcing?',
      acceptedAnswer: { '@type': 'Answer', text: 'We work with clients from single-entity SMEs through to multi-client CPA firms. Minimum engagement scope is discussed during the initial consultation based on transaction volume and complexity.' },
    },
    {
      '@type': 'Question',
      name: 'Do you handle accounting for businesses outside Pakistan?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We serve clients in the US, UK, Saudi Arabia, and Pakistan. Our team is experienced with US GAAP, UK reporting standards, and local Pakistan accounting requirements depending on client need.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Accounting Outsourcing', item: 'https://next-genbpo.com/accounting-outsourcing' },
  ],
};

export default function AccountingOutsourcingPage() {
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
              Accounting Outsourcing
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Accounting outsourcing with senior Chartered Accountant review built in
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We handle recurring accounting work for CPA firms, growing businesses, and finance teams — bank reconciliations, AP/AR, month-end close, and management reporting — all under qualified CA supervision with a sign-off on every deliverable.
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
            <p className="text-xs text-brand-gray mt-4">Confidential consultation. Clear scope. Senior-reviewed delivery.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What accounting outsourcing covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Accounting outsourcing at NextGen BPO means taking on the full cycle of recurring financial record-keeping and reporting work that your team currently handles in-house. This includes everything from daily transaction processing and bank reconciliations through to month-end close support, balance sheet reconciliations, and management account preparation. The work is performed by our accounting team and reviewed by a qualified Chartered Accountant before any deliverable reaches you.</p>
              <p>Most of our clients come to us because they need consistent, reliable accounting output without the overhead of hiring a full-time in-house resource. For CPA and accounting firms, that means back-office production capacity across a client portfolio. For SMEs and growing businesses, it means having a properly qualified accounting team available at a fraction of the cost of a local hire — with no gaps during holidays, staff turnover, or busy periods.</p>
              <p>Our engagement model is straightforward: we agree on scope, access, and turnaround expectations at the start. From that point, your accounting work runs on a defined schedule, with reviewed deliverables and documented handoffs. You retain full control over the review and sign-off process within your own firm. We are the production engine behind it.</p>
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
              { title: 'CPA and accounting firms', description: 'Firms managing multiple client ledgers who need reliable production capacity for bookkeeping, reconciliations, and close support without expanding in-house headcount.' },
              { title: 'SMEs and growing businesses', description: 'Companies that need monthly accounting maintained to a professional standard but cannot justify a full-time finance hire at their current stage of growth.' },
              { title: 'Finance teams with capacity gaps', description: 'Internal finance departments that need additional bandwidth during peak periods, staff transitions, or system migrations without compromising reporting quality.' },
              { title: 'International businesses with Pakistan operations', description: 'Companies running Pakistan-based entities or back-office functions who need local accounting expertise aligned with their group reporting requirements.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Challenges we solve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Inconsistent monthly close timelines', description: 'Month-end close slipping due to staff workload, absence, or prioritisation issues. We maintain defined close schedules regardless of in-house capacity.' },
              { title: 'Unreconciled ledgers and bank statements', description: 'Backlogs in bank reconciliations and ledger clearing that accumulate over time and create problems at year-end.' },
              { title: 'First-draft quality from junior staff', description: 'Deliverables requiring heavy correction before they are usable. Our output goes through senior review before it reaches you.' },
              { title: 'Overhead of in-house accounting hires', description: 'Recruitment cost, training time, and benefit obligations of a permanent hire that is difficult to scale up or down.' },
              { title: 'Gaps in coverage during peak periods', description: 'Tax season, audit preparation, or year-end creating more work than in-house teams can handle without external support.' },
              { title: 'Lack of documentation and audit trail', description: 'Accounting processes that are undocumented, inconsistently applied, or difficult to hand over to an auditor or new team member.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of accounting outsourcing services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following covers the specific tasks and deliverables included in a typical accounting outsourcing engagement. Actual scope is agreed during initial consultation based on your requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Bank and credit card reconciliations (weekly, monthly)',
              'Accounts payable invoice processing and vendor ledger maintenance',
              'Accounts receivable posting and customer ledger management',
              'AP and AR ageing schedule preparation',
              'Transaction categorisation and chart of accounts maintenance',
              'Month-end journal entries (accruals, prepayments, depreciation)',
              'Trial balance preparation and review',
              'Balance sheet reconciliations by account',
              'Intercompany transaction recording and reconciliation',
              'Fixed asset register maintenance and depreciation schedules',
              'Month-end close pack preparation with supporting schedules',
              'Management accounts preparation (P&L, balance sheet, cash flow)',
              'Variance commentary and exception notes on management accounts',
              'Year-end file preparation and support for external audit',
              'General ledger clean-up and historical backlog catchup',
              'Payroll journal entries and integration with accounting records',
              'Cash flow statement preparation and forecast input',
              'Coordination with external auditors on PBC requests',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why businesses outsource their accounting function</h2>
            <div className="space-y-6">
              {[
                { title: 'Cost structure is more predictable', description: 'Outsourcing converts a largely fixed in-house cost (salary, benefits, office space, software licences) into a variable cost tied to scope and volume. For growing businesses, this is a meaningful structural advantage as revenue fluctuates.' },
                { title: 'Access to qualified capacity that is difficult to recruit', description: 'Recruiting experienced accounting staff locally is competitive and expensive. Outsourcing to a CA-led team gives you access to qualified, reviewed capacity without the hiring cycle or staff retention risk.' },
                { title: 'Process consistency even through staff changes', description: 'When in-house accounting staff leave, processes, knowledge, and documentation often leave with them. An outsourced engagement maintains documented procedures, consistent output, and continuity through any personnel change on your side.' },
                { title: 'Scales to match business activity', description: 'As transaction volume, entity count, or reporting complexity increases, an outsourced team can scale the engagement scope accordingly. Adding a new entity or entering a new market does not require a new hire.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why firms and businesses choose NextGen BPO for accounting outsourcing</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'CA-led delivery with formal sign-off', body: 'Every accounting deliverable is reviewed by a qualified Chartered Accountant before it is sent to you. This is not a quality checkbox — it is a formal part of our production process. No deliverable leaves the team without a senior sign-off.' },
              { heading: 'NDA-backed with documented access controls', body: 'All engagements begin with a signed NDA. We use role-based system access limited to the scope of work, and every data handoff is documented. Your financial data is handled with the same confidentiality standard your clients expect from you.' },
              { heading: 'Named team, consistent each month', body: 'You work with the same accounting team throughout the engagement. No rotating staff, no briefing someone new each month, no lost context between periods. The team learns your client or business and maintains that knowledge continuously.' },
              { heading: 'Built to fit your tools and process', body: 'We work within your existing software — QuickBooks Online, Xero, Sage, or Excel — and follow your chart of accounts, your close schedule, and your reporting format. We adapt to your process, not the other way around.' },
              { heading: 'Firm and business experience across US, UK and Pakistan', body: 'Our team has direct experience supporting CPA firms and businesses operating in US, UK, and Pakistan markets. We understand the reporting standards, compliance contexts, and documentation expectations in each jurisdiction.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we start and run an engagement</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Scope discussion', description: 'We discuss your entity structure, transaction volumes, software, and reporting requirements. You receive a clear written scope before anything starts.' },
              { step: '02', title: 'Access setup and SOP documentation', description: 'Role-based access is configured, NDA is signed, and we document the agreed processes, close schedule, and deliverable formats.' },
              { step: '03', title: 'Reviewed delivery cycle', description: 'Accounting work is performed on your defined schedule, checked internally, and reviewed by a CA before delivery. Each period follows the same documented process.' },
              { step: '04', title: 'Ongoing communication and refinement', description: 'Regular check-ins ensure scope stays accurate as your business or client base evolves. Changes to process or volume are scoped and documented.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about accounting outsourcing</h2>
            <div className="space-y-6">
              {[
                { q: 'What accounting software does your team work in?', a: 'We work directly in QuickBooks Online, Xero, Sage, and Microsoft Excel. If you use a different platform, we assess compatibility during scope discussions before starting any engagement.' },
                { q: 'How is data security handled for outsourced accounting?', a: 'All engagements are covered by a signed NDA. We use role-based access controls, limit permissions to what is required for the scope, and maintain documented handoff records. No client data is stored outside secured systems.' },
                { q: 'Will I work with the same person each month?', a: 'Yes. You are assigned a named team with a consistent point of contact. We do not rotate staff across engagements, which means no lost context, no retraining, and no disruption to your monthly process.' },
                { q: 'What is the minimum engagement size for accounting outsourcing?', a: 'We work with clients from single-entity SMEs through to multi-client CPA firms. Minimum engagement scope is discussed during the initial consultation based on transaction volume and complexity.' },
                { q: 'Do you handle accounting for businesses outside Pakistan?', a: 'Yes. We serve clients in the US, UK, Saudi Arabia, and Pakistan. Our team is experienced with US GAAP, UK reporting standards, and local Pakistan accounting requirements depending on client need.' },
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

      {/* Consultation CTA */}
      <section className="py-16 bg-brand-dark">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about accounting outsourcing</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your entity structure, software, and transaction volume. We will provide a clear scope and engagement proposal within one business day.</p>
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
              { title: 'Bookkeeping Services', href: '/bookkeeping-services', description: 'Day-to-day transaction recording, bank reconciliations, and AP/AR maintenance for businesses and firms.' },
              { title: 'Financial Reporting Services', href: '/financial-reporting-services', description: 'Monthly MIS packs, financial statements, variance analysis, and board-ready management reports.' },
              { title: 'CPA Firm Support', href: '/cpa-firm-support', description: 'Dedicated back-office production capacity for CPA and accounting firms across their full client portfolio.' },
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
