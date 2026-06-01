import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'CPA Firm Support Services | NextGen BPO Solutions',
  description: 'Dedicated back-office support for CPA firms. CA-led bookkeeping production, workpaper prep, tax season capacity, and client onboarding — reviewed before delivery.',
  alternates: { canonical: 'https://next-genbpo.com/cpa-firm-support' },
  openGraph: {
    title: 'CPA Firm Support Services | NextGen BPO Solutions',
    description: 'Dedicated back-office support for CPA firms. CA-led bookkeeping production, workpaper prep, tax season capacity, and client onboarding — reviewed before delivery.',
    url: 'https://next-genbpo.com/cpa-firm-support',
    type: 'website',
    siteName: 'NextGen BPO Solutions',
    locale: 'en_US',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'CPA Firm Support Services',
  description: 'CA-led back-office support for CPA and accounting firms covering bookkeeping production, workpaper preparation, tax season capacity, and client portfolio management.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: ['US', 'GB', 'PK', 'SA'],
  serviceType: 'CPA Firm Support',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How quickly can you onboard a new CPA firm client?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most firms, onboarding takes three to five business days. This includes scope documentation, NDA execution, system access setup, and an initial briefing on your review process and deliverable formats. We work fast during tax season when you need capacity in place quickly.' },
    },
    {
      '@type': 'Question',
      name: 'Can you work within our firm\'s existing software and document management system?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We adapt to your existing tools — QuickBooks, Xero, Sage, Drake, CCH, UltraTax, SharePoint, or a custom portal. We follow your chart of accounts, your file naming conventions, and your review workflow rather than imposing our own structure.' },
    },
    {
      '@type': 'Question',
      name: 'How do you handle confidentiality across a multi-client firm portfolio?',
      acceptedAnswer: { '@type': 'Answer', text: 'Each client engagement is handled with strict data separation. All work is covered by a master NDA with your firm. Access is role-based and limited to the specific client files in scope. No client data is shared between engagements or stored outside secured systems.' },
    },
    {
      '@type': 'Question',
      name: 'Do you prepare tax returns, or only support the preparation process?',
      acceptedAnswer: { '@type': 'Answer', text: 'We prepare the supporting workpapers, schedules, source document organisation, prior-year comparisons, and input data for returns. Final return preparation and filing remains with your licensed preparers and signing CPAs. We are the production engine that feeds your review process.' },
    },
    {
      '@type': 'Question',
      name: 'What is the typical engagement model for CPA firm support?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most firms engage us on a monthly retainer covering a defined client portfolio, with capacity to scale during tax season. We also work on project engagements — for example, a one-off backlog clean-up or new client onboarding sprint. We agree structure, scope, and turnaround at the start.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'CPA Firm Support', item: 'https://next-genbpo.com/cpa-firm-support' },
  ],
};

