import type { MetadataRoute } from 'next'
import { LOCALES } from '@/config/locales'
import { TOOL_CATALOG } from '@/features/tools/catalog'
import { getLocalizedUrl } from '@/shared/seo/url'

const STATIC_PATHS = ['/privacy', '/terms'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const toolPaths = TOOL_CATALOG.filter((tool) => tool.enabled).map((tool) => tool.href)

  return LOCALES.flatMap((locale) => [
    {
      url: getLocalizedUrl(locale),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...toolPaths.map((path) => ({
      url: getLocalizedUrl(locale, path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...STATIC_PATHS.map((path) => ({
      url: getLocalizedUrl(locale, path),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ])
}
