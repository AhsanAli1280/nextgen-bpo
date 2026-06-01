/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Redirects from old service slugs to new canonical slugs
  async redirects() {
    return [
      { source: '/bookkeeping', destination: '/bookkeeping-services', permanent: true },
      { source: '/payroll', destination: '/payroll-processing-services', permanent: true },
      { source: '/cpa-outsourcing', destination: '/cpa-firm-support', permanent: true },
      { source: '/us-tax-preparation', destination: '/us-tax-preparation-support', permanent: true },
      { source: '/pakistan-taxation', destination: '/pakistan-taxation-services', permanent: true },
    ];
  },
  // Security & SEO headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib'],
  },
};

module.exports = nextConfig;
