import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { WhtCalculator } from '@/components/wht/calculator';
import { CalculatorFaq, WHT_FAQ_ITEMS } from '@/components/wht/calculator-faq';

/* Load Inter via next/font. This is self-contained to this page:
   - In this standalone repo it ensures Inter is available.
   - In the main NextGen BPO site, the host layout already loads Inter;
     this call becomes a no-op (Next.js deduplicates the same font subset).
   - The fontClass is passed as a prop so the calculator scopes it internally
     rather than polluting any global stylesheet. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--wht-font-inter',
});

const PAGE_URL = 'https://next-genbpo.com/wht-calculator';
const PAGE_TITLE = 'Pakistan Withholding Tax Calculator 2026-27 (FBR Rates)';
const PAGE_DESCRIPTION =
  'Free FBR withholding tax calculator for 2026-27. Instant WHT on salary, rent, dividends, property, goods & services under Finance Act 2026 rates.';

export const metadata: Metadata = {
  // absolute: skip the "| NextGen BPO Solutions" template — full title would exceed 70 chars
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
  },
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pakistan Withholding Tax Calculator',
  url: PAGE_URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
  description:
    'Free calculator for Pakistan withholding tax under the Income Tax Ordinance 2001 and Finance Act 2026. Covers withholding categories including salary (149), dividends (150), rent (155), goods, services and contracts (153), and property transactions (236C/236K).',
  provider: { '@id': 'https://next-genbpo.com/#organization' },
  featureList: [
    'Finance Act 2026 (FY2026-27) rate tables',
    '16 Income Tax Ordinance withholding categories',
    'ATL / Non-ATL rate resolution',
    'Progressive salary slab breakdown',
    'Step-by-step calculation explanation',
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://next-genbpo.com' },
    { '@type': 'ListItem', position: 2, name: 'WHT Calculator', item: PAGE_URL },
  ],
};

// Generated from the same array that renders the visible FAQ — cannot drift.
const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: WHT_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function WithholdingTaxCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />

      {/* Visible breadcrumb — mirrors BreadcrumbList schema */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <ol className="flex items-center gap-2 text-xs text-brand-gray">
            <li>
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-brand-dark" aria-current="page">WHT Calculator</li>
          </ol>
        </div>
      </nav>

      <WhtCalculator fontClass={inter.variable} />
      <CalculatorFaq />
    </>
  );
}
