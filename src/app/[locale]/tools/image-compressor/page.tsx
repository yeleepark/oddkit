import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_CONFIG } from '@/config/site'
import { ImageCompressorTool } from '@/features/tools/image-compressor'
import { getCanonicalUrl, getDefaultLocaleUrl, getLanguageAlternates } from '@/shared/seo/url'
import JsonLd from '@/shared/seo/json-ld'
import type { AppLocale } from '@/config/locales'
import Container from '@/shared/ui/Container'

const pathname = '/tools/image-compressor'

interface FaqItem {
  question: string
  answer: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: AppLocale }
  const t = await getTranslations({ locale, namespace: 'imageCompressor' })
  const title = t('meta.title')
  const description = t('meta.description')
  const keywords = t.raw('meta.keywords') as string[]

  return {
    title,
    description,
    keywords,
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

export default async function ImageCompressorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: AppLocale }
  const t = await getTranslations({ locale, namespace: 'imageCompressor' })
  const useCases = t.raw('seo.useCases') as string[]
  const faq = t.raw('seo.faq') as FaqItem[]
  const pageUrl = getCanonicalUrl(locale, pathname)
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t('title'),
      description: t('description'),
      url: pageUrl,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript, File API, and Canvas support',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [t('seo.formats'), t('seo.privacy'), ...useCases],
      inLanguage: locale,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: getDefaultLocaleUrl(),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <ImageCompressorTool />
      <Container>
        <section>
          <div>
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-text-main">
                    {t('seo.overviewTitle')}
                  </h2>
                  <p className="mt-2 text-sm text-mist">{t('seo.overview')}</p>
                  <p className="mt-2 text-sm text-mist">{t('seo.privacy')}</p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text-main">
                    {t('seo.useCasesTitle')}
                  </h2>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-mist">
                    {useCases.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-text-main">
                    {t('seo.formatsTitle')}
                  </h2>
                  <p className="mt-2 text-sm text-mist">{t('seo.formats')}</p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text-main">{t('seo.faqTitle')}</h2>
                  <div className="mt-2 space-y-3">
                    {faq.map((item) => (
                      <div key={item.question}>
                        <h3 className="text-sm font-medium text-text-sub">{item.question}</h3>
                        <p className="mt-1 text-sm text-mist">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}
