import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

const PAGE_URL = 'https://next-genbpo.com/pakistan-taxation-services';
const PAGE_TITLE = 'Income Tax Return Filing in Pakistan | Active Taxpayer Services';
const PAGE_DESCRIPTION =
  'Income tax return filing in Pakistan with FBR IRIS e-filing, NTN registration, and Active Taxpayer List (ATL) support for individuals, AOPs, and companies. CA-led team.';

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  keywords: ['income tax return filing in Pakistan', 'tax return filing Pakistan', 'FBR income tax return filing', 'become a filer in Pakistan', 'active taxpayer list', 'ATL status', 'NTN registration', 'Pakistan taxation services', 'sales tax Pakistan', 'withholding tax compliance Pakistan'],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Income Tax Return Filing & Pakistan Taxation Services',
  description:
    'Income tax return filing in Pakistan for salaried individuals, sole proprietors, AOPs, companies, and non-profit organisations, together with NTN registration, Active Taxpayer List (ATL) support, sales tax, withholding tax compliance, and FBR notice management.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: [{ '@type': 'Country', name: 'Pakistan' }, { '@type': 'Country', name: 'Saudi Arabia' }, { '@type': 'Country', name: 'United Kingdom' }],
  serviceType: ['Income Tax Return Filing', 'Pakistan Taxation'],
};

// FAQ content is defined once and used for both the visible FAQ section and the
// FAQPage JSON-LD so the two can never drift apart. Answers are written to be
// self-contained: each one restates the entities it refers to (FBR, NTN, ATL)
// so it remains accurate when read in isolation.
const FAQS = [
  {
    q: 'How do I become a filer in Pakistan?',
    a: 'Register with the Federal Board of Revenue (FBR) for a National Tax Number (NTN), then file your income tax return for the tax year through the FBR IRIS portal, with a wealth statement where applicable. Once the return is filed and the applicable statutory conditions are met, you appear on the Active Taxpayer List (ATL). NextGen BPO handles these steps as an independent provider and is not affiliated with FBR.',
  },
  {
    q: 'Is NTN registration the same as becoming an active taxpayer?',
    a: 'No. A National Tax Number (NTN) registers you with the Federal Board of Revenue (FBR) but does not by itself place you on the Active Taxpayer List (ATL). You must also file your income tax return for the tax year and meet the applicable conditions, including any late filing surcharge. Registration, return filing, and ATL status are three distinct steps.',
  },
  {
    q: 'What is the difference between a filer and a non-filer?',
    a: 'A filer appears on the Federal Board of Revenue’s Active Taxpayer List (ATL); a non-filer does not. Non-filers pay significantly higher withholding tax rates on transactions such as bank profit, dividends, property purchases and sales, and vehicle registration. The exact difference varies by transaction type and tax year.',
  },
  {
    q: 'What is the ATL surcharge for Tax Year 2027?',
    a: 'For Tax Year 2027, the Active Taxpayer List (ATL) surcharge under section 182A of the Income Tax Ordinance 2001 is Rs. 25,000 for an individual, Rs. 50,000 for an Association of Persons (AOP), and Rs. 100,000 for a company, increased by the Finance Act 2026 (effective 1 July 2026) from Rs. 1,000, Rs. 10,000, and Rs. 20,000 respectively. It is a statutory amount payable to the Federal Board of Revenue (FBR) by late filers who seek inclusion in the Active Taxpayer List. The ATL surcharge is separate from professional tax filing fees and from the higher withholding tax rates paid by non-filers, and payment does not, by itself, guarantee immediate inclusion, which remains subject to FBR procedures.',
  },
  {
    q: 'What documents are generally required for income tax return filing?',
    a: 'A salaried income tax return generally needs a CNIC, salary certificate, bank statements for the tax year, details of tax already deducted, and asset and liability information for the wealth statement. Business individuals and companies also need accounting records and sales, purchase, and asset details. We confirm a specific checklist for your taxpayer category at the start of each engagement.',
  },
  {
    q: 'How much does income tax return filing cost?',
    a: 'Professional fees for income tax return filing depend on the taxpayer category and the complexity of the return. A salaried return with a wealth statement is a fixed-fee service, while business and company returns depend on turnover and records. Current professional fees for NTN registration and each return category are published on the NextGen BPO pricing page, and government charges are separate.',
  },
  {
    q: 'How can I check my Active Taxpayer List status?',
    a: 'Check your Active Taxpayer List (ATL) status free of charge through the Federal Board of Revenue’s online ATL verification service, or by SMS by sending "ATL [space] 13-digit CNIC number" to 9966 for individuals. It shows whether you currently appear as an active taxpayer for the relevant tax year.',
  },
  {
    q: 'Who needs to file an income tax return in Pakistan?',
    a: 'Under the Income Tax Ordinance 2001, individuals with taxable income above the minimum threshold, all companies and AOPs, and owners of immovable property above certain thresholds must file an income tax return. Registered sales tax persons also have annual obligations. The specific threshold and category depend on taxpayer type and income source.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Income Tax Return Filing & Pakistan Taxation', item: PAGE_URL },
  ],
};

