import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SEO, BRAND } from '@/lib/constants';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { organizationSchema, professionalServiceSchema, websiteSchema } from '@/lib/structured-data';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://next-genbpo.com'),
  title: { default: SEO.title, template: `%s | ${BRAND.name}` },
  description: SEO.description,
  keywords: [...SEO.keywords],
  icons: { icon: '/logo.svg', shortcut: '/logo.svg', apple: '/logo.svg' },
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  openGraph: { type: 'website', locale: 'en_US', url: 'https://next-genbpo.com', siteName: BRAND.name, title: SEO.title, description: SEO.description },
  twitter: { card: 'summary_large_image', title: SEO.title, description: SEO.description },
};

export const viewport: Viewport = {
  themeColor: '#39B54A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-green focus:text-white focus:rounded-lg">Skip to main content</a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
