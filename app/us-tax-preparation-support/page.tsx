import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'US Tax Preparation Support Services | NextGen BPO Solutions',
  description: 'CA-led US tax preparation support for CPA firms and tax practices. Source document organisation, workpaper preparation, 1040/1065/1120 support, and preparer-ready returns.',
  alternates: { canonical: 'https://next-genbpo.com/us-tax-preparation-support' },
  keywords: ['US tax preparation support', 'tax return outsourcing', 'CPA firm tax support', '1040 preparation outsourcing', 'US tax outsourcing services', 'offshore tax preparation', 'tax season support', 'individual tax return support', 'business tax preparation outsourcing'],
  openGraph: {
    title: 'US Tax Preparation Support Services | NextGen BPO Solutions',
    description: 'CA-led US tax preparation support for CPA firms and tax practices. Source document organisation, workpaper preparation, and preparer-ready return support.',
    url: 'https://next-genbpo.com/us-tax-preparation-support',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'US Tax Preparation Support Services',
  description: 'CA-led US tax preparation support for CPA firms and tax practices, covering source document organisation, workpaper preparation, 1040, 1065, 1120 support, and preparer-ready return preparation.',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'United Kingdom' }],
  serviceType: 'US Tax Preparation Support',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What US tax return types does your team support?',
      acceptedAnswer: { '@type': 'Answer', text: 'We support preparation assistance for US individual returns (Form 1040), partnership returns (Form 1065), S-corporation returns (Form 1120-S), C-corporation returns (Form 1120), and trust and estate returns (Form 1041). All returns are prepared to a preparer-ready standard for your review and sign-off.' },
    },
    {
      '@type': 'Question',
      name: 'Is your team qualified to handle US tax returns?',
      acceptedAnswer: { '@type': 'Answer', text: 'Our team supports the preparation process under the supervision of your licensed CPA or EA. We do not sign returns or provide US tax advice independently. The engagement is structured so that all prepared returns go through your firm\'s review process before filing. This is the same offshore tax preparation model used by many US CPA firms.' },
    },
    {
      '@type': 'Question',
      name: 'How do you handle confidential client tax documents?',
      acceptedAnswer: { '@type': 'Answer', text: 'All tax engagements are covered by a signed NDA with role-based access to client documents. We work within your firm\'s existing document management system where possible. Handoffs are documented and access is limited to the team members assigned to each client.' },
    },
    {
      '@type': 'Question',
      name: 'What tax software do you work in?',
      acceptedAnswer: { '@type': 'Answer', text: 'We work in Lacerte, ProConnect, Drake Tax, and UltraTax CS, depending on your firm\'s platform. We follow your firm\'s existing workflow and file organisation standards rather than introducing a separate process.' },
    },
    {
      '@type': 'Question',
      name: 'How does tax season capacity work with an outsourced arrangement?',
      acceptedAnswer: { '@type': 'Answer', text: 'We agree on projected volume at the start of the engagement and allocate capacity accordingly. For firms with predictable seasonal peaks, we build the schedule around your filing deadlines. For ad hoc overflow, engagements can be scoped on a per-batch basis.' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://next-genbpo.com/#services' },
    { '@type': 'ListItem', position: 3, name: 'US Tax Preparation Support', item: 'https://next-genbpo.com/us-tax-preparation-support' },
  ],
};

