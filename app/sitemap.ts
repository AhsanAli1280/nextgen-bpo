import { MetadataRoute } from 'next';

const BASE_URL = 'https://next-genbpo.com';

const SERVICE_SLUGS = [
  'accounting-outsourcing',
  'bookkeeping-services',
  'payroll-processing-services',
  'financial-reporting-services',
  'cpa-firm-support',
  'audit-firm-support',
  'us-tax-preparation-support',
  'pakistan-taxation-services',
  'offshore-accounting-staffing',
  'corporate-advisory-services',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...servicePages,
  ];
}
