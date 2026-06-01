import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Pakistan Taxation Services | NextGen BPO Solutions',
  description: 'Pakistan income tax, sales tax, and withholding tax compliance for businesses, individuals, AOPs, and companies. FBR filing support, tax notices, and advisory from experienced CA-led team.',
  alternates: { canonical: 'https://next-genbpo.com/pakistan-taxation-services' },
  keywords: ['Pakistan taxation services', 'FBR tax filing', 'Pakistan income tax', 'sales tax Pakistan', 'withholding tax compliance Pakistan', 'Pakistan corporate tax', 'income tax return Pakistan', 'FBR filing services', 'Pakistan tax advisory', 'SECP compliance'],
  openGraph: {
    title: 'Pakistan Taxation Services | NextGen BPO Solutions',
    description: 'Pakistan income tax, sales tax, and withholding tax compliance for businesses, individuals, and companies. FBR filing support and tax advisory.',
    url: 'https://next-genbpo.com/pakistan-taxation-services',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Pakistan Taxation Services',
  description: 'Pakistan income tax, sales tax, and withholding tax compliance for businesses, individuals, AOPs, and companies, covering FBR filing, advance tax, and tax notice management.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: [{ '@type': 'Country', name: 'Pakistan' }, { '@type': 'Country', name: 'Saudi Arabia' }, { '@type': 'Country', name: 'United Kingdom' }],
  serviceType: 'Pakistan Taxation',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who needs to file an income tax return in Pakistan?',
      acceptedAnswer: { '@type': 'Answer', text: 'Under the Income Tax Ordinance 2001, every individual with taxable income above the minimum threshold, all companies and AOPs, and persons who own immovable property above certain thresholds are required to file. Registered sales tax persons and those appearing on the Active Taxpayer List (ATL) also have annual filing obligations. The specific threshold and filing category depends on the taxpayer type and income source.' },
    },
    {
      '@type': 'Question',
      name: 'What is the deadline for filing income tax returns in Pakistan?',
      acceptedAnswer: { '@type': 'Answer', text: 'For individuals and AOPs, the income tax return deadline is typically 30 September of the year following the tax year (which runs July to June in Pakistan). For companies, the deadline is generally within six months of the close of the accounting year. Extensions can be applied for under certain circumstances. We maintain compliance calendars for each client and send advance reminders before every deadline.' },
    },
    {
      '@type': 'Question',
      name: 'What Pakistan sales tax services do you provide?',
      acceptedAnswer: { '@type': 'Answer', text: 'We handle sales tax registration with FBR, preparation and filing of monthly sales tax returns, input/output tax reconciliation, sales tax invoice verification, e-filing via IRIS, and management of sales tax notices and audit proceedings. We also advise on sales tax exemptions and reduced-rate applicability for specific goods and services sectors.' },
    },
    {
      '@type': 'Question',
      name: 'Can you handle tax compliance for a Pakistani subsidiary of a foreign company?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We regularly work with Pakistani subsidiaries and branch offices of international companies, covering local income tax, sales tax, and withholding tax obligations, as well as coordination with the parent entity on transfer pricing considerations and group reporting. We understand the additional compliance requirements that apply to foreign-owned entities operating in Pakistan.' },
    },
    {
      '@type': 'Question',
      name: 'What happens if a tax notice is received from FBR?',
      acceptedAnswer: { '@type': 'Answer', text: 'We manage the full notice response process: reviewing the notice, identifying the FBR department and legal basis, preparing a substantiated written response with supporting documentation, and filing the response through the IRIS portal or in person as required. For notices related to audit proceedings or assessment orders, we represent the taxpayer through the appeals process where applicable.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Pakistan Taxation Services', item: 'https://next-genbpo.com/pakistan-taxation-services' },
  ],
};

