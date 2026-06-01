import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Payroll Processing Services | NextGen BPO Solutions',
  description: 'Payroll processing services for businesses and CPA firms. Gross-to-net calculations, compliance calendars, employee records, variance checks and reviewed payroll summaries.',
  alternates: { canonical: 'https://next-genbpo.com/payroll-processing-services' },
  openGraph: {
    title: 'Payroll Processing Services | NextGen BPO Solutions',
    description: 'Payroll processing services for businesses and CPA firms. Gross-to-net calculations, compliance calendars, employee records, variance checks and reviewed payroll summaries.',
    url: 'https://next-genbpo.com/payroll-processing-services',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Payroll Processing Services',
  description: 'End-to-end payroll processing support including input preparation, gross-to-net calculations, compliance calendars, and payroll journals for accounting integration.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: ['US', 'GB', 'PK', 'SA'],
  serviceType: 'Payroll Processing',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you run payroll directly or support our payroll provider?',
      acceptedAnswer: { '@type': 'Answer', text: 'We support both models. We can prepare and organise payroll inputs for submission to your existing payroll provider, or we can handle the end-to-end preparation process for review and approval by your team. We do not act as a payroll bureau but we handle all the preparation, variance checking, and journal work that surrounds it.' },
    },
    {
      '@type': 'Question',
      name: 'How do you handle payroll compliance for different countries?',
      acceptedAnswer: { '@type': 'Answer', text: 'We support payroll compliance for Pakistan-based businesses as well as businesses with international payroll requirements. For each jurisdiction, we maintain a compliance calendar, track due dates, and flag upcoming filing and payment obligations. Clients with complex multi-jurisdiction payroll are advised to confirm jurisdiction-specific requirements during scope discussions.' },
    },
    {
      '@type': 'Question',
      name: 'What happens if an employee has irregular pay items like bonuses or advances?',
      acceptedAnswer: { '@type': 'Answer', text: 'Irregular items are handled through the variance check process. Before payroll is finalised, we compare each period against the prior period and flag material differences for client confirmation. One-off items like bonuses, advances, or termination payments are documented separately in the payroll summary.' },
    },
    {
      '@type': 'Question',
      name: 'Can you integrate payroll output with our accounting system?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We prepare payroll journal entries formatted for posting to your general ledger — either manually in your accounting software or as an import file. The journals cover gross wages, employer contributions, deductions, and net pay, and are reconciled to the payroll summary before delivery.' },
    },
    {
      '@type': 'Question',
      name: 'How confidential is employee payroll data?',
      acceptedAnswer: { '@type': 'Answer', text: 'Payroll data is subject to strict confidentiality controls. All engagements operate under a signed NDA. Employee records are accessed only by assigned team members. We do not share payroll data with any third party and apply role-based access controls throughout the engagement.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Payroll Processing Services', item: 'https://next-genbpo.com/payroll-processing-services' },
  ],
};

