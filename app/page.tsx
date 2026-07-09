import type { Metadata } from 'next';
import { faqSchema } from '@/lib/structured-data';
import { Hero } from '@/components/sections/hero';
import { TrustedBy } from '@/components/sections/trusted-by';
import { ServicesGrid } from '@/components/sections/services-grid';
import { PricingPreview } from '@/components/sections/pricing-preview';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { ProcessWorkflow } from '@/components/sections/process-workflow';
import { IndustryExpertise } from '@/components/sections/industry-expertise';
import { Statistics } from '@/components/sections/statistics';
import { CalculatorPromo } from '@/components/sections/calculator-promo';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { Leadership } from '@/components/sections/leadership';
import { CTABanner } from '@/components/sections/cta-banner';

export const metadata: Metadata = {
  alternates: { canonical: 'https://next-genbpo.com' },
};

export default function HomePage() {
  return (
    <>
      {/* FAQPage schema is page-scoped (not in the root layout): the FAQ content
          renders only on this page, and service pages carry their own FAQPage
          schema — a sitewide copy would create duplicate-schema collisions. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <CalculatorPromo />
      <TrustedBy />
      <ServicesGrid />
      <PricingPreview />
      <WhyChooseUs />
      <ProcessWorkflow />
      <IndustryExpertise />
      <Statistics />
      <Testimonials />
      <FAQ />
      <Leadership />
      <CTABanner />
    </>
  );
}
