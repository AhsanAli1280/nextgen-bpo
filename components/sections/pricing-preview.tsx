import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Calculator,
  FileCheck,
  Landmark,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { PRICING_CATEGORIES, servicesByCategory } from '@/lib/data/pricing-catalog';

const CATEGORY_META: Record<(typeof PRICING_CATEGORIES)[number], { icon: typeof Calculator; blurb: string }> = {
  'Income Tax Return': {
    icon: Calculator,
    blurb: 'NTN registration, annual returns, and withholding statements.',
  },
  'Sales Tax Registration & Filing': {
    icon: FileCheck,
    blurb: 'GST and provincial sales tax registration and monthly filing.',
  },
  'Company Registration': {
    icon: Building2,
    blurb: 'SECP private limited, SMC, LLP, and AOP incorporation.',
  },
  'Intellectual Property': {
    icon: ShieldCheck,
    blurb: 'Trademark, copyright, and patent registration.',
  },
  'USA LLC & Tax Filing': {
    icon: Landmark,
    blurb: 'US company formation, EIN, and state and federal tax filing.',
  },
  'Accounting & Professional Support': {
    icon: Briefcase,
    blurb: 'Bookkeeping, audit support, and CPA firm support engagements.',
  },
};

export function PricingPreview() {
  return (
    <section id="pricing" className="py-20 lg:py-24 bg-brand-light border-y border-brand-border/60" aria-labelledby="pricing-preview-heading">
      <Container>
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 id="pricing-preview-heading" className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Transparent professional fees
          </h2>
          <p className="text-lg text-brand-gray">
            Every service is published with a clear fee basis — fixed professional fees,
            starting fees confirmed before work begins, or a tailored quotation for scope-based
            engagements.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRICING_CATEGORIES.map((category) => {
            const { icon: Icon, blurb } = CATEGORY_META[category];
            const count = servicesByCategory(category).length;
            return (
              <Link
                key={category}
                href="/pricing"
                className="group rounded-2xl border border-brand-border/60 bg-white p-6 motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-green" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-brand-dark mb-1.5 group-hover:text-brand-blue transition-colors">
                  {category}
                </h3>
                <p className="text-sm text-brand-gray leading-relaxed mb-3">{blurb}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
                  {count} {count === 1 ? 'service' : 'services'}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/pricing">
              View All Services &amp; Pricing
              <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
