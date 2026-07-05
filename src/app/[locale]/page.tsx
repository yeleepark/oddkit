import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_CONFIG } from '@/config/site'
import { TOOL_CATALOG } from '@/features/tools/catalog'
import { getCanonicalUrl, getDefaultLocaleUrl, getLanguageAlternates } from '@/shared/seo/url'
import JsonLd from '@/shared/seo/json-ld'
import Container from '@/shared/ui/Container'
import PromptText from '@/shared/ui/PromptText'
import MutedText from '@/shared/ui/MutedText'
import ToolCard from '@/shared/ui/ToolCard'
import type { AppLocale } from '@/config/locales'

// Matches the outer corners of a 2-col-desktop / 1-col-mobile grid so each
// ToolCard's own corner radius lines up with the container's rounded edge —
// without this, the hover outline gets visibly clipped at the true outer
// corners (the parent's overflow-hidden cuts a sharp corner into a rounded
// one). Hardcoded for exactly 4 items; a 5th tool falls through to a square
// card (no crash) and needs this list extended.
const HOME_GRID_CORNER_ROUNDING = [
  'rounded-tl-[14px] rounded-tr-[14px] sm:rounded-tr-none',
  'sm:rounded-tr-[14px]',
  'sm:rounded-bl-[14px]',
  'rounded-bl-[14px] rounded-br-[14px] sm:rounded-bl-none',
] as const

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

  return (
    <Container>
      <JsonLd data={jsonLd} />
      <section className="px-2 py-16 sm:py-[40px]">
        <PromptText>
          ~/oddkit $ ls tools{' '}
          <MutedText># {homeT('promptComment', { count: tools.length })}</MutedText>
        </PromptText>
        <h1
          className="max-w-3xl text-[42px] font-semibold text-text-main sm:text-[56px]"
          style={{ lineHeight: 0.98 }}
        >
          {homeT('heroTitle')}
        </h1>
        <p className="mt-5 text-[16.5px] text-mist">{homeT('seoDescription')}</p>
      </section>
      <section
        className="mb-14 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2"
        style={{ boxShadow: 'var(--theme-shadow)' }}
      >
        {tools.map(({ homeDescriptionKey, href, id, num, tag, titleKey }, index) => (
          <ToolCard
            key={id}
            title={t(titleKey)}
            description={homeT(homeDescriptionKey)}
            href={href}
            num={num}
            tag={tag}
            roundedClassName={HOME_GRID_CORNER_ROUNDING[index]}
          />
        ))}
      </section>
    </Container>
  )
}
