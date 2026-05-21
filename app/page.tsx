import { Hero } from '@/components/sections/hero';
import { TrustedBy } from '@/components/sections/trusted-by';
import { ServicesGrid } from '@/components/sections/services-grid';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { ProcessWorkflow } from '@/components/sections/process-workflow';
import { IndustryExpertise } from '@/components/sections/industry-expertise';
import { Statistics } from '@/components/sections/statistics';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { CTABanner } from '@/components/sections/cta-banner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ServicesGrid />
      <WhyChooseUs />
      <ProcessWorkflow />
      <IndustryExpertise />
      <Statistics />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}