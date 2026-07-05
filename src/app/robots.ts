import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/config/site'
import { getSiteUrl } from '@/shared/seo/url'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User'],
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
    ],
    sitemap: getSiteUrl('/sitemap.xml'),
    host: SITE_CONFIG.url,
  }
}
