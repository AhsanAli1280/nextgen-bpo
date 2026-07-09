'use client';

import { useState } from 'react';
import {
  PRICING_CATALOG,
  PRICING_CATEGORIES,
  PricedService,
  PricingCategory,
} from '@/lib/data/pricing-catalog';
import { PricingCard } from '@/components/pricing/pricing-card';
import { InquiryModal } from '@/components/pricing/inquiry-modal';

type Filter = 'All Services' | PricingCategory;

const FILTERS: Filter[] = ['All Services', ...PRICING_CATEGORIES];

export function PricingExplorer() {
  const [filter, setFilter] = useState<Filter>('All Services');
  const [inquiryService, setInquiryService] = useState<PricedService | null>(null);

  // All 20 services are always rendered on the server for the initial HTML
  // (filter starts at "All Services"); filtering only ever hides cards client-side.
  const visible =
    filter === 'All Services' ? PRICING_CATALOG : PRICING_CATALOG.filter((s) => s.category === filter);

  return (
    <div>
      {/* Category filters — horizontally scrollable on mobile, hidden scrollbar */}
      <div
        role="group"
        aria-label="Filter services by category"
        className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap min-h-[44px] px-4 py-2 rounded-full text-sm font-semibold border motion-safe:transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 ${
                active
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-gray border-brand-border hover:text-brand-dark hover:border-brand-gray'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-brand-gray" aria-live="polite">
        Showing {visible.length} of {PRICING_CATALOG.length} services
        {filter !== 'All Services' ? ` in ${filter}` : ''}.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {visible.map((service) => (
          <PricingCard key={service.id} service={service} onInquire={setInquiryService} />
        ))}
      </div>

      <InquiryModal
        open={inquiryService !== null}
        serviceTitle={inquiryService?.title ?? ''}
        showCompanyField={inquiryService?.category === 'Accounting & Professional Support'}
        onClose={() => setInquiryService(null)}
      />
    </div>
  );
}
