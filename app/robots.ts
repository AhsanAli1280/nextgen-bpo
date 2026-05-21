import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/private/', '/admin/'] },
    sitemap: 'https://nextgenbpo.com/sitemap.xml',
  };
}