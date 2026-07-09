import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { PricingExplorer } from '@/components/pricing/pricing-explorer';
import {
  PRICING_CATALOG,
  PricedService,
  formatAmount,
} from '@/lib/data/pricing-catalog';

const BASE_URL = 'https://next-genbpo.com';
const PAGE_URL = `${BASE_URL}/pricing`;

export const metadata: Metadata = {
  title: 'Services & Pricing — Tax, Registration, USA Formation & Accounting',
  description:
    'Transparent professional fees for NTN registration, income tax filing, GST and sales tax, SECP company registration, trademarks, USA LLC formation, and accounting support. Fixed fees, starting fees, and custom quotes.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Services & Pricing | NextGen BPO Solutions',
    description:
      'Transparent professional fees for taxation, registration, USA company formation, and accounting support services.',
    url: PAGE_URL,
    type: 'website',
  },
};

// Offer markup only where a real numeric professional fee exists; custom-quote
// services are listed without any price. Excluded charges are stated in the
// description, never folded into the price.
function offerForService(service: PricedService): Record<string, unknown> | undefined {
  const { pricing } = service;
  switch (pricing.kind) {
    case 'fixed':
    case 'package':
    case 'per-filing':
      return {
        '@type': 'Offer',
        price: pricing.amount,
        priceCurrency: pricing.currency,
        description: service.excludedCharges
          ? `Professional fee only. ${service.excludedCharges}`
          : 'Professional fee.',
      };
    case 'starting':
      return {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: pricing.amount,
          priceCurrency: pricing.currency,
        },
        description: service.excludedCharges
          ? `Professional fees starting from ${formatAmount(pricing.amount, pricing.currency)}. ${service.excludedCharges}`
          : `Professional fees starting from ${formatAmount(pricing.amount, pricing.currency)}, depending on scope.`,
      };
    case 'tiered':
      return {
        '@type': 'Offer',
        priceSpecification: pricing.tiers.map((tier) => ({
          '@type': 'UnitPriceSpecification',
          name: tier.label,
          price: tier.amount,
          priceCurrency: pricing.currency,
        })),
        description: 'Fixed professional fee by applicant type.',
      };
    case 'custom':
      return undefined;
  }
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'NextGen BPO Services & Pricing',
  itemListElement: PRICING_CATALOG.map((service, index) => {
    const offer = offerForService(service);
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.seoDescription,
        provider: { '@id': `${BASE_URL}/#organization` },
        url: `${PAGE_URL}#${service.id}`,
        ...(offer ? { offers: offer } : {}),
      },
    };
  }),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services & Pricing', item: PAGE_URL },
  ],
};

const FAQS = [
  {
    q: 'Do the listed fees include government charges?',
    a: 'No. Unless stated otherwise, listed amounts are professional fees only. Government, SECP, IPO (Intellectual Property Organization), and US state filing fees are charged separately at actuals where applicable, and are always confirmed with you before work begins.',
  },
  {
    q: 'Why do some services show "Professional Fees Starting From"?',
    a: 'For scope-dependent work such as business tax returns or monthly sales tax filing, the final fee depends on factors like turnover, transaction volume, and the quality of accounting records. The starting amount is the fee for a standard, straightforward engagement — we confirm your exact fee before commencing.',
  },
  {
    q: 'How does a Custom Quote work?',
    a: 'For bookkeeping, audit support, and CPA firm support engagements, pricing is tailored to the scope and requirements of the engagement. Share your requirements through the inquiry form and you will receive a clear quotation after the scope and required deliverables have been reviewed.',
  },
  {
    q: 'How do I get started?',
    a: 'Click the button on any service card and submit the short inquiry form — the service is pre-selected for you. Our team responds within one business day to confirm requirements, timeline, and fee before any work begins.',
  },
  {
    q: 'Are completion times guaranteed?',
    a: 'Completion estimates assume timely provision of complete documents and normal regulatory processing. Where a regulator (FBR, SECP, IPO, or a US state) controls part of the timeline, we keep you informed of progress at each stage.',
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

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 bg-gradient-to-br from-white via-brand-light to-white">
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
                Services &amp; Pricing
              </li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold tracking-wide uppercase mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              Services &amp; Pricing
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed max-w-2xl">
              Clear professional fees for taxation, registration, USA company formation, and
              accounting support. Fixed fees are fixed. Starting fees are confirmed before work
              begins. Scope-based engagements receive a written quotation — never a surprise
              invoice.
            </p>
          </div>
        </Container>
      </section>

      {/* Catalogue */}
      <section className="py-12 lg:py-16 bg-white" aria-labelledby="pricing-catalogue-heading">
        <Container>
          <h2 id="pricing-catalogue-heading" className="sr-only">
            Service catalogue and fees
          </h2>
          <PricingExplorer />
        </Container>
      </section>

      {/* How pricing works */}
      <section className="py-14 lg:py-16 bg-brand-light border-y border-brand-border/60" aria-labelledby="how-pricing-works">
        <Container>
          <h2 id="how-pricing-works" className="text-2xl font-bold text-brand-dark mb-8">
            How our pricing works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-brand-border/60 bg-white p-6">
              <h3 className="text-base font-semibold text-brand-dark mb-2">Fixed Professional Fee</h3>
              <p className="text-sm text-brand-gray leading-relaxed">
                A set fee for well-defined services such as NTN registration or salaried tax
                filing. The amount shown is the amount you pay for the professional service.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-border/60 bg-white p-6">
              <h3 className="text-base font-semibold text-brand-dark mb-2">Professional Fees Starting From</h3>
              <p className="text-sm text-brand-gray leading-relaxed">
                For scope-dependent work, the listed amount covers a standard engagement. Final
                fees depend on factors such as turnover, transaction volume, and record quality —
                confirmed with you before commencement.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-border/60 bg-white p-6">
              <h3 className="text-base font-semibold text-brand-dark mb-2">Custom Quote</h3>
              <p className="text-sm text-brand-gray leading-relaxed">
                Bookkeeping, audit support, and CPA firm support are scoped individually. Pricing
                is tailored to the scope and requirements of the engagement, and you receive a
                clear quotation after the scope and deliverables have been reviewed.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-border/60 bg-white p-6">
            <h3 className="text-base font-semibold text-brand-dark mb-2">
              Government &amp; regulatory fees
            </h3>
            <p className="text-sm text-brand-gray leading-relaxed">
              Listed amounts represent professional fees unless stated otherwise. Government fees,
              regulatory fees, SECP fees, Intellectual Property Organization (IPO) fees, US state
              filing fees, and other third-party charges may be charged separately at actuals where
              applicable. Final scope-dependent fees are confirmed before commencement, and
              completion estimates depend on document availability and regulatory processing
              timelines.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 lg:py-20 bg-white" aria-labelledby="pricing-faq-heading">
        <Container>
          <h2 id="pricing-faq-heading" className="text-2xl font-bold text-brand-dark mb-8">
            Pricing questions, answered
          </h2>
          <div className="max-w-3xl space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-2xl border border-brand-border/60 bg-brand-light p-5 group">
                <summary className="cursor-pointer text-sm sm:text-base font-semibold text-brand-dark list-item rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-brand-gray leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-sm text-brand-gray">
            Looking for full service detail? Explore{' '}
            <Link href="/pakistan-taxation-services" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
              Pakistan taxation
            </Link>
            ,{' '}
            <Link href="/bookkeeping-services" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
              bookkeeping
            </Link>
            ,{' '}
            <Link href="/cpa-firm-support" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
              CPA firm support
            </Link>
            , or{' '}
            <Link href="/us-tax-preparation-support" className="font-medium text-brand-blue hover:text-brand-dark transition-colors">
              US tax preparation
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
