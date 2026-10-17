import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/quote/'],
    },
    sitemap: 'https://www.bestcctvservice.com/sitemap.xml',
  };
}
