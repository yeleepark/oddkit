import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_CONFIG } from '@/config/site'
import { TOOL_CATALOG } from '@/features/tools/catalog'
import { getCanonicalUrl, getDefaultLocaleUrl, getLanguageAlternates } from '@/shared/seo/url'
import JsonLd from '@/shared/seo/json-ld'
import Container from '@/shared/ui/Container'
import PromptText from '@/shared/ui/PromptText'
import MutedText from '@/shared/ui/MutedText'
import ToolCatalogBrowser from '@/features/tools/components/tool-catalog-browser'
import type { AppLocale } from '@/config/locales'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: AppLocale }
  const t = await getTranslations({ locale, namespace: 'home' })
  const title = t('meta.title')
  const description = t('meta.description')
  const keywords = t.raw('meta.keywords') as string[]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: getCanonicalUrl(locale),
      languages: {
        ...getLanguageAlternates(),
        'x-default': getDefaultLocaleUrl(),
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_CONFIG.name,
      title,
      description,
      url: getCanonicalUrl(locale),
      locale,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: SITE_CONFIG.twitterHandle,
    },
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: AppLocale }
  const t = await getTranslations({ locale })
  const homeT = await getTranslations({ locale, namespace: 'home' })

  const tools = TOOL_CATALOG.filter((tool) => tool.enabled)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: getCanonicalUrl(locale),
    description: homeT('seoDescription'),
    inLanguage: locale,
    hasPart: tools.map((tool) => ({
      '@type': 'WebApplication',
      name: t(tool.titleKey),
      description: t(tool.descriptionKey),
      url: getCanonicalUrl(locale, tool.href),
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
    })),
  }

  const catalogTools = tools.map((tool) => ({
    id: tool.id,
    num: tool.num,
    tag: tool.tag,
    category: tool.category,
    href: tool.href,
    title: t(tool.titleKey),
    description: homeT(tool.homeDescriptionKey),
  }))

  const catalogLabels = {
    searchPlaceholder: homeT('search.placeholder'),
    searchAriaLabel: homeT('search.ariaLabel'),
    categoryLabels: {
      all: homeT('categories.all'),
      image: homeT('categories.image'),
      color: homeT('categories.color'),
      text: homeT('categories.text'),
      dev: homeT('categories.dev'),
    },
    noResultsTitle: homeT('noResults.title'),
    noResultsReset: homeT('noResults.reset'),
  }

  return (
    <Container>
      <JsonLd data={jsonLd} />
      <section className="px-2 py-16 sm:py-[40px]">
        <PromptText>
          <span className="terminal-type" style={{ '--type-steps': 19 } as React.CSSProperties}>
            ~/oddkit $ ls tools
          </span>{' '}
          <MutedText className="terminal-fade-in">
            # {homeT('promptComment', { count: tools.length })}
          </MutedText>
        </PromptText>
        <h1
          className="max-w-3xl text-[42px] font-semibold text-text-main sm:text-[56px]"
          style={{ lineHeight: 0.98 }}
        >
          {homeT('heroTitle')}
        </h1>
        <p className="mt-5 text-[16.5px] text-mist">{homeT('seoDescription')}</p>
      </section>
      <ToolCatalogBrowser tools={catalogTools} labels={catalogLabels} />
    </Container>
  )
}
