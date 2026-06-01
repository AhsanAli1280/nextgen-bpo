import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Corporate Advisory Services | NextGen BPO Solutions',
  description: 'CA-led corporate advisory for growing businesses. Financial modelling, business planning, management reporting, internal controls, and corporate finance support from qualified professionals.',
  alternates: { canonical: 'https://next-genbpo.com/corporate-advisory-services' },
  keywords: ['corporate advisory services', 'financial modelling services', 'business planning outsourcing', 'management reporting advisory', 'internal controls advisory', 'corporate finance support', 'feasibility study services', 'CFO advisory outsourcing', 'finance advisory Pakistan', 'accounting advisory services'],
  openGraph: {
    title: 'Corporate Advisory Services | NextGen BPO Solutions',
    description: 'CA-led financial modelling, business planning, management reporting, and internal controls advisory for growing businesses and finance teams.',
    url: 'https://next-genbpo.com/corporate-advisory-services',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Corporate Advisory Services',
  description: 'CA-led corporate advisory covering financial modelling, business planning, management reporting design, internal controls documentation, and corporate finance support for growing businesses.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: [{ '@type': 'Country', name: 'Pakistan' }, { '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'United Kingdom' }, { '@type': 'Country', name: 'Saudi Arabia' }],
  serviceType: 'Corporate Advisory',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What type of businesses use corporate advisory services?',
      acceptedAnswer: { '@type': 'Answer', text: 'Corporate advisory services are typically used by owner-managed businesses and SMEs that need structured financial analysis and reporting but do not have an in-house CFO or finance director. They are also used by growth-stage companies preparing for investment, acquisition, or expansion, and by businesses that have outgrown basic bookkeeping and need management information that actually informs decisions.' },
    },
    {
      '@type': 'Question',
      name: 'What does a financial model typically include?',
      acceptedAnswer: { '@type': 'Answer', text: 'A financial model built by our team typically includes an integrated three-statement model (P&L, balance sheet, and cash flow), scenario analysis with adjustable assumptions, revenue and cost build-up by business unit or product line, working capital and capex projections, debt and equity structure, and an executive summary dashboard. Models are built to be used — not delivered and forgotten — and we structure them so that your team can update the key assumptions without restructuring the model.' },
    },
    {
      '@type': 'Question',
      name: 'Can you help with business planning for a bank or investor presentation?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We support businesses preparing financial information for bank financing, private equity or venture investment, acquisition funding, and government tender submissions. This includes preparing the financial projections, assumptions documentation, and the financial section of the business plan. We do not write the narrative sections of a business plan but we ensure the financial content is accurate, internally consistent, and presented to a professional standard.' },
    },
    {
      '@type': 'Question',
      name: 'What internal controls documentation do you help with?', 
      acceptedAnswer: { '@type': 'Answer', text: 'We help businesses document their existing financial processes and controls — purchase-to-pay, order-to-cash, payroll, and financial close cycles — and identify gaps or weaknesses in those controls. For businesses preparing for an audit, seeking ISO or other certification, or implementing a new ERP, having documented controls is a prerequisite. We do not conduct internal audits but we prepare the documentation and process maps that support audit readiness.' },
    },
    {
      '@type': 'Question',
      name: 'Do you provide ongoing advisory or just one-off project support?',
      acceptedAnswer: { '@type': 'Answer', text: 'Both. Some clients engage us for a specific deliverable — a financial model for an investment round, a three-year business plan, or a management reporting pack redesign. Others retain us on an ongoing basis for a defined advisory function, such as monthly management reporting review and commentary, or quarterly financial performance analysis. Engagement structure is flexible and agreed at the start.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'Corporate Advisory Services', item: 'https://next-genbpo.com/corporate-advisory-services' },
  ],
};

