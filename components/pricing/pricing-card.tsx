'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, Info } from 'lucide-react';
import {
  CUSTOM_QUOTE_FOLLOWUP,
  PricedService,
  ctaForPricing,
  formatAmount,
} from '@/lib/data/pricing-catalog';

interface PricingCardProps {
  service: PricedService;
  onInquire: (service: PricedService) => void;
}

function PriceBlock({ service }: { service: PricedService }) {
  const { pricing } = service;

  switch (pricing.kind) {
    case 'fixed':
      return (
        <div>
          <p className="font-mono text-3xl font-bold text-brand-dark">
            {formatAmount(pricing.amount, pricing.currency)}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green mt-1">
            {pricing.feeLabel ?? 'Fixed Professional Fee'}
          </p>
        </div>
      );
    case 'starting':
      return (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Starting From</p>
          <p className="font-mono text-3xl font-bold text-brand-dark mt-1">
            {formatAmount(pricing.amount, pricing.currency)}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray mt-1">
            Professional Fees Starting From
          </p>
        </div>
      );
    case 'tiered':
      return (
        <div>
          <dl className="space-y-1.5">
            {pricing.tiers.map((tier) => (
              <div key={tier.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-sm text-brand-gray">{tier.label}</dt>
                <dd className="font-mono text-xl font-bold text-brand-dark">
                  {formatAmount(tier.amount, pricing.currency)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green mt-2">
            Fixed Professional Fee
          </p>
        </div>
      );
    case 'package':
      return (
        <div>
          <p className="font-mono text-3xl font-bold text-brand-dark">
            {formatAmount(pricing.amount, pricing.currency)}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green mt-1">
            Package Professional Fee
          </p>
          <ul className="mt-3 space-y-1.5">
            {pricing.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-brand-gray">
                <CheckCircle className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'per-filing':
      return (
        <div>
          <p className="font-mono text-3xl font-bold text-brand-dark">
            {formatAmount(pricing.amount, pricing.currency)}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green mt-1">
            Per Separate Filing
          </p>
          <p className="text-xs text-brand-gray mt-2 leading-relaxed">{pricing.filingNote}</p>
        </div>
      );
    case 'custom':
      return (
        <div>
          <p className="text-2xl font-bold text-brand-dark">Custom Quote</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue mt-1">
            Scope-Based Professional Fee
          </p>
          <p className="text-xs text-brand-gray mt-2 leading-relaxed">{pricing.statement}</p>
        </div>
      );
  }
}

export function PricingCard({ service, onInquire }: PricingCardProps) {
  const { pricing } = service;
  const cta = ctaForPricing(pricing);
  const keyRequirements = service.requirements.slice(0, service.keyRequirementCount);
  const remainingRequirements = service.requirements.slice(service.keyRequirementCount);

  return (
    <article id={service.id} className="scroll-mt-28 flex flex-col rounded-2xl border border-brand-border/60 bg-white p-6 shadow-sm motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-brand">
      <span className="self-start inline-block px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green text-[11px] font-semibold tracking-wide uppercase mb-4">
        {service.category}
      </span>

      <h3 className="text-lg font-bold text-brand-dark leading-snug mb-2">{service.title}</h3>
      <p className="text-sm text-brand-gray leading-relaxed mb-5">{service.description}</p>

      <div className="rounded-xl bg-brand-light border border-brand-border/60 p-4 mb-4">
        <PriceBlock service={service} />
        {pricing.kind === 'starting' && (
          <p className="text-xs text-brand-gray mt-2 leading-relaxed">
            Final professional fees depend on {pricing.factors.map((f) => f.toLowerCase()).join(', ')}.
          </p>
        )}
        {pricing.kind === 'custom' && (
          <p className="text-xs text-brand-gray mt-2 leading-relaxed">{CUSTOM_QUOTE_FOLLOWUP}</p>
        )}
      </div>

      {service.excludedCharges && (
        <p className="flex items-start gap-2 text-xs text-brand-gray mb-4 leading-relaxed">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-brand-blue" aria-hidden="true" />
          {service.excludedCharges}
        </p>
      )}

      <p className="flex items-start gap-2 text-xs text-brand-dark font-medium mb-4">
        <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-brand-green" aria-hidden="true" />
        <span>
          <span className="text-brand-gray font-normal">Completion time: </span>
          {service.completionTime}
        </span>
      </p>

      {pricing.kind === 'custom' ? (
        <details className="mb-5 group">
          <summary className="cursor-pointer text-sm font-semibold text-brand-blue hover:text-brand-dark rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 list-item">
            What this can cover
          </summary>
          <ul className="mt-3 space-y-2">
            {pricing.potentialCoverage.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-brand-gray">
                <CheckCircle className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-brand-gray leading-relaxed">
            The final scope is agreed per engagement — not every activity is included in every
            engagement. Fees depend on {pricing.factors.map((f) => f.toLowerCase()).join(', ')}.
          </p>
        </details>
      ) : (
        keyRequirements.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-2.5">
              What you need to provide
            </h4>
            <ul className="space-y-2">
              {keyRequirements.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-brand-gray">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            {remainingRequirements.length > 0 && (
              <details className="mt-2.5">
                <summary className="cursor-pointer text-sm font-semibold text-brand-blue hover:text-brand-dark rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 list-item">
                  View all requirements ({service.requirements.length})
                </summary>
                <ul className="mt-2.5 space-y-2">
                  {remainingRequirements.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-brand-gray">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )
      )}

      {/* CTA row pinned to the card bottom keeps grid rows visually aligned */}
      <div className="mt-auto pt-2 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => onInquire(service)}
          className="inline-flex items-center justify-center min-h-[44px] font-semibold rounded-xl px-6 py-3 text-sm text-white bg-brand-green shadow-brand hover:shadow-2xl motion-safe:transition-all motion-safe:duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green/50"
        >
          {cta.label}
          <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
        </button>
        {service.servicePageHref && (
          <Link
            href={service.servicePageHref}
            className="inline-flex items-center justify-center min-h-[44px] text-sm font-medium text-brand-blue hover:text-brand-dark rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 transition-colors"
          >
            View Service Details
          </Link>
        )}
      </div>
    </article>
  );
}
