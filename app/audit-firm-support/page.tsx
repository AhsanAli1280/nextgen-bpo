import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Audit Firm Support Services | NextGen BPO Solutions',
  description: 'Back-office support for audit practices. CA-led PBC preparation, audit file organisation, confirmation management, and fieldwork assistance — reviewed before delivery.',
  alternates: { canonical: 'https://next-genbpo.com/audit-firm-support' },
  openGraph: {
    title: 'Audit Firm Support Services | NextGen BPO Solutions',
    description: 'Back-office support for audit practices. CA-led PBC preparation, audit file organisation, confirmation management, and fieldwork assistance — reviewed before delivery.',
    url: 'https://next-genbpo.com/audit-firm-support',
    type: 'website',
    siteName: 'NextGen BPO Solutions',
    locale: 'en_US',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Audit Firm Support Services',
  description: 'CA-led back-office support for audit practices including PBC preparation, audit file organisation, confirmation management, and fieldwork assistance.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: ['US', 'GB', 'PK', 'SA'],
  serviceType: 'Audit Firm Support',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of audit engagements do you support?',
      acceptedAnswer: { '@type': 'Answer', text: 'We support financial statement audits, reviews, compilations, agreed-upon procedures, and internal audit engagements. Our support covers preparation work across all phases — planning, fieldwork, and completion — rather than the auditor judgement and opinion-forming steps, which remain with your licensed auditors.' },
    },
    {
      '@type': 'Question',
      name: 'How do you maintain audit independence requirements?',
      acceptedAnswer: { '@type': 'Answer', text: 'We perform preparation and administrative support tasks, not audit procedures. All substantive testing, analytical procedures, professional judgements, and conclusions remain with your licensed audit staff. We do not perform work that would compromise your team\'s independence from audit clients.' },
    },
    {
      '@type': 'Question',
      name: 'Can you help with PBC list follow-up with audit clients?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We prepare the initial PBC list from the audit programme, track document receipts, maintain a status log of outstanding items, and draft follow-up communication for your audit team to review and send. We do not communicate directly with audit clients; all client-facing correspondence is issued by your team.' },
    },
    {
      '@type': 'Question',
      name: 'Do you work within our audit software platform?',
      acceptedAnswer: { '@type': 'Answer', text: 'We work within platforms including CaseWare, TeamMate, ProSystem fx Engagement, and standard office-based document management. If you have a proprietary audit file system, we discuss access and workflow requirements during the scoping phase before any engagement begins.' },
    },
    {
      '@type': 'Question',
      name: 'How is audit client confidentiality managed?',
      acceptedAnswer: { '@type': 'Answer', text: 'All work is covered by a master NDA with your firm. Audit client files are handled with strict access controls, client-level data separation, and documented handoff records. We understand the confidentiality standards applied in audit practice and operate accordingly.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Audit Firm Support', item: 'https://next-genbpo.com/audit-firm-support' },
  ],
};