export default function PayrollProcessingServicesPage() {
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
              Payroll Processing Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Accurate, reviewed payroll processing for businesses and CPA firms
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We handle payroll input preparation, gross-to-net calculations, compliance calendars, employee records, and accounting integration — with a variance check and senior review built into every payroll cycle before it reaches you.
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
            <p className="text-xs text-brand-gray mt-4">Confidential. Defined scope. CA-supervised delivery.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What our payroll processing service covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Payroll processing involves more than calculating gross-to-net figures. It requires accurate employee records, properly maintained deduction and benefit schedules, compliance with filing deadlines, and integration with the accounting records so the general ledger reflects actual payroll costs. When any of these components is handled inconsistently, errors accumulate — either in the payroll figures themselves or in the accounts they feed into.</p>
              <p>Our payroll processing service covers the full preparation cycle: collecting and organising payroll inputs, preparing gross-to-net calculations, managing employee records for changes, handling deductions and benefits, and producing payroll journals ready for accounting system integration. We apply a variance check against the prior period before finalising each cycle, so material differences are identified and queried before the payroll is approved — not after.</p>
              <p>For CPA and accounting firms managing payroll for multiple clients, we provide a structured multi-client payroll support service with clear client-level separation, compliance calendars for each client, and payroll packages prepared to a standard that requires minimal revision before your review. For individual businesses, we provide reliable, reviewed payroll support that removes the risk of errors going undetected across pay cycles.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Who We Help */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Who we support</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'SMEs without a dedicated payroll resource', description: 'Businesses where payroll is currently handled by a director, accountant, or office manager alongside other responsibilities — and needs to be handled by a dedicated, reviewed process.' },
              { title: 'CPA and accounting firms managing client payrolls', description: 'Practices that process payroll for multiple clients and need reliable preparation support that produces reviewed payroll packages rather than requiring rework.' },
              { title: 'Multi-location or multi-entity businesses', description: 'Companies with staff across multiple locations or entities, where payroll needs to be processed separately but reported in a consolidated format for management.' },
              { title: 'Businesses scaling headcount rapidly', description: 'Growing businesses adding staff regularly, where maintaining accurate employee records, benefits schedules, and compliance calendars has become more complex than existing processes can handle.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Payroll problems we solve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Errors not caught before payroll runs', description: 'Pay figures that are wrong due to data entry mistakes, missed changes, or miscalculated deductions — only discovered after employees have been paid.' },
              { title: 'Compliance deadlines missed', description: 'Payroll-related filing deadlines that are not tracked systematically, resulting in late submissions, penalties, and correspondence with tax authorities.' },
              { title: 'Employee records not kept current', description: 'New starters, leavers, salary changes, and benefit updates that are not reflected promptly in payroll, leading to incorrect payments.' },
              { title: 'Payroll not integrated with accounts', description: 'Manual payroll journals that are inconsistent, late, or incorrect, causing the general ledger to misstate payroll costs.' },
              { title: 'No variance analysis between periods', description: 'No systematic comparison of payroll totals between periods, meaning unusual amounts pass through without being questioned.' },
              { title: 'Lack of documented payroll process', description: 'Payroll run entirely from tribal knowledge, with no documented procedure, making handover to a new resource high risk.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of payroll processing services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following items represent the specific tasks covered in a payroll processing engagement. Scope is confirmed based on headcount, payroll frequency, and integration requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Payroll input collection and organisation (hours, salary, commissions)',
              'Gross pay calculation including overtime and variable components',
              'Net pay calculation after statutory and voluntary deductions',
              'Income tax withholding calculations (per applicable jurisdiction)',
              'Social security and pension contribution calculations',
              'Employee benefits and deduction schedule maintenance',
              'New starter record creation and setup',
              'Leaver processing and final pay calculations',
              'Mid-period salary change and backdated adjustment handling',
              'Advance and loan repayment deduction tracking',
              'Payroll variance analysis — current period vs. prior period',
              'Exception and anomaly flag report before payroll finalisation',
              'Payroll summary schedule by department and employee',
              'Gross-to-net reconciliation report',
              'Payroll compliance calendar — filing and payment due dates',
              'Payroll filing support (withholding tax statements, annual reconciliations)',
              'Payroll journal preparation for general ledger posting',
              'Payroll cost allocation by cost centre or project',
              'Multi-entity payroll processing with consolidated summary',
              'Payroll records maintenance and archive management',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why businesses outsource payroll processing</h2>
            <div className="space-y-6">
              {[
                { title: 'Payroll errors have immediate and visible consequences', description: 'Unlike an accounting error that may go unnoticed for weeks, a payroll error is immediately apparent to every affected employee. Outsourcing to a reviewed process reduces the risk of errors reaching the finalised payroll.' },
                { title: 'Compliance requirements are time-sensitive and jurisdiction-specific', description: 'Payroll-related tax filings and payment deadlines vary by jurisdiction and change periodically. Maintaining a compliance calendar and tracking these requirements is a dedicated task that benefits from specialist attention.' },
                { title: 'Accounting integration is consistently neglected', description: 'Many businesses run payroll correctly but fail to translate it into accurate accounting entries. The payroll journal is often the last item posted, posted late, or posted incorrectly. Outsourcing the full cycle — including journals — solves this at source.' },
                { title: 'Scalability without proportional cost increase', description: 'As headcount grows, the payroll function grows with it. Outsourcing allows the business to scale without proportional increases in internal payroll resource costs.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why clients choose NextGen BPO for payroll processing</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'Variance check before every payroll finalisation', body: 'Each payroll cycle is compared to the prior period before finalisation. Material differences are flagged and queried with you before the payroll is approved. This prevents errors from reaching employees or the accounting records.' },
              { heading: 'Accounting integration as standard', body: 'Payroll journals are prepared as part of every cycle and delivered in a format ready for posting to your general ledger. The journal is reconciled to the payroll summary, so accounting records are accurate from the start.' },
              { heading: 'Compliance calendar management', body: 'We maintain a payroll compliance calendar with all filing and payment deadlines for your jurisdiction. We flag upcoming obligations in advance, reducing the risk of missed deadlines and the penalties that follow.' },
              { heading: 'Strict confidentiality for employee data', body: 'Employee payroll data is handled under a signed NDA with role-based access controls. Only the assigned payroll team has access to employee records. All data handling follows documented protocols appropriate for sensitive personal data.' },
              { heading: 'Works alongside your payroll provider', body: 'If you use an existing payroll bureau or software platform, we integrate with your process rather than replacing it. We handle the preparation, variance checking, and journal work while your provider handles the payment run.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we run payroll engagements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Scope and access setup', description: 'We review your payroll frequency, headcount, deduction types, and compliance requirements. NDA is signed and a payroll compliance calendar is established.' },
              { step: '02', title: 'Employee records and process documentation', description: 'Existing employee records are reviewed and documented. We establish input templates, variance check procedures, and journal formats for your accounting system.' },
              { step: '03', title: 'Reviewed payroll cycle delivery', description: 'Each payroll cycle follows the agreed process: input collection, calculation, variance check, senior review, and delivery of payroll summary and journal.' },
              { step: '04', title: 'Compliance tracking and period reporting', description: 'Filing deadlines are tracked and flagged in advance. Annual reconciliations and reporting obligations are handled as part of the ongoing engagement.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Payroll processing — frequently asked questions</h2>
            <div className="space-y-6">
              {[
                { q: 'Do you run payroll directly or support our payroll provider?', a: 'We support both models. We can prepare and organise payroll inputs for submission to your existing payroll provider, or we can handle the end-to-end preparation process for review and approval by your team. We do not act as a payroll bureau but we handle all the preparation, variance checking, and journal work that surrounds it.' },
                { q: 'How do you handle payroll compliance for different countries?', a: 'We support payroll compliance for Pakistan-based businesses as well as businesses with international payroll requirements. For each jurisdiction, we maintain a compliance calendar, track due dates, and flag upcoming filing and payment obligations. Clients with complex multi-jurisdiction payroll are advised to confirm jurisdiction-specific requirements during scope discussions.' },
                { q: 'What happens if an employee has irregular pay items like bonuses or advances?', a: 'Irregular items are handled through the variance check process. Before payroll is finalised, we compare each period against the prior period and flag material differences for client confirmation. One-off items like bonuses, advances, or termination payments are documented separately in the payroll summary.' },
                { q: 'Can you integrate payroll output with our accounting system?', a: 'Yes. We prepare payroll journal entries formatted for posting to your general ledger — either manually in your accounting software or as an import file. The journals cover gross wages, employer contributions, deductions, and net pay, and are reconciled to the payroll summary before delivery.' },
                { q: 'How confidential is employee payroll data?', a: 'Payroll data is subject to strict confidentiality controls. All engagements operate under a signed NDA. Employee records are accessed only by assigned team members. We do not share payroll data with any third party and apply role-based access controls throughout the engagement.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about payroll processing services</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your headcount, pay frequency, and current payroll setup. We will outline a clear scope that fits your process and timeline.</p>
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
              { title: 'Bookkeeping Services', href: '/bookkeeping-services', description: 'Bank reconciliations, AP/AR maintenance, transaction categorisation, and monthly close packs.' },
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting support with month-end close, balance sheet reconciliations, and management reporting.' },
              { title: 'Financial Reporting Services', href: '/financial-reporting-services', description: 'Management accounts, MIS packs, variance commentary, and reporting for leadership and investors.' },
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
