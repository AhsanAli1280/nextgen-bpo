import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Offshore Accounting Staffing Services | NextGen BPO Solutions',
  description: 'Dedicated offshore accounting staff for CPA firms, accounting practices, and finance teams. Named, qualified resources on defined workflows with CA supervision and reviewed delivery.',
  alternates: { canonical: 'https://next-genbpo.com/offshore-accounting-staffing' },
  keywords: ['offshore accounting staffing', 'dedicated offshore accountant', 'accounting staff outsourcing', 'offshore accounting resources', 'accounting team outsourcing', 'remote accounting staff', 'offshore CPA support', 'offshore bookkeeper', 'accounting capacity outsourcing'],
  openGraph: {
    title: 'Offshore Accounting Staffing Services | NextGen BPO Solutions',
    description: 'Dedicated offshore accounting staff for CPA firms and finance teams. Named, qualified resources with defined workflows and CA-led supervision.',
    url: 'https://next-genbpo.com/offshore-accounting-staffing',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Offshore Accounting Staffing Services',
  description: 'Dedicated offshore accounting staff for CPA firms, accounting practices, and finance teams, providing named, qualified resources on defined workflows with CA supervision.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'United Kingdom' }, { '@type': 'Country', name: 'Saudi Arabia' }, { '@type': 'Country', name: 'Pakistan' }],
  serviceType: 'Offshore Accounting Staffing',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between offshore accounting staffing and general outsourcing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Offshore accounting staffing means a named, dedicated resource — or a defined small team — is assigned exclusively to your firm and works on your client base or internal finance function on an ongoing basis. General outsourcing typically means work is processed through a shared team. The staffing model gives you continuity, client-specific knowledge, and a consistent working relationship rather than a rotating pool of processors.' },
    },
    {
      '@type': 'Question',
      name: 'What qualifications do offshore accounting staff hold?',
      acceptedAnswer: { '@type': 'Answer', text: 'Resources provided through our staffing service hold accounting qualifications or are working toward professional certification, with direct experience in the relevant accounting disciplines. All offshore staff work under the supervision of our CA-qualified team leads, and all output is reviewed before delivery. We do not place junior or unqualified staff without a supervised structure around them.' },
    },
    {
      '@type': 'Question',
      name: 'How does communication and workflow management work with offshore staff?',
      acceptedAnswer: { '@type': 'Answer', text: 'Offshore staff integrate into your workflow using your preferred tools — whether that is email, Microsoft Teams, Slack, or a project management platform. They follow your deadlines, your file formats, and your review process. We establish a clear protocol for task assignment, progress reporting, and escalation at the start of each engagement.' },
    },
    {
      '@type': 'Question',
      name: 'What happens if the assigned staff member leaves or is unavailable?',
      acceptedAnswer: { '@type': 'Answer', text: 'Unlike a direct hire, attrition risk sits with us, not with you. If an assigned team member leaves or is unavailable for an extended period, we are responsible for providing a trained replacement who is briefed on your engagement. Client knowledge is documented internally so continuity is not dependent on a single individual.' },
    },
    {
      '@type': 'Question',
      name: 'Can offshore staff work to our firm\'s deadlines and peak periods?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Offshore staff assigned to your firm work according to your deadline schedule. For firms with seasonal peaks such as tax season or year-end, we plan capacity around those periods. Workload expectations and peak-period protocols are agreed in writing at the start of the engagement.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Offshore Accounting Staffing', item: 'https://next-genbpo.com/offshore-accounting-staffing' },
  ],
};