export default function CorporateAdvisoryServicesPage() {
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
              Corporate Advisory
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Corporate advisory and financial analysis for businesses that need more than accounting records
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We provide financial modelling, business planning, management reporting design, and internal controls advisory for growing businesses and owner-managed companies — delivered by Chartered Accountants who understand both the numbers and the decisions they need to inform.
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
            <p className="text-xs text-brand-gray mt-4">CA-led analysis. Decision-ready deliverables. Clear assumptions.</p>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What corporate advisory covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>Corporate advisory sits above the day-to-day accounting function. While bookkeeping and financial reporting tell you what happened, corporate advisory work focuses on what those numbers mean for your business decisions — whether you are planning an expansion, raising debt financing, preparing for an investor presentation, or trying to understand why margins have moved over the past three quarters.</p>
              <p>At NextGen BPO, our corporate advisory work is led by Chartered Accountants with experience in financial modelling, management reporting design, and business planning across a range of sectors and entity types. This is not consulting in the broad sense — we are accountants who can build models that work, prepare forecasts that hold up to scrutiny, and design management information that is actually useful to the people making decisions at your business.</p>
              <p>Corporate advisory engagements are typically structured around a specific deliverable or an ongoing function. A business preparing for a bank loan needs a working financial model and a documented set of assumptions — a defined project with a clear output. A management team that wants better monthly reporting needs an ongoing design and advisory function, not a one-off document. We work in both formats, with the engagement structure agreed at the start based on what you actually need.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Who We Help */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Who uses corporate advisory services</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Owner-managed businesses and SMEs', description: 'Businesses where the owner or founders are making strategic decisions without access to a CFO or finance director — and who need professional financial analysis to inform those decisions rather than relying only on their accountant\'s year-end accounts.' },
              { title: 'Growth-stage companies preparing for investment', description: 'Companies approaching angel investors, private equity, or banks for funding, who need financial models and business plans that present their projections professionally and withstand investor or lender scrutiny.' },
              { title: 'Businesses entering new markets or launching new products', description: 'Companies that need a robust financial assessment of a new market, product line, or operational change before committing capital and resources — including sensitivity analysis across key assumptions.' },
              { title: 'Finance teams building or redesigning management reporting', description: 'Internal finance functions that have outgrown their current management reports and need a structured redesign of the reporting pack — including KPIs, board-level dashboards, and variance commentary frameworks.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Business challenges we address through advisory</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Decisions being made without reliable financial data', description: 'Management teams operating on gut instinct or outdated year-end accounts rather than current, structured financial information that reflects what is actually happening in the business.' },
              { title: 'Financial models built in-house that do not hold up', description: 'Spreadsheet forecasts with hardcoded numbers, broken links, and assumptions that have not been tested — which create credibility problems when presented to investors or lenders.' },
              { title: 'No clear view of cash flow position and runway', description: 'Growing businesses that are profitable on paper but managing cash poorly, without a rolling cash flow forecast that identifies gaps before they become emergencies.' },
              { title: 'Management reports that tell you what happened, not why', description: 'Monthly packs that present numbers without variance analysis, commentary, or the context that makes them actionable for decision-making at the management level.' },
              { title: 'Undocumented financial processes creating audit risk', description: 'Finance functions where key processes live in individual knowledge rather than documented procedures — creating risk when staff change and difficulty during audit or due diligence.' },
              { title: 'Business planning for a funding round with no finance support', description: 'Founders preparing for investment or a bank facility without access to a qualified professional who can build the financial projections to a standard lenders and investors expect.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Corporate advisory services scope</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following covers the range of advisory work our team undertakes. Not every engagement covers all of these — scope is agreed based on your specific requirements.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Integrated three-statement financial model development (P&L, balance sheet, cash flow)',
              'Business unit and product-level P&L model construction',
              'Revenue build and pricing assumption modelling',
              'Three to five year financial projection preparation',
              'Scenario and sensitivity analysis (base, upside, downside cases)',
              'Working capital cycle analysis and optimisation modelling',
              'Capex and depreciation schedule integration into business model',
              'Debt service and loan covenant compliance modelling',
              'Investment return and IRR calculation for project appraisals',
              'Feasibility study financial analysis for new ventures or markets',
              'Business plan financial section preparation for bank or investor submission',
              'Management reporting pack design and KPI framework development',
              'Board-level financial dashboard design and preparation',
              'Monthly variance analysis and management commentary',
              'Rolling cash flow forecast preparation and maintenance',
              'Budget preparation and budget-versus-actual framework design',
              'Internal controls documentation (process flows, risk and control matrix)',
              'Finance function review and process improvement recommendations',
              'Due diligence financial analysis support for acquisitions',
              'Post-acquisition financial integration support and reporting design',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why businesses use external corporate advisory rather than building it in-house</h2>
            <div className="space-y-6">
              {[
                { title: 'CFO-level capability without the CFO cost', description: 'Hiring a qualified CFO is expensive and often premature for a business at the SME or growth stage. Engaging a CA-led advisory team on a project or retained basis provides structured financial analysis at a fraction of the cost of a full-time hire.' },
                { title: 'Models and reports built to a professional standard from the start', description: 'Many businesses inherit financial models and reporting packs that were built quickly and have grown unwieldy. Rebuilding them properly with clear assumptions, documented logic, and a usable structure saves significant time and avoids the credibility issues that poorly-constructed financial documents create.' },
                { title: 'An objective perspective on the numbers', description: 'Management teams that are close to the business often have assumptions built into their financial thinking that are difficult to challenge internally. An external advisory team applies a more objective lens to projections and assumptions — particularly useful before an investor or lender meeting.' },
                { title: 'Project-based or ongoing — structured around your actual need', description: 'Corporate advisory work often does not fit neatly into a recurring monthly scope. Engaging on a project basis for specific outputs — a financial model, a budget, a reporting redesign — means you access the right expertise at the right time without a long-term overhead commitment.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why businesses choose NextGen BPO for corporate advisory</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'Chartered Accountants with modelling and advisory experience', body: 'Our advisory work is carried out by qualified CAs with direct experience in financial modelling, business planning, and management reporting — not junior analysts or generalists. Every advisory deliverable is reviewed before it reaches you.' },
              { heading: 'Deliverables built to be used, not just delivered', body: 'We build financial models with clear assumption sheets, documented logic, and structures that your team can update without restructuring the file. Reports are designed around how you actually use them, not around what is easiest to produce.' },
              { heading: 'Combined with accounting capability for integrated engagements', body: 'Because we also handle bookkeeping, management accounting, and financial reporting, advisory work can draw directly on the accounting data we manage. This integration produces better analysis than advisory work done in isolation from the accounting function.' },
              { heading: 'Flexible engagement structure — project or retained', body: 'We work on defined project deliverables or ongoing retained advisory functions, depending on what your business needs. Both formats are scoped in writing at the start with clear deliverables, timelines, and fees.' },
              { heading: 'Confidential handling of commercially sensitive information', body: 'Business planning and financial modelling work involves commercially sensitive assumptions, projections, and strategic information. All advisory engagements are covered by a signed NDA and restricted to the team working on your file.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How a corporate advisory engagement is structured</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Brief and scope', description: 'We discuss the business context, the decision being informed, and the specific outputs required. A written scope covers deliverables, timeline, required inputs, and assumptions to be used.' },
              { step: '02', title: 'Data gathering and analysis', description: 'We collect the necessary financial data, prior accounts, management information, and assumptions. For modelling work, we validate the input data and flag any gaps before building begins.' },
              { step: '03', title: 'Delivery and CA review', description: 'Work is completed to the agreed scope and reviewed by a Chartered Accountant before delivery. For complex models, we deliver a draft for your review before finalising.' },
              { step: '04', title: 'Handover and ongoing support', description: 'Deliverables are explained and handed over with documentation. For retained advisory work, a recurring schedule is established. For project work, we are available for follow-up queries during the period the output is in use.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about corporate advisory services</h2>
            <div className="space-y-6">
              {[
                { q: 'What type of businesses use corporate advisory services?', a: 'Corporate advisory services are typically used by owner-managed businesses and SMEs that need structured financial analysis but do not have an in-house CFO. They are also used by growth-stage companies preparing for investment or expansion, and by businesses that have outgrown basic bookkeeping and need management information that informs decisions.' },
                { q: 'What does a financial model typically include?', a: 'A financial model built by our team typically includes an integrated three-statement model (P&L, balance sheet, and cash flow), scenario analysis with adjustable assumptions, revenue and cost build-up by business unit, working capital and capex projections, and an executive summary dashboard. Models are built to be used and updated by your team.' },
                { q: 'Can you help with business planning for a bank or investor presentation?', a: 'Yes. We support businesses preparing financial information for bank financing, private equity investment, or acquisition funding. This includes financial projections, assumptions documentation, and the financial section of the business plan. We ensure the financial content is accurate, internally consistent, and presented professionally.' },
                { q: 'What internal controls documentation do you help with?', a: 'We help businesses document existing financial processes and controls — purchase-to-pay, order-to-cash, payroll, and financial close cycles — and identify gaps or weaknesses. For businesses preparing for an audit or implementing a new ERP, documented controls are a prerequisite. We prepare the documentation and process maps that support audit readiness.' },
                { q: 'Do you provide ongoing advisory or just one-off project support?', a: 'Both. Some clients engage us for a specific deliverable such as a financial model or a business plan. Others retain us on an ongoing basis for a defined advisory function such as monthly management reporting review and commentary. Engagement structure is flexible and agreed at the start.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about what you need analysed or built</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us the business context, the decision you are trying to inform, and what you need us to produce. We will scope a clear engagement around that requirement.</p>
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
              { title: 'Financial Reporting Services', href: '/financial-reporting-services', description: 'Monthly MIS packs, management accounts, variance analysis, and board-ready financial reports prepared by our finance team.' },
              { title: 'Accounting Outsourcing', href: '/accounting-outsourcing', description: 'Full-cycle accounting outsourcing including month-end close, reconciliations, and management reporting under CA supervision.' },
              { title: 'Pakistan Taxation Services', href: '/pakistan-taxation-services', description: 'Pakistan income tax, sales tax, and withholding tax compliance for businesses, individuals, and international entities operating in Pakistan.' },
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
