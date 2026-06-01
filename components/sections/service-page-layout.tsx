import Link from 'next/link';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ServicePageData } from '@/lib/data/service-pages';
import { CONTACT } from '@/lib/constants';

interface ServicePageLayoutProps {
  data: ServicePageData;
}

export function ServicePageLayout({ data }: ServicePageLayoutProps) {
  const { hero, audience, includes, deliverables, whyUs } = data;

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-br from-white via-brand-light to-white overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold tracking-wide uppercase mb-6">
              {hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight mb-6">
              {hero.heading}
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8 max-w-2xl">
              {hero.subheading}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/#contact">
                  Request a Consultation
                  <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/#services">View All Services</Link>
              </Button>
            </div>
            <p className="text-xs text-brand-gray mt-4">
              Confidential consultation. Clear scope. Senior-reviewed delivery.
            </p>
          </div>
        </Container>
      </section>

      {/* Who we help */}
      <section className="py-16 bg-white border-y border-brand-border/60">
        <Container>
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-3">Who this is for</h2>
              <p className="text-brand-gray text-sm leading-relaxed">
                This service is designed for firms and finance teams that need dependable, reviewed capacity, not a generic outsourcing arrangement.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-4">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-brand-border/60 bg-brand-light p-4">
                  <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-brand-dark font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Scope */}
      <section className="py-16 lg:py-20 bg-brand-light">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">What is included</h2>
              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-gray">
                    <ChevronRight className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Deliverables</h2>
              <ul className="space-y-3">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-gray">
                    <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Why NextGen BPO */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-brand-dark mb-10">
            Why firms and finance teams choose NextGen BPO
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.heading}
                className="rounded-2xl border border-brand-border/60 bg-brand-light p-6"
              >
                <h3 className="text-base font-semibold text-brand-dark mb-2">{item.heading}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
              Get started
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Tell us what you need. We will scope the engagement.
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Share your firm type, service requirement and volume. We will respond with a clear engagement scope and the next practical step.
            </p>
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
            <p className="text-xs text-white/40 mt-6">
              Confidential. No commitment required. CA-led team.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
