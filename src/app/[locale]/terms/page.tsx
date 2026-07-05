import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_CONFIG } from '@/config/site'
import { LegalPage } from '@/features/legal'
import { getCanonicalUrl, getDefaultLocaleUrl, getLanguageAlternates } from '@/shared/seo/url'
import JsonLd from '@/shared/seo/json-ld'
import type { AppLocale } from '@/config/locales'

const pathname = '/terms'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params as { locale: AppLocale }
  const t = await getTranslations({ locale, namespace: 'terms' })
  const title = t('meta.title')
  const description = t('meta.description')

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, pathname),
      languages: {
        ...getLanguageAlternates(pathname),
        'x-default': getDefaultLocaleUrl(pathname),
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_CONFIG.name,
      title,
      description,
      url: getCanonicalUrl(locale, pathname),
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params as { locale: AppLocale }
  const t = await getTranslations({ locale, namespace: 'terms' })
  const pageUrl = getCanonicalUrl(locale, pathname)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    url: pageUrl,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: getDefaultLocaleUrl(),
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <LegalPage locale={locale} namespace="terms" />
    </>
  )
}