export default function USTaxPreparationSupportPage() {
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
              US Tax Preparation Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              US tax preparation support that keeps your CPA firm&apos;s workload manageable at peak season
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              We support US CPA firms and tax practices with organised, preparer-ready tax return workpapers across individual and business return types — covering source document organisation, prior-year comparison, data entry, and workpaper assembly, all under CA supervision before your partner review.
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
            <p className="text-xs text-brand-gray mt-4">Confidential. NDA-backed. Preparer-ready deliverables.</p>
          </div>
        </Container>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">What US tax preparation support covers</h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>US tax preparation support is a specific type of outsourcing engagement in which an offshore accounting team handles the preparation and workpaper assembly stages of a tax return, leaving the final review, client communication, and e-filing signature to the CPA or Enrolled Agent at your firm. This model is well-established among US tax practices of all sizes and is the primary method through which firms manage high-volume filing seasons without a proportional increase in full-time staff.</p>
              <p>At NextGen BPO, this means our team works through your client list, organises the source documents provided, completes prior-year comparisons, flags missing information, prepares the return in your tax software, and assembles the workpaper file to your firm&apos;s standard. When we deliver a return to your review queue, it should require a partner review and sign-off — not a rework session.</p>
              <p>Our team has experience across the full range of individual and business return types common in US practices, including Form 1040 with schedules, Form 1065 for partnerships, Form 1120 and 1120-S for corporations, and Form 1041 for trusts and estates. Engagements are structured to match your firm&apos;s workflow, deadlines, and file management process rather than introducing a separate system.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Who We Help */}
      <section className="py-16 bg-brand-light">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Who this service is designed for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'CPA firms with seasonal volume spikes', description: 'Practices that manage 300 to 3,000+ returns per season and need additional preparation capacity from January through April and September through October without hiring seasonal staff.' },
              { title: 'Small and mid-size tax practices', description: 'Independent CPA or EA practices where one or two principals handle the review function and need the preparation workload handled by a qualified offshore team.' },
              { title: 'Multi-service accounting firms', description: 'Firms that offer both accounting and tax services and want their tax preparation production separated from their accounting team so neither function pulls capacity from the other.' },
              { title: 'Growth-stage CPA firms expanding their client base', description: 'Firms that are growing faster than they can hire, needing a scalable preparation resource that grows with the client portfolio without a corresponding increase in overhead.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Tax season challenges we solve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Preparation backlog during filing deadlines', description: 'Returns piling up faster than your team can process them, creating deadline risk and client service issues.' },
              { title: 'Staff burnout over extended tax seasons', description: 'Preparation staff working unsustainable hours from February through April, leading to errors and post-season attrition.' },
              { title: 'Inconsistent workpaper quality', description: 'Returns reaching the review queue in different states of completeness, requiring partners to spend time on preparation rather than review.' },
              { title: 'High cost of seasonal US-based hires', description: 'Temporary tax preparers are expensive, require training, and often leave at the end of season with no continuity into the following year.' },
              { title: 'Missing document follow-up taking preparer time', description: 'Preparers spending time chasing clients for missing W-2s, 1099s, and K-1s instead of working on completed files.' },
              { title: 'No continuity between tax seasons', description: 'Starting each season without the prior-year context and client-specific knowledge that reduces preparation time and errors.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Detailed scope of US tax preparation support</h2>
          <p className="text-brand-gray mb-8 max-w-2xl">The following tasks are covered within a typical US tax preparation support engagement. Scope is agreed in writing before the engagement starts.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Source document collection checklist preparation per client type',
              'Document organisation and indexing by tax category',
              'Prior-year return review and year-over-year comparison',
              'Missing document identification and flagging',
              'W-2, 1099, K-1, and other income document data entry',
              'Schedule A itemised deductions preparation',
              'Schedule B interest and dividend income entry',
              'Schedule C sole proprietor business income preparation',
              'Schedule D capital gains and losses reconciliation',
              'Schedule E rental income and pass-through income entry',
              'Form 1065 partnership return preparation',
              'Form 1120-S S-corporation return preparation',
              'Form 1120 C-corporation return preparation',
              'Form 1041 trust and estate return preparation',
              'Depreciation schedule updates and asset additions',
              'Basis calculations for partnership and S-corp interests',
              'State return preparation to match federal data',
              'Workpaper assembly to firm-standard format',
              'Preparer notes and flagged items for partner review',
              'Return preparation in Lacerte, ProConnect, Drake, or UltraTax',
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
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Why US CPA firms use offshore tax preparation support</h2>
            <div className="space-y-6">
              {[
                { title: 'Preparation volume exceeds what in-house staff can absorb', description: 'Many CPA firms reach a point where the number of returns they take on during filing season cannot be processed by existing staff without overtime, errors, or delayed filings. Offshore support provides capacity at a fraction of the cost of domestic temporary hires.' },
                { title: 'Partners and senior CPAs should be reviewing, not preparing', description: 'In firms where senior staff spend significant time on data entry and document organisation, offshore preparation frees them to focus on review, planning, and client relationships — activities that generate more revenue per hour.' },
                { title: 'The model is established and well-understood by the IRS', description: 'Offshore tax return preparation is a recognised and IRS-compliant practice when structured correctly, with the CPA or EA signing all returns. Many of the largest US accounting firms use this model for their own preparation workflows.' },
                { title: 'Consistent output year over year with the same team', description: 'Unlike seasonal domestic hires who may not return the following year, an offshore team assigned to your firm builds knowledge of your clients, your file standards, and your review preferences — reducing preparation time and improving quality each successive season.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">Why CPA firms choose NextGen BPO for US tax preparation support</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { heading: 'CA-supervised preparation with partner-ready output', body: 'Our preparation team works under Chartered Accountant supervision. Before a return reaches your review queue, it has been through an internal check. The goal is that your partner review should be a review, not a correction session.' },
              { heading: 'NDA-backed with restricted document access', body: 'All client tax documents are handled under a signed NDA with access limited to the assigned team. We work within your document management system where possible and maintain a documented chain of access for every client file.' },
              { heading: 'Experienced across all major US return types', body: 'Our team has direct preparation experience with Forms 1040, 1065, 1120, 1120-S, and 1041, including multi-state returns and schedules. We are not general accountants learning tax during your busiest months.' },
              { heading: 'Works in your software and follows your process', body: 'We prepare in Lacerte, ProConnect, Drake, or UltraTax according to your firm standard. We follow your workpaper format, your file naming convention, and your review checklist rather than introducing a parallel system.' },
              { heading: 'Named team with multi-season continuity', body: 'The same team handles your returns each season. Prior-year knowledge, client-specific notes, and your firm\'s preferences are retained from one filing season to the next, which meaningfully reduces preparation time over time.' },
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
          <h2 className="text-2xl font-bold text-brand-dark mb-8">How we structure a tax preparation engagement</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Engagement scoping', description: 'We agree on return types, expected volume, filing deadlines, software, and file delivery format. A written scope document covers the process before any client files are shared.' },
              { step: '02', title: 'NDA and access setup', description: 'Signed NDA, role-based access to your document system, and an agreed communication protocol for missing document queries and review flags.' },
              { step: '03', title: 'Preparation and internal review', description: 'Returns are prepared to your firm standard, flagged items are documented, and each return goes through an internal check before delivery to your review queue.' },
              { step: '04', title: 'Review, sign-off, and filing', description: 'Your partner or CPA reviews the preparer-ready return, makes any adjustments, and signs the return for filing. We are available for any queries on the workpapers during this stage.' },
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
            <h2 className="text-2xl font-bold text-brand-dark mb-8">Frequently asked questions about US tax preparation support</h2>
            <div className="space-y-6">
              {[
                { q: 'What US tax return types does your team support?', a: 'We support preparation assistance for US individual returns (Form 1040), partnership returns (Form 1065), S-corporation returns (Form 1120-S), C-corporation returns (Form 1120), and trust and estate returns (Form 1041). All returns are prepared to a preparer-ready standard for your review and sign-off.' },
                { q: 'Is your team qualified to handle US tax returns?', a: "Our team supports the preparation process under the supervision of your licensed CPA or EA. We do not sign returns or provide US tax advice independently. The engagement is structured so that all prepared returns go through your firm's review process before filing. This is the same offshore tax preparation model used by many US CPA firms." },
                { q: 'How do you handle confidential client tax documents?', a: 'All tax engagements are covered by a signed NDA with role-based access to client documents. We work within your existing document management system where possible. Handoffs are documented and access is limited to the team members assigned to each client.' },
                { q: 'What tax software do you work in?', a: "We work in Lacerte, ProConnect, Drake Tax, and UltraTax CS, depending on your firm's platform. We follow your firm's existing workflow and file organisation standards rather than introducing a separate process." },
                { q: 'How does tax season capacity work with an outsourced arrangement?', a: 'We agree on projected volume at the start of the engagement and allocate capacity accordingly. For firms with predictable seasonal peaks, we build the schedule around your filing deadlines. For ad hoc overflow, engagements can be scoped on a per-batch basis.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Talk to us about your tax season capacity</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Tell us your return volume, the types of returns your firm handles, and when your peak deadlines fall. We will scope an engagement around your season.</p>
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
              { title: 'CPA Firm Support', href: '/cpa-firm-support', description: 'Full back-office production support for CPA firms including bookkeeping, client onboarding, and workpaper preparation across the full client portfolio.' },
              { title: 'Pakistan Taxation Services', href: '/pakistan-taxation-services', description: 'Income tax, sales tax, and withholding tax compliance for businesses and individuals operating in Pakistan.' },
              { title: 'Offshore Accounting Staffing', href: '/offshore-accounting-staffing', description: 'Dedicated offshore accounting resources for firms needing reliable, supervised capacity on a consistent basis.' },
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