export default function AuditFirmSupportPage() {
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
              Audit Firm Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Audit firm support services for preparation, file organisation, and fieldwork assistance
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We provide preparation-phase support for audit and assurance practices — PBC list preparation, audit file organisation, confirmation management, and fieldwork documentation — delivered by a CA-led team with senior review before every handoff to your auditors.
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
            <p className="text-xs text-brand-gray mt-4">Independence-aware support. Confidential. Reviewed before delivery.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What audit firm support covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Audit engagements involve substantial preparation work that runs parallel to — but is distinct from — the professional judgement and testing procedures that define audit practice. Collecting and organising client-provided documents, preparing PBC lists from the audit programme, indexing audit files, tracking outstanding confirmations, and maintaining fieldwork documentation are all time-consuming tasks that do not require an auditor to perform them. Our role is to handle this preparation layer so your audit staff can concentrate on audit procedures.</p>
              <p>We work within your audit file structure and follow your documentation standards. Whether you use CaseWare, TeamMate, ProSystem fx Engagement, or a structured folder system, our team prepares files to your format and to a standard that is ready for your auditors to pick up and work from. All preparation work is reviewed by a Chartered Accountant before it enters your team&apos;s workflow.</p>
              <p>We maintain clear boundaries around audit independence. We do not perform audit procedures, draw professional conclusions, or communicate directly with audit clients. Auditor judgements, substantive testing, analytical review, and the opinion-forming process remain entirely with your licensed audit staff. We provide the documented, organised, reviewed preparation work that supports them.</p>
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
              { title: 'Audit and assurance practices', description: 'Firms conducting financial statement audits, reviews, and compilations who need preparation-phase support across a client portfolio without adding audit staff headcount.' },
              { title: 'Internal audit departments', description: 'In-house internal audit teams that need additional documentation, file organisation, and control testing support during annual audit cycles or specific risk reviews.' },
              { title: 'CPA firms with audit and assurance lines', description: 'Practices that offer both tax and audit services and need back-office support that understands the different documentation standards and confidentiality requirements of each engagement type.' },
              { title: 'Mid-size firms managing concurrent audit engagements', description: 'Firms running multiple audits simultaneously during peak season who need a reliable preparation team that can manage several client files at once without quality trade-offs.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Challenges we solve for audit practices</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Auditor time absorbed by document chasing', description: 'Senior audit staff spending hours following up on PBC items, organising client documents, and preparing files that should arrive ready to work from.' },
              { title: 'Audit files arriving incomplete or disorganised', description: 'Client-provided documents that require sorting, indexing, and cross-referencing before audit work can begin — a task that blocks fieldwork progress.' },
              { title: 'Confirmation tracking falling behind schedule', description: 'Bank confirmations, debtor and creditor confirmations, and legal letters going untracked, with no clear status of what has been sent, received, or escalated.' },
              { title: 'Workpaper filing inconsistencies across the team', description: 'Audit files completed in different formats by different staff, requiring senior review time to standardise before the file is ready for partner sign-off.' },
              { title: 'Fieldwork bottlenecks during busy audit seasons', description: 'Multiple concurrent audit engagements creating backlogs in documentation, file preparation, and administrative tracking during December-March and other peak periods.' },
              { title: 'Preparation rework consuming billable time', description: 'Auditors spending time correcting file organisation, reformatting schedules, or regenerating missing documents that should have been collected during the planning phase.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of audit firm support services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following lists specific tasks and deliverables included in audit firm support engagements. All preparation work is reviewed by a senior before entering your audit team&apos;s workflow.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'PBC (Prepared by Client) list preparation from audit programme',
              'PBC document receipt tracking and status log maintenance',
              'Outstanding PBC item follow-up draft communications for auditor review',
              'Client document organisation, naming, and file indexing',
              'Bank confirmation letter preparation and tracking register',
              'Debtor and creditor confirmation preparation and receipt log',
              'Legal confirmation tracking and status maintenance',
              'Audit file setup and workpaper folder structure preparation',
              'Prior-year audit file review and year-over-year comparison schedules',
              'Lead schedule and sub-schedule preparation from client trial balance',
              'Fixed asset roll-forward and depreciation schedule preparation',
              'Prepaid expenses and accrued liabilities schedule preparation',
              'Bank reconciliation review and tie-out for audit purposes',
              'Accounts receivable ageing analysis and cut-off testing support',
              'Accounts payable ageing and cut-off testing support schedules',
              'Inventory listing and count sheet organisation',
              'Revenue and expense analytical review schedule preparation',
              'Payroll expense reconciliation to payroll records',
              'Related party transaction listing and documentation support',
              'Audit completion checklist and file assembly for partner review',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why audit practices use outsourced preparation support</h2>
            <div className="space-y-6">
              {[
                { title: 'Audit staff billing rates are too high for preparation work', description: 'When a senior auditor spends three hours indexing client documents and preparing lead schedules, that cost cannot be recovered on the audit fee. Preparation work done by a qualified, lower-cost support team keeps the engagement economics viable.' },
                { title: 'File quality at the start of fieldwork determines how long fieldwork takes', description: 'An audit that starts with well-organised, clearly indexed client documents and complete PBC items runs faster than one that begins with a pile of unsorted files. Preparation quality is directly tied to fieldwork efficiency.' },
                { title: 'Confirmation management is systematic work, not audit judgement', description: 'Preparing confirmation letters, tracking responses, maintaining a status log, and escalating non-responses is a systematic administrative process. It requires diligence and documentation discipline — not the auditor judgement that must remain in-house.' },
                { title: 'Independence boundaries are clearly manageable', description: 'Properly structured outsourced preparation support does not compromise auditor independence. The preparation layer and the audit procedure layer are distinct. With clear scope boundaries, documented deliverables, and no client-facing contact from the support team, independence requirements are preserved.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why audit firms choose NextGen BPO for preparation support</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'CA-led team with audit environment understanding', body: 'Our team is supervised by Chartered Accountants who have worked in audit environments and understand the documentation standards, file structure expectations, and quality requirements of a professional audit practice. This is not generic document handling.' },
              { heading: 'Senior review before every handoff', body: 'All preparation work — from lead schedules to PBC status logs — is reviewed by a senior before it reaches your audit team. Your auditors receive files ready to work from, not first drafts that require further organisation.' },
              { heading: 'Independence-aware scope design', body: 'We design engagements with clear boundaries between preparation support and audit procedures. We understand which tasks must remain with your licensed staff and structure our work accordingly. Independence is a design criterion, not an afterthought.' },
              { heading: 'Master NDA with client-level data separation', body: 'All engagements are covered by a master NDA. Each audit client\'s file is handled with strict access controls and separation from other client files. Audit client confidentiality is maintained across every engagement in your portfolio.' },
              { heading: 'Consistent team across your audit cycle', body: 'You work with the same support team throughout the year. They build familiarity with your audit programmes, your file structures, and your documentation preferences. The quality and speed of preparation improves over time rather than restarting each season.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we onboard and run audit support engagements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Scope and independence review', description: 'We discuss your audit programme, client portfolio, software platforms, and the specific preparation tasks you want to outsource. Independence boundary documentation is part of this phase.' },
              { step: '02', title: 'NDA, access, and file structure setup', description: 'Master NDA is signed, system access is configured with client-level access controls, and we document your file naming conventions, workpaper templates, and quality standards.' },
              { step: '03', title: 'Preparation delivery with senior sign-off', description: 'Audit preparation work runs to your engagement schedule. All output is reviewed by a CA before it enters your audit team\'s workflow, with a documented delivery record for each client.' },
              { step: '04', title: 'Capacity review and seasonal planning', description: 'We review capacity requirements ahead of your busy audit periods. Scope and staffing are confirmed in advance so there are no delays when your audit season peaks.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Industries our audit clients serve</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Manufacturing and distribution', 'Financial services and investment funds', 'Non-profit and charitable organisations', 'Real estate and property development', 'Healthcare and life sciences', 'Technology and software companies'].map((industry) => (
              <div key={industry} className="rounded-xl border border-brand-border/60 bg-white p-4 text-sm text-brand-gray font-medium">{industry}</div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about audit firm support</h2>
            <div className="space-y-6">
              {[
                { q: 'What types of audit engagements do you support?', a: 'We support financial statement audits, reviews, compilations, agreed-upon procedures, and internal audit engagements. Our support covers preparation work across all phases — planning, fieldwork, and completion — rather than the auditor judgement and opinion-forming steps, which remain with your licensed auditors.' },
                { q: 'How do you maintain audit independence requirements?', a: 'We perform preparation and administrative support tasks, not audit procedures. All substantive testing, analytical procedures, professional judgements, and conclusions remain with your licensed audit staff. We do not perform work that would compromise your team\'s independence from audit clients.' },
                { q: 'Can you help with PBC list follow-up with audit clients?', a: 'Yes. We prepare the initial PBC list from the audit programme, track document receipts, maintain a status log of outstanding items, and draft follow-up communication for your audit team to review and send. We do not communicate directly with audit clients; all client-facing correspondence is issued by your team.' },
                { q: 'Do you work within our audit software platform?', a: 'We work within platforms including CaseWare, TeamMate, ProSystem fx Engagement, and standard office-based document management. If you have a proprietary audit file system, we discuss access and workflow requirements during the scoping phase before any engagement begins.' },
                { q: 'How is audit client confidentiality managed?', a: 'All work is covered by a master NDA with your firm. Audit client files are handled with strict access controls, client-level data separation, and documented handoff records. We understand the confidentiality standards applied in audit practice and operate accordingly.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about audit firm support</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your audit client portfolio, your software, and the specific preparation tasks you want to take off your team&apos;s plate. We will propose a support model within one business day.</p>
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
              { title: 'CPA Firm Support', href: '/cpa-firm-support', description: 'Back-office production capacity for CPA practices — bookkeeping, workpaper prep, tax season surge, and client onboarding with CA-led review.' },
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting outsourcing covering reconciliations, close support, AP/AR, and management reporting under CA supervision.' },
              { title: 'Financial Reporting Services', href: '/financial-reporting-services', description: 'Monthly MIS packs, financial statements, variance analysis, and management reports with senior review and documentation.' },
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