export default function CpaFirmSupportPage() {
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
              CPA Firm Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              CPA firm support services with review-ready deliverables
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We provide dedicated back-office capacity for CPA and accounting firms — bookkeeping production, workpaper preparation, tax season surge support, and client onboarding — all delivered under Chartered Accountant supervision with senior sign-off before anything reaches your team.
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
            <p className="text-xs text-brand-gray mt-4">Confidential. NDA-backed. Built for multi-client firm environments.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What CPA firm support covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>CPA firms face a structural tension: the work that generates revenue — audit, advisory, tax strategy, client relationships — requires partner and senior manager time, but that time is constantly absorbed by production work. Bookkeeping, document organisation, workpaper filing, prior-year reviews, and client data preparation are necessary but do not require a CPA-level eye on every step. Our role is to take that production layer off your team&apos;s plate.</p>
              <p>We operate as an extension of your firm&apos;s back office. Your clients remain yours. Your review process, your sign-off, your relationship. We handle the preparation work that feeds your review queue — organised, checked, and documented to the standard your firm expects. Partners and managers spend their time on the work that actually requires their expertise.</p>
              <p>Our team has worked with CPA firms in the US and UK, which means we understand the pace of tax season, the documentation standards for audit and review engagements, and the multi-client workflow that characterises a busy practice. We adapt to your tools, your formats, and your turnaround expectations from day one.</p>
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
              { title: 'CPA practices with high production volume', description: 'Firms handling large bookkeeping and tax preparation workloads across a client portfolio who need reliable back-office capacity without expanding in-house headcount.' },
              { title: 'Tax practices managing seasonal peaks', description: 'Firms that need additional preparation support from January through April and during extension season, without the risk and overhead of temporary hires.' },
              { title: 'Growing firms adding new clients', description: 'Practices that are onboarding new clients faster than their current team can absorb, and need a structured support function to maintain quality across the portfolio.' },
              { title: 'Partners focused on advisory and client management', description: 'Firms where partners want to spend time on high-value advisory and relationship work rather than supervising bookkeeping production and document organisation.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Challenges we solve for CPA firms</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Partner time consumed by production work', description: 'Senior staff spending hours on bookkeeping, document chasing, and file organisation that does not require their level of expertise or billing rate.' },
              { title: 'Tax season bottlenecks and backlog build-up', description: 'Work piling up from January to April with no capacity to scale quickly, leading to missed deadlines and stressed teams.' },
              { title: 'Inconsistent workpaper quality from junior staff', description: 'Workpapers and preparation files arriving in review with missing schedules, unresolved queries, or formatting inconsistencies that require rework.' },
              { title: 'Client onboarding taking longer than expected', description: 'New client files that take weeks to bring into order because there is no dedicated resource to clean up prior-period data and establish a baseline.' },
              { title: 'Staff turnover disrupting client continuity', description: 'When bookkeeping or support staff leave, client knowledge and process documentation leave with them, creating gaps that are expensive to fill.' },
              { title: 'Difficulty scaling during growth without proportional hiring', description: 'Adding five new clients requires five months of hiring, onboarding, and training — a cycle that breaks the economics of firm growth.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of CPA firm support services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following lists the specific tasks and deliverables included in CPA firm support engagements. Actual scope is agreed based on your firm&apos;s client mix, volume, and workflow requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Bookkeeping production for monthly and quarterly client engagements',
              'Bank and credit card reconciliations across client ledgers',
              'AP and AR ledger maintenance and ageing schedules per client',
              'Transaction categorisation and chart of accounts maintenance',
              'Month-end close support and close pack preparation per client',
              'Trial balance review and ledger clean-up',
              'Prior-year tax return review and year-over-year comparison schedules',
              'Source document collection, sorting, and file organisation',
              'Income and deduction schedule preparation for tax workpapers',
              'K-1, 1099, W-2, and 1098 reconciliation and cross-referencing',
              'Depreciation schedule maintenance and fixed asset roll-forwards',
              'Workpaper file preparation, indexing, and formatting',
              'Missing document and query list preparation per client file',
              'Client onboarding data migration and historical ledger clean-up',
              'Engagement status tracking and turnaround reporting by client',
              'Payroll journal preparation and integration with client accounting records',
              'Balance sheet reconciliation schedules per account',
              'Year-end file preparation for audit or review engagements',
              'Multi-entity consolidation support for group client files',
              'Client communication drafts for document requests and outstanding items',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why CPA firms use outsourced back-office support</h2>
            <div className="space-y-6">
              {[
                { title: 'The economics of in-house production staff do not scale', description: 'For every new client, a firm needs more preparation time. Hiring in-house means recruiting, onboarding, benefits, and managing utilisation — a model that only works at significant scale. Outsourcing converts that fixed overhead into a variable cost tied directly to your client volume.' },
                { title: 'Tax season creates demand that cannot be predicted or absorbed in-house', description: 'A firm cannot hire precisely for an eight-week peak and release staff at the end of it. The result is either chronic overstaffing or reliance on temporary staff who lack firm context. An outsourced support team provides reliable capacity that scales to your actual workload.' },
                { title: 'Production quality gates your firm\'s reputation', description: 'Partners review what they are given. If workpapers arrive incomplete, bank reconciliations have gaps, or source documents are disorganised, the review process is slower and more expensive. A properly supported production layer means partners spend their time reviewing, not fixing.' },
                { title: 'Confidential handling is standard practice', description: 'Professional outsourcing firms working with CPA practices operate under NDA, with client-level data separation, access controls, and documented handoff records. This is the same standard that firms apply when using any external service provider handling client financial data.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why CPA firms choose NextGen BPO for back-office support</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'CA-led team — not a generic BPO', body: 'Our work is supervised by qualified Chartered Accountants who understand how accounting firms operate. Deliverables are prepared to firm standards, not a generic checklist. We know what a well-prepared workpaper looks like and what a partner review expects to see.' },
              { heading: 'Senior sign-off on every deliverable', body: 'Nothing leaves our team without a senior review. Workpapers are checked for completeness, bank reconciliations are tied out, and schedules are cross-referenced before they reach your review queue. Your partners receive production-ready work.' },
              { heading: 'NDA-backed with client-level data separation', body: 'Every engagement is covered by a master NDA. Client files are handled with strict access controls and separation between engagements. This is standard practice in how we work — not an optional add-on.' },
              { heading: 'Consistent named team throughout the engagement', body: 'You work with the same people month after month. They know your firm\'s preferences, your clients\' histories, and your review process. No briefing someone new every tax season, no knowledge loss between periods.' },
              { heading: 'We adapt to your process, not the other way around', body: 'We work in your software, follow your file structure, use your workpaper templates, and communicate through your preferred channels. Firms do not need to change how they operate to work with us.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we start working with a CPA firm</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Firm and portfolio assessment', description: 'We discuss your client mix, production volumes, software stack, and current pain points. You receive a written scope proposal before any engagement begins.' },
              { step: '02', title: 'NDA, access setup, and SOP documentation', description: 'Master NDA is signed, system access is configured with role-based controls, and we document your workpaper formats, deliverable standards, and turnaround requirements.' },
              { step: '03', title: 'Supervised production delivery', description: 'Work begins according to the agreed schedule. All output goes through our internal review process before it enters your review queue. First-period output is treated as a quality benchmark.' },
              { step: '04', title: 'Ongoing refinement and capacity management', description: 'Monthly check-ins keep scope accurate as your client portfolio changes. Tax season capacity is agreed in advance so there are no surprises during your peak periods.' },
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

      {/* Industries */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Client industries we support through CPA firms</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Professional services and consultancies', 'Real estate and property investment', 'Healthcare practices and medical groups', 'E-commerce and technology businesses', 'Construction and contracting', 'Hospitality and food service'].map((industry) => (
              <div key={industry} className="rounded-xl border border-brand-border/60 bg-white p-4 text-sm text-brand-gray font-medium">{industry}</div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about CPA firm support</h2>
            <div className="space-y-6">
              {[
                { q: 'How quickly can you onboard a new CPA firm client?', a: 'For most firms, onboarding takes three to five business days. This includes scope documentation, NDA execution, system access setup, and an initial briefing on your review process and deliverable formats. We work fast during tax season when you need capacity in place quickly.' },
                { q: 'Can you work within our firm\'s existing software and document management system?', a: 'Yes. We adapt to your existing tools — QuickBooks, Xero, Sage, Drake, CCH, UltraTax, SharePoint, or a custom portal. We follow your chart of accounts, your file naming conventions, and your review workflow rather than imposing our own structure.' },
                { q: 'How do you handle confidentiality across a multi-client firm portfolio?', a: 'Each client engagement is handled with strict data separation. All work is covered by a master NDA with your firm. Access is role-based and limited to the specific client files in scope. No client data is shared between engagements or stored outside secured systems.' },
                { q: 'Do you prepare tax returns, or only support the preparation process?', a: 'We prepare the supporting workpapers, schedules, source document organisation, prior-year comparisons, and input data for returns. Final return preparation and filing remains with your licensed preparers and signing CPAs. We are the production engine that feeds your review process.' },
                { q: 'What is the typical engagement model for CPA firm support?', a: 'Most firms engage us on a monthly retainer covering a defined client portfolio, with capacity to scale during tax season. We also work on project engagements — for example, a one-off backlog clean-up or new client onboarding sprint. We agree structure, scope, and turnaround at the start.' },
              ].map((item) => (
                <div key={item.q} className="border border-brand-border/60 rounded-xl bg-brand-light p-6">
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about CPA firm support</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your client count, your software, and where the production bottleneck is. We will scope a support model that fits your firm within one business day.</p>
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
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting outsourcing for businesses and firms — reconciliations, close support, AP/AR, and management reporting with CA review.' },
              { title: 'Audit Firm Support', href: '/audit-firm-support', description: 'Back-office support for audit practices — PBC preparation, audit file organisation, confirmations, and fieldwork assistance.' },
              { title: 'US Tax Preparation Support', href: '/us-tax-preparation-support', description: 'Source document organisation, prior-year reviews, and preparer-ready workpaper packages for US individual and business returns.' },
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
