import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Block transactional/private surfaces. /api and /admin shouldn't be
      // crawled at all; auth/profile/welcome are user-state-dependent so
      // they have no useful index value and just dilute crawl budget.
      disallow: ['/api/', '/admin/', '/auth/', '/profile/', '/welcome/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}