import { Metadata } from 'next';
import { ServicePageLayout } from '@/components/sections/service-page-layout';
import { SERVICE_PAGES } from '@/lib/data/service-pages';

const data = SERVICE_PAGES['pakistan-taxation'];

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
};

export default function Page() {
  return <ServicePageLayout data={data} />;
}
