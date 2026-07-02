import Link from 'next/link';
import { Container } from '@/components/ui/container';

/* Single source for the visible FAQ and the FAQPage JSON-LD on /wht-calculator.
   Server component — rendered into static HTML so the answers are fully
   indexable. The schema is generated from this same array, so visible content
   and structured data can never drift apart. */

export const WHT_FAQ_ITEMS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'What is withholding tax in Pakistan?',
    answer:
      'Withholding tax (WHT) is tax deducted at source under the Income Tax Ordinance 2001. The payer — an employer, company, bank, or property registrar — deducts a prescribed percentage before paying you and deposits it with the FBR. Depending on the section, the deduction is either adjustable against your final tax liability or treated as final tax.',
  },
  {
    question: 'What are the withholding tax rates for 2026-27?',
    answer:
      'Rates vary by section and transaction type under the Finance Act 2026. Salary (Section 149) is taxed through progressive slabs from 0% to 35% of annual taxable income. Other sections — dividends, profit on debt, rent, goods, services, contracts, and property transactions — each carry their own rates, which also differ by taxpayer type and Active Taxpayer List status. This calculator applies the current rate tables for FY 2026-27 automatically, and Tax Year 2025-26 remains selectable for prior-year calculations.',
  },
  {
    question: 'What is the difference between ATL and Non-ATL rates?',
    answer:
      'The Active Taxpayer List (ATL) is the FBR register of filers. Persons not appearing on the ATL generally suffer significantly higher withholding — for many sections the rate is doubled under the Tenth Schedule of the Income Tax Ordinance 2001. The calculator shows both treatments where a section distinguishes filer status.',
  },
  {
    question: 'How is withholding tax calculated on salary?',
    answer:
      'Under Section 149, the employer estimates annual taxable salary (including bonus and allowances), applies the progressive slab rates for the tax year to compute the annual tax, then divides by the number of pay periods to arrive at the monthly deduction. This calculator shows the full slab-by-slab breakdown and the per-period deduction.',
  },
  {
    question: 'Is withholding tax refundable?',
    answer:
      'Adjustable withholding tax is credited against your assessed tax liability when you file your income tax return — any excess can be claimed as a refund from the FBR. Withholding that falls under the final tax regime is not refundable, as it constitutes full and final discharge of tax on that income stream.',
  },
  {
    question: 'Which sections does this calculator cover?',
    answer:
      'The calculator covers withholding categories of the Income Tax Ordinance 2001: imports (148), salary (149), dividends (150), profit on debt (151), life insurance and takaful payouts (151B), payments to non-residents (152), goods, services and contracts (153), digital transactions (153(2A)), exports (154), IT exports (154A), social media platform revenue (154B), rent (155), prizes (156), commission (233), and property transactions (236C and 236K) — at Finance Act 2026 rates for FY 2026-27.',
  },
];

export function CalculatorFaq() {
  return (
    <section className="py-16 lg:py-20 bg-white" aria-labelledby="wht-faq-heading">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h2 id="wht-faq-heading" className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
            Pakistan Withholding Tax — Frequently Asked Questions
          </h2>
          <p className="text-brand-gray mb-8">
            Common questions about withholding tax under the Income Tax Ordinance 2001 and the
            Finance Act 2026 (tax year 2026-27). For the full rate summary and what changed this
            year, see our{' '}
            <Link href="/tax-year-2027-pakistan" className="text-brand-green font-medium hover:underline">
              Tax Year 2027 Pakistan guide and WHT Rate Card TY 2027
            </Link>
            .
          </p>
          <div className="space-y-3">
            {WHT_FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group bg-white rounded-2xl border border-brand-border/60 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-base font-semibold text-brand-dark [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <svg
                    className="w-5 h-5 flex-shrink-0 text-brand-gray transition-transform duration-200 group-open:rotate-180"
                    viewBox="0 0 20 20" fill="none" aria-hidden="true"
                  >
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-sm text-brand-gray leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="text-xs text-brand-gray mt-8 leading-relaxed">
            This information is general guidance only and does not constitute tax advice. For
            engagement-specific advice, see our{' '}
            <a href="/pakistan-taxation-services" className="text-brand-green font-medium hover:underline">
              Pakistan taxation services
            </a>{' '}
            or consult a qualified tax professional.
          </p>
        </div>
      </Container>
    </section>
  );
}