export default function PakistanTaxationServicesPage() {
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
              Pakistan Taxation
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Pakistan taxation services for businesses, professionals, and international entities
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We provide complete Pakistan tax compliance for companies, AOPs, individuals, and foreign-owned entities — covering FBR income tax filing, sales tax returns, withholding tax management, and tax advisory from a CA-led team with direct experience across Pakistan&apos;s tax system.
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
            <p className="text-xs text-brand-gray mt-4">FBR-compliant. Deadline-managed. Advisory included.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Pakistan taxation services overview</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Pakistan&apos;s tax landscape is administered primarily through the Federal Board of Revenue under the Income Tax Ordinance 2001, the Sales Tax Act 1990, and associated rules and SROs. For businesses and individuals operating in Pakistan, staying current with filing obligations requires regular attention to changing rates, thresholds, withholding categories, and FBR circulars — a full-time requirement that most businesses prefer to delegate to qualified professionals.</p>
              <p>Our Pakistan taxation team handles the full annual compliance cycle: preparation and filing of income tax returns across all taxpayer categories, monthly sales tax returns, withholding tax statements, advance tax calculations, and Active Taxpayer List (ATL) maintenance. All filings are prepared by qualified accounting professionals and reviewed by a Chartered Accountant before submission. We also maintain compliance calendars for each client so that no deadline is missed and no late-filing surcharge is incurred.</p>
              <p>For international businesses with Pakistani operations — including subsidiaries, branch offices, and representative offices of companies registered in the UK, US, UAE, or Saudi Arabia — we provide an additional layer of compliance coordination, ensuring that local filing obligations are met and that the documentation required for group reporting and transfer pricing is maintained properly.</p>
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
              { title: 'Companies registered in Pakistan', description: 'Private limited companies, public companies, and SMEs with corporate income tax, sales tax, withholding tax, and annual filing obligations under the Companies Act and Income Tax Ordinance.' },
              { title: 'Individuals and professionals', description: 'Salaried individuals, self-employed professionals, landlords, and business owners with income tax filing requirements, including those with foreign income or assets requiring disclosure.' },
              { title: 'Associations of persons (AOPs)', description: 'Partnerships, joint ventures, and family businesses registered as AOPs with their own income tax and withholding tax obligations separate from individual partner filings.' },
              { title: 'International businesses with Pakistan presence', description: 'Foreign companies operating through subsidiaries, branches, or liaison offices in Pakistan, requiring local tax compliance coordinated with their international accounting and group tax function.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Compliance challenges we address</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Missed filing deadlines and late surcharges', description: 'FBR imposes surcharges and penalties for late filing. We maintain a deadline calendar for every client and file in advance of due dates.' },
              { title: 'Unmanaged withholding tax obligations', description: 'Businesses failing to deduct or deposit withholding tax correctly face assessments and penalties. We manage the full WHT cycle from deduction to statement submission.' },
              { title: 'Loss of filer status on the ATL', description: 'Failure to file returns removes a taxpayer from the Active Taxpayer List, triggering higher withholding rates on banking transactions and property dealings.' },
              { title: 'Unresponded FBR notices and audit proceedings', description: 'Tax notices require a structured, documented response within set timeframes. Ignoring or mishandling notices leads to assessment orders that are difficult to reverse.' },
              { title: 'Incorrect sales tax categorisation', description: 'Sales tax applicability, rates, and input tax eligibility vary significantly by goods and services category. Errors lead to underpayment or excess payment that is difficult to recover.' },
              { title: 'Advance tax estimation and payment errors', description: 'Quarterly advance tax obligations that are incorrectly estimated lead to either cash flow pressure or interest charges. We calculate and schedule payments accurately.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Scope of Pakistan taxation services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">A comprehensive list of the tax compliance and advisory tasks covered in our Pakistan taxation engagements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Annual income tax return preparation and FBR e-filing (individuals, AOPs, companies)',
              'Corporate income tax computation and tax provision calculation',
              'Advance tax quarterly payment computation and challan preparation',
              'Withholding tax deduction schedule preparation for salary, suppliers, and services',
              'Monthly withholding tax statement filing (withholding agent obligations)',
              'Sales tax registration with FBR for applicable businesses',
              'Monthly sales tax return preparation and IRIS filing',
              'Input/output tax reconciliation and adjustment management',
              'Sales tax refund claim preparation and follow-up with FBR',
              'Active Taxpayer List (ATL) maintenance and status monitoring',
              'Tax depreciation schedules and capital allowance calculations',
              'Transfer pricing documentation for related-party transactions',
              'Tax notice review, response preparation, and FBR submission',
              'Assessment order review and appeal preparation',
              'Commissioner appeals and Appellate Tribunal representation coordination',
              'Tax clearance certificate applications',
              'SECP annual return filing coordination',
              'Tax advisory on business transactions, restructurings, and dividends',
              'Compliance calendar management with advance deadline reminders',
              'Coordination with auditors on tax-related disclosures and notes',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why businesses outsource Pakistan tax compliance</h2>
            <div className="space-y-6">
              {[
                { title: "Pakistan's tax law changes frequently", description: "FBR issues new SROs, notifications, and Finance Act amendments regularly. Keeping track of what applies to your business — and adjusting your filings accordingly — is a technical function that requires dedicated attention most business owners cannot provide alongside running operations." },
                { title: 'The penalty regime is active and enforceable', description: 'FBR has increased its audit and enforcement activity significantly. Late filings, underreported withholding tax, and unregistered sales tax obligations are increasingly likely to result in notices, penalties, and assessments rather than being overlooked.' },
                { title: 'Tax compliance supports business relationships', description: 'Being on the Active Taxpayer List affects your rates as a withholding agent and your attractiveness as a supplier or partner to companies who verify ATL status before engaging. Consistent compliance has tangible commercial consequences.' },
                { title: 'International businesses need local expertise', description: 'A foreign company operating in Pakistan cannot apply its home-country compliance approach to Pakistani tax. Local expertise in the FBR system, IRIS platform, and local audit practice is a prerequisite for effective compliance.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why businesses choose NextGen BPO for Pakistan taxation</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'Chartered Accountant-led team with local FBR expertise', body: 'Our taxation team includes professionals with direct experience in FBR compliance, assessment proceedings, and tax advisory across all major taxpayer categories. Work is reviewed by a qualified CA before any filing or submission.' },
              { heading: 'Proactive deadline management with documented calendars', body: 'We maintain a tax compliance calendar for each client covering all filing deadlines, advance tax dates, and withholding statement due dates. You receive advance reminders and confirmation once each filing is submitted.' },
              { heading: 'Full notice and audit management', body: 'When FBR issues a notice or initiates audit proceedings, we handle the complete response process — reviewing the notice, preparing a documented response, and representing your position through the appropriate channel.' },
              { heading: 'Suited for international businesses with Pakistan operations', body: 'We understand the additional complexity for foreign-owned Pakistani entities — from documentation requirements for related-party transactions to coordination with group tax functions on local filings and disclosures.' },
              { heading: 'NDA-backed with documented file access', body: 'All client tax information is handled under a signed confidentiality agreement with restricted access. Tax documents and financial records are not shared outside the assigned team.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How a Pakistan taxation engagement is structured</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Compliance review and scope', description: 'We review your current tax position, filing history, and registration status across income tax, sales tax, and withholding tax to identify what is required and what may be outstanding.' },
              { step: '02', title: 'Compliance calendar setup', description: 'A complete calendar of annual, quarterly, and monthly filing obligations is documented and shared. NDA signed and access to relevant records and IRIS credentials established.' },
              { step: '03', title: 'Filing and submission cycle', description: 'Returns are prepared on schedule, reviewed by a CA, and submitted via IRIS or the relevant FBR channel. Confirmation and filing receipts are shared with you after each submission.' },
              { step: '04', title: 'Ongoing advisory and notice management', description: 'Tax queries, FBR notices, and any changes in your business that affect your tax position are addressed on an ongoing basis as part of the engagement.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about Pakistan taxation</h2>
            <div className="space-y-6">
              {[
                { q: 'Who needs to file an income tax return in Pakistan?', a: 'Under the Income Tax Ordinance 2001, every individual with taxable income above the minimum threshold, all companies and AOPs, and persons who own immovable property above certain thresholds are required to file. The specific threshold and filing category depends on the taxpayer type and income source.' },
                { q: 'What is the deadline for filing income tax returns in Pakistan?', a: 'For individuals and AOPs, the income tax return deadline is typically 30 September of the year following the tax year (which runs July to June). For companies, the deadline is generally within six months of the close of the accounting year. We maintain compliance calendars for each client and send advance reminders before every deadline.' },
                { q: 'What Pakistan sales tax services do you provide?', a: 'We handle sales tax registration with FBR, preparation and filing of monthly sales tax returns, input/output tax reconciliation, e-filing via IRIS, and management of sales tax notices and audit proceedings.' },
                { q: 'Can you handle tax compliance for a Pakistani subsidiary of a foreign company?', a: 'Yes. We regularly work with Pakistani subsidiaries and branch offices of international companies, covering local income tax, sales tax, and withholding tax obligations, as well as coordination with the parent entity on transfer pricing and group reporting.' },
                { q: 'What happens if a tax notice is received from FBR?', a: 'We manage the full notice response process: reviewing the notice, identifying the legal basis, preparing a substantiated written response with supporting documentation, and filing the response through IRIS or in person. For audit proceedings, we represent the taxpayer through the appropriate appeals process.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about Pakistan tax compliance</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your business type, your current FBR registration status, and any compliance concerns. We will outline what is required and what we can cover.</p>
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
              { title: 'US Tax Preparation Support', href: '/us-tax-preparation-support', description: 'Support for US CPA firms with individual and business tax return preparation, workpapers, and preparer-ready deliverables.' },
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting support including reconciliations, month-end close, and management reporting under CA supervision.' },
              { title: 'Corporate Advisory Services', href: '/corporate-advisory-services', description: 'Financial modelling, business planning, and management reporting for companies making operational or strategic decisions.' },
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