export default function OffshoreAccountingStaffingPage() {
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
              Offshore Accounting Staffing
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Dedicated offshore accounting staff for firms that need consistent, qualified capacity
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We provide named offshore accounting resources assigned exclusively to your firm — qualified, supervised, and working within your processes and deadlines. This is not a shared service or a rotating team. Your dedicated resource learns your clients, follows your standards, and integrates into your workflow on an ongoing basis.
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
            <p className="text-xs text-brand-gray mt-4">Named resource. Defined workflow. CA-supervised delivery.</p>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What offshore accounting staffing means in practice</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Offshore accounting staffing is the arrangement in which one or more qualified accounting resources are allocated specifically to your firm on an ongoing basis, rather than your work being distributed through a shared production pool. The distinction matters significantly in practice: a dedicated resource builds knowledge of your clients, learns your review preferences, adapts to your file formats, and becomes familiar with the specific patterns and issues that arise in your work — knowledge that a rotating team cannot accumulate.</p>
              <p>At NextGen BPO, all offshore staff operate under CA supervision. This means that while your dedicated resource handles the day-to-day production work — bookkeeping, reconciliations, workpaper preparation, data entry, or reporting — there is a qualified Chartered Accountant at our end reviewing the output before it reaches your firm. You get the efficiency and cost benefit of an offshore resource without accepting the quality risk of unsupervised output.</p>
              <p>Offshore staffing engagements with NextGen BPO are structured with clearly defined scope, agreed workflows, communication protocols, and deadline expectations set out in writing before any work begins. If a staff member leaves or is unavailable, continuity is our responsibility — we replace and brief a qualified alternative rather than leaving you to manage the disruption. This is the key structural advantage over a direct offshore hire.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Who We Help */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Who uses offshore accounting staffing</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'CPA and accounting firms scaling their practice', description: 'Firms that are growing faster than they can hire locally, needing one or more dedicated offshore resources to handle production work while partners focus on review and client relationships.' },
              { title: 'Accounting practices with recurring overflow', description: 'Established practices that regularly have more production work than their current team can handle during busy periods, needing a consistent offshore resource rather than ad hoc outsourcing.' },
              { title: 'Finance teams supplementing in-house capacity', description: 'Internal finance departments that need additional qualified resource for specific functions — accounts payable, reconciliations, or reporting preparation — without adding a permanent headcount.' },
              { title: 'Firms transitioning to a remote-first model', description: 'Practices building a distributed team model who want offshore accounting staff integrated into their workflow alongside domestic remote staff, rather than treating offshore as a separate, disconnected function.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-brand-border/60 bg-white p-6">
                <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Challenges */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Capacity and staffing challenges we solve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Local accounting staff are difficult and expensive to recruit', description: 'Qualified accounting staff in the US, UK, and Australia command salaries that are out of reach for many small and mid-size practices. Offshore staffing provides qualified capacity at a fundamentally different cost point.' },
              { title: 'Attrition disrupts client service and process', description: 'When an in-house accounting team member leaves, the firm absorbs the recruitment cost, the training time, and the knowledge loss. With offshore staffing, continuity is our operational responsibility.' },
              { title: 'Seasonal peaks create unsustainable workloads', description: 'Tax season and year-end reporting create bottlenecks that push in-house staff beyond sustainable capacity. A dedicated offshore resource handles the production volume while your local team maintains the review function.' },
              { title: 'Shared outsourcing teams lack client context', description: 'When work flows through a shared team, every return or ledger starts from scratch. A dedicated resource builds and retains the client-specific context that reduces turnaround time and improves accuracy over time.' },
              { title: 'New service lines require production capacity', description: 'Firms launching new service offerings — management accounts, bookkeeping, or payroll — need production capacity to deliver at scale. A dedicated offshore resource provides that capacity without a domestic headcount commitment.' },
              { title: 'Compliance risk from unsupervised offshore resources', description: 'Direct offshore hires without a review structure create quality risk that is difficult to manage at distance. Our CA supervision layer means output is reviewed before it reaches your firm.' },
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

      {/* Scope */}
      <section className="py-16 lg:py-20 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-4">What offshore accounting staff can handle for your firm</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">Offshore resources are allocated based on the specific functions your firm needs covered. Scope is agreed at engagement start and can be adjusted as your requirements change.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Daily transaction processing and ledger maintenance',
              'Bank and credit card reconciliations (all accounts)',
              'Accounts payable invoice processing and approval workflow support',
              'Accounts receivable posting and customer account maintenance',
              'Month-end journal entries (accruals, prepayments, depreciation)',
              'Trial balance preparation and balance sheet account reconciliations',
              'Month-end close pack preparation to firm-standard format',
              'Management account preparation (P&L, balance sheet, cash flow)',
              'Fixed asset register updates and depreciation schedule maintenance',
              'Payroll data processing and payroll journal preparation',
              'US tax return workpaper preparation and data entry',
              'Workpaper organisation and file preparation for audit or review',
              'Client onboarding support — historical data entry and clean-up',
              'AP and AR ageing schedule preparation and exception reporting',
              'Intercompany reconciliation and elimination support',
              'Variance analysis and exception commentary for management reports',
              'Cash flow statement preparation and forecast support',
              'Year-end file preparation and PBC schedule responses',
              'KPI schedule and management dashboard preparation',
              'Data migration support between accounting platforms',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why dedicated offshore staffing outperforms shared outsourcing</h2>
            <div className="space-y-6">
              {[
                { title: 'Knowledge retention compounds over time', description: 'A dedicated resource assigned to the same client base month after month accumulates knowledge that meaningfully reduces preparation time, reduces errors, and improves the quality of output. A rotating shared team resets this context with every assignment.' },
                { title: 'Workflow integration is cleaner and more consistent', description: 'A named offshore resource who communicates directly with your team, follows your tools, and attends your briefings integrates into your practice as a functional team member rather than a separate vendor. This makes the arrangement more productive and easier to manage.' },
                { title: 'Cost structure is more flexible than a local hire', description: 'An offshore resource can be scaled to the scope and hours required. You are not committed to a full-time salary, benefits, and office cost for a function that may need 60 or 80 percent of a full-time resource.' },
                { title: 'Continuity is managed by the provider', description: 'Staff turnover, leave, and availability is our operational problem, not yours. A direct offshore hire leaves you managing those issues at distance, often with limited legal recourse and significant disruption to your client service.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why firms choose NextGen BPO for offshore accounting staffing</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'CA supervision on all output', body: 'Every offshore resource operates within a supervised structure. A qualified Chartered Accountant reviews the work before it reaches your review queue. This is not common in direct offshore hire arrangements and is a material quality difference.' },
              { heading: 'Named, consistent resources — not a rotating pool', body: 'You know who is working on your firm. The same person is assigned to your engagement, building the client-specific knowledge and process familiarity that makes them more effective over time.' },
              { heading: 'Continuity is our responsibility', body: 'If your assigned resource is unavailable, we are responsible for replacing them with a trained alternative who is briefed on your engagement. Client knowledge is documented internally so transitions are managed without disruption to your delivery.' },
              { heading: 'Works in your tools and follows your process', body: 'Offshore staff work in your accounting software, follow your close schedule, use your file naming conventions, and communicate through your preferred platform. We adapt to your process rather than asking you to manage a separate vendor workflow.' },
              { heading: 'NDA-backed with documented access controls', body: 'All offshore staff operate under signed confidentiality agreements. System access is role-based and restricted to what is required for the assigned scope. Access is documented and revocable at any point.' },
            ].map((item) => (
              <div key={item.heading} className="rounded-2xl border border-brand-border/60 bg-white p-6">
                <h3 className="text-base font-semibold text-brand-dark mb-2">{item.heading}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we set up an offshore staffing engagement</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Needs assessment', description: 'We discuss the functions you need covered, the volume of work, your software, your deadlines, and how the offshore resource will integrate with your team.' },
              { step: '02', title: 'Resource allocation and setup', description: 'A named resource is allocated to your engagement. NDA is signed, access is configured, and the scope of work, communication protocol, and delivery standard are documented.' },
              { step: '03', title: 'Supervised production', description: 'Your offshore resource works on your assigned scope, with CA review before delivery. The first few weeks include additional check-ins to ensure quality standards are met and the workflow is working correctly.' },
              { step: '04', title: 'Ongoing management and adjustment', description: 'Regular review of scope, output quality, and workload. Adjustments to the engagement scope as your firm grows or your requirements change, without requiring a new onboarding cycle.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about offshore accounting staffing</h2>
            <div className="space-y-6">
              {[
                { q: 'What is the difference between offshore accounting staffing and general outsourcing?', a: 'Offshore accounting staffing means a named, dedicated resource is assigned exclusively to your firm on an ongoing basis. General outsourcing typically means work is processed through a shared team. The staffing model gives you continuity, client-specific knowledge, and a consistent working relationship.' },
                { q: 'What qualifications do offshore accounting staff hold?', a: 'Resources hold accounting qualifications or are working toward professional certification, with direct experience in relevant accounting disciplines. All offshore staff work under CA-qualified supervision, and output is reviewed before delivery. We do not place junior or unqualified staff without a supervised structure.' },
                { q: 'How does communication and workflow management work with offshore staff?', a: 'Offshore staff integrate into your workflow using your preferred tools — whether email, Microsoft Teams, Slack, or a project management platform. They follow your deadlines, file formats, and review process. Communication protocols are established at engagement start.' },
                { q: "What happens if the assigned staff member leaves or is unavailable?", a: "Unlike a direct hire, attrition risk sits with us. If an assigned team member leaves or is unavailable, we provide a trained replacement briefed on your engagement. Client knowledge is documented internally so continuity is not dependent on a single individual." },
                { q: "Can offshore staff work to our firm's deadlines and peak periods?", a: "Yes. Offshore staff work according to your deadline schedule. For firms with seasonal peaks such as tax season or year-end, we plan capacity around those periods. Peak-period protocols are agreed in writing at the start of the engagement." },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about dedicated offshore accounting staff</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your firm size, the functions you need covered, and your current capacity situation. We will outline a staffing model that fits your requirements.</p>
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

      {/* Related */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Related services</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting outsourcing for CPA firms and businesses, covering month-end close, reconciliations, and management reporting.' },
              { title: 'CPA Firm Support', href: '/cpa-firm-support', description: 'Dedicated production support for CPA firms across bookkeeping, tax workpapers, client onboarding, and reviewer handoff.' },
              { title: 'Audit Firm Support', href: '/audit-firm-support', description: 'Workpaper organisation, PBC tracking, schedule preparation, and audit file support for audit firms and their teams.' },
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