const TAXPAYER_CATEGORIES = [
  {
    title: 'Salaried Individuals',
    body: 'We prepare and e-file the annual return and wealth statement from your salary certificate, bank statements, and deduction details, claiming admissible credits and adjustments for tax already withheld.',
  },
  {
    title: 'Business Individuals & Sole Proprietors',
    body: 'For self-employed professionals, freelancers, and sole proprietors, we prepare the business income computation and wealth statement, apply admissible deductions, and reconcile withholding tax already deducted.',
  },
  {
    title: 'Associations of Persons & Companies',
    body: 'We prepare the corporate or AOP return and tax provision from your financial statements, compute minimum tax and admissible credits, and align advance tax and withholding statements with the annual return.',
  },
  {
    title: 'Non-Profit Organizations',
    body: 'We prepare the annual return for non-profit organisations and charitable trusts, reflecting approval status, donation and grant income, and the disclosures required to maintain non-profit tax treatment.',
  },
];

export default function PakistanTaxationServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-br from-white via-brand-light to-white overflow-hidden">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-brand-gray">
              <li>
                <Link href="/" className="hover:text-brand-dark transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-brand-dark">
                Income Tax Return Filing &amp; Pakistan Taxation
              </li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold tracking-wide uppercase mb-6">
              Pakistan Taxation
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Income Tax Return Filing in Pakistan for Individuals &amp; Businesses
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We prepare and e-file income tax returns with the Federal Board of Revenue (FBR) for salaried individuals, sole proprietors, Associations of Persons, companies, and non-profits. Every return is reviewed by a Chartered Accountant, and we also handle NTN registration and Active Taxpayer List (ATL) support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/#contact">
                  Request a Consultation
                  <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/pricing#income-tax-return">View Income Tax Return Filing Fees</Link>
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
              <p>Pakistan&apos;s tax system is administered by the Federal Board of Revenue (FBR) under the Income Tax Ordinance 2001 and the Sales Tax Act 1990. Beyond annual income tax return filing through the FBR IRIS portal, our Chartered Accountant led team covers sales tax, withholding tax, and FBR notices for individuals, businesses, and companies, including subsidiaries and branch offices of international groups that need local filings coordinated with group reporting and transfer pricing.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Income Tax Return Filing with FBR */}
      <section className="py-16 bg-brand-light">
        <Container>
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Income Tax Return Filing with FBR</h2>
            <p className="text-brand-gray leading-relaxed">
              An income tax return in Pakistan is filed electronically through the Federal Board of Revenue&apos;s IRIS portal. For individuals it includes a wealth statement, which declares assets, liabilities, and expenditure and must reconcile with declared income. What each return contains varies by taxpayer category.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {TAXPAYER_CATEGORIES.map((item) => (
              <div key={item.title} className="rounded-2xl border border-brand-border/60 bg-white p-6">
                <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-brand-gray max-w-3xl">
            Professional fees for each category are published on our pricing page: see current{' '}
            <Link href="/pricing#income-tax-return" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
              income tax return filing fees
            </Link>
            . The descriptions above are general and are not tax advice for any specific taxpayer.
          </p>
        </Container>
      </section>

      {/* Become a Filer / ATL */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Become a Filer and Join the Active Taxpayer List (ATL)</h2>
            <p className="text-brand-gray leading-relaxed">
              In Pakistan, a filer is a person who appears on the Active Taxpayer List (ATL), the register the Federal Board of Revenue (FBR) publishes of taxpayers who have filed their income tax returns. Filer status matters because persons who are not on the ATL face materially higher withholding tax rates on many transactions, including bank profit, dividends, property transfers, and vehicle registration. Becoming a filer follows three distinct steps:
            </p>
            <ol className="mt-6 space-y-4">
              {[
                { step: '1', title: 'FBR registration (NTN)', body: 'Register with FBR for a National Tax Number (NTN); for individuals, the CNIC serves as the NTN. Registration alone does not place you on the ATL.' },
                { step: '2', title: 'Income tax return filing', body: 'File the return for the tax year through the FBR IRIS portal, with the wealth statement for individuals. A return filed after the due date may require a statutory ATL surcharge before inclusion.' },
                { step: '3', title: 'ATL inclusion', body: 'Once the return is filed and the applicable conditions are met, you appear on the Active Taxpayer List under FBR’s processing and updating procedures. Inclusion is not instantaneous on submission.' },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4 rounded-2xl border border-brand-border/60 bg-brand-light p-5">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green/10 text-brand-green font-bold text-sm flex items-center justify-center" aria-hidden="true">{item.step}</span>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">{item.title}</h3>
                    <p className="text-sm text-brand-gray leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-brand-gray leading-relaxed">
              Where a return is filed after the due date, the Income Tax Ordinance 2001 allows inclusion in the Active Taxpayer List on payment of a statutory ATL surcharge under section 182A. The Finance Act 2026 increased these amounts, effective from 1 July 2026 (Tax Year 2027):
            </p>

            <div className="mt-6 rounded-2xl border border-brand-border/60 bg-brand-light p-6">
              <h3 className="text-base font-semibold text-brand-dark mb-4">Active Taxpayer List (ATL) surcharge under section 182A (Tax Year 2027)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-brand-dark border-b border-brand-border/60">
                      <th scope="col" className="py-2 pr-4 font-semibold">Taxpayer category</th>
                      <th scope="col" className="py-2 px-4 font-semibold text-right">Previous surcharge</th>
                      <th scope="col" className="py-2 pl-4 font-semibold text-right">Revised surcharge (Finance Act 2026)</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    {[
                      { cat: 'Individual', prev: 'Rs. 1,000', now: 'Rs. 25,000' },
                      { cat: 'Association of Persons (AOP)', prev: 'Rs. 10,000', now: 'Rs. 50,000' },
                      { cat: 'Company', prev: 'Rs. 20,000', now: 'Rs. 100,000' },
                    ].map((row) => (
                      <tr key={row.cat} className="border-b border-brand-border/40 last:border-0">
                        <td className="py-2 pr-4 text-brand-dark font-medium">{row.cat}</td>
                        <td className="py-2 px-4 text-right tabular-nums">{row.prev}</td>
                        <td className="py-2 pl-4 text-right tabular-nums font-semibold text-brand-dark">{row.now}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mt-5 space-y-2 text-xs text-brand-gray leading-relaxed list-disc pl-5">
                <li>These statutory ATL surcharges are payable to the Federal Board of Revenue (FBR) where the legal conditions are met. They are separate from NextGen BPO&apos;s professional fees and from the higher withholding tax rates paid by persons who are not on the Active Taxpayer List.</li>
                <li>Holding an NTN does not, by itself, make a person an active taxpayer, and filing a return does not always result in immediate or automatic ATL inclusion. Payment of the surcharge does not guarantee inclusion, which remains subject to applicable law and to FBR&apos;s processing and updating procedures.</li>
                <li>NextGen BPO is an independent professional service provider and does not control FBR or Active Taxpayer List processing.</li>
              </ul>
            </div>

            <p className="mt-6 text-brand-gray leading-relaxed">
              Check your status on the official{' '}
              <a href="https://www.fbr.gov.pk" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
                FBR website
              </a>{' '}
              ATL verification service or by SMS to 9966. Our{' '}
              <Link href="/wht-calculator" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
                withholding tax calculator
              </Link>{' '}
              compares filer and non-filer rates, and our{' '}
              <Link href="/tax-year-2027-pakistan" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
                current tax year guide
              </Link>{' '}
              sets out the applicable rates in detail.
            </p>
          </div>
        </Container>
      </section>

      {/* Challenges */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Compliance challenges we address</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Missed deadlines and late surcharges', description: 'We maintain a deadline calendar for every client and file in advance of due dates to avoid FBR surcharges and penalties.' },
              { title: 'Withholding tax obligations', description: 'We manage the full withholding tax cycle, from deduction schedules to monthly and quarterly statement submission.' },
              { title: 'Sales tax categorisation', description: 'Applicability, rates, and input tax eligibility vary by category. We classify correctly to avoid underpayment or unrecoverable excess payment.' },
              { title: 'Advance tax estimation', description: 'We calculate and schedule quarterly advance tax accurately to prevent cash flow pressure and interest charges.' },
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
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Scope of Pakistan taxation services</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The tax compliance and advisory tasks covered in our Pakistan taxation engagements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Annual income tax return preparation and FBR e-filing (individuals, AOPs, companies)',
              'NTN registration for salaried individuals and businesses',
              'Wealth statement preparation and reconciliation for individual filers',
              'Corporate income tax computation and tax provision calculation',
              'Advance tax computation and challan preparation',
              'Withholding tax deduction schedules and monthly and quarterly statement filing',
              'Sales tax registration, monthly returns, and input/output reconciliation',
              'Sales tax refund claim preparation and follow-up with FBR',
              'Active Taxpayer List (ATL) maintenance and status monitoring',
              'Transfer pricing documentation for related-party transactions',
              'Tax notice response, assessment review, and appeal coordination',
              'Tax clearance certificate applications',
              'SECP annual return filing coordination',
              'Tax advisory on business transactions, restructurings, and dividends',
              'Compliance calendar management with advance deadline reminders',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-brand-light rounded-xl border border-brand-border/60 p-4">
                <ChevronRight className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-brand-gray">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why NextGen BPO */}
      <section className="py-16 lg:py-20 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why businesses choose NextGen BPO for Pakistan taxation</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'Chartered Accountant led team', body: 'Work is reviewed by a qualified CA before any filing, with direct experience in FBR compliance, assessment proceedings, and advisory across all taxpayer categories.' },
              { heading: 'Proactive deadline management', body: 'We maintain a compliance calendar for each client covering filing, advance tax, and withholding statement dates, with advance reminders and confirmation on submission.' },
              { heading: 'Notice and audit management', body: 'When FBR issues a notice or opens an audit, we review it, prepare a documented response, and represent your position through the appropriate channel.' },
              { heading: 'Suited for international businesses', body: 'We support foreign-owned Pakistani entities on related-party documentation and coordination with group tax functions on local filings, under a signed confidentiality agreement.' },
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
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Review and scope', description: 'We review your tax position, filing history, and registration status, then document a calendar of annual, quarterly, and monthly obligations under an NDA.' },
              { step: '02', title: 'Filing and submission', description: 'Returns are prepared on schedule, reviewed by a CA, and submitted via IRIS or the relevant FBR channel, with filing receipts shared after each submission.' },
              { step: '03', title: 'Ongoing advisory', description: 'FBR notices, tax queries, and business changes that affect your tax position are handled on an ongoing basis throughout the engagement.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about income tax return filing and ATL status</h2>
            <div className="space-y-6">
              {FAQS.map((item) => (
                <div key={item.q} className="border border-brand-border/60 rounded-xl bg-white p-6">
                  <h3 className="font-semibold text-brand-dark mb-2">{item.q}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    {item.q === 'How much does income tax return filing cost?' ? (
                      <>
                        Professional fees for income tax return filing depend on the taxpayer category and the complexity of the return. A salaried return with a wealth statement is a fixed-fee service, while business and company returns depend on turnover and records. Current professional fees for NTN registration and each return category are published on the{' '}
                        <Link href="/pricing#income-tax-return" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
                          NextGen BPO pricing page
                        </Link>
                        , and government charges are separate.
                      </>
                    ) : (
                      item.a
                    )}
                  </p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about income tax return filing and FBR compliance</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your taxpayer category, your current FBR registration status, and any compliance concerns. We will outline what is required and what we can cover.</p>
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
