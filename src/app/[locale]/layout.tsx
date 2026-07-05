import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { SITE_CONFIG } from '@/config/site'
import { routing } from '@/i18n/routing'
import { getCanonicalUrl, getDefaultLocaleUrl, getLanguageAlternates } from '@/shared/seo/url'
import Footer from '@/shared/layout/footer'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/config/locales'
import ThemeToggle from '@/shared/layout/theme-toggle'
import LocaleSwitcher from '@/shared/layout/locale-switcher'
import DocumentLang from '@/shared/layout/document-lang'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: AppLocale }
  const t = await getTranslations({ locale, namespace: 'site' })
  const title = t('meta.title')
  const description = t('meta.description')
  const keywords = t.raw('meta.keywords') as string[]

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: title,
      template: SITE_CONFIG.titleTemplate,
    },
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
      alternateLocale: routing.locales.filter((item) => item !== locale),
    },
    twitter: {
      card: 'summary',
      title: SITE_CONFIG.name,
      description,
      creator: SITE_CONFIG.twitterHandle,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLang locale={locale} />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-line bg-ink/80 px-6 py-4 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between">
            <div className="flex items-center gap-3.5">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-80" />
              </span>
              <Link
                href="/"
                className="font-mono text-[19px] font-semibold text-text-main transition-colors hover:text-acid"
              >
                {SITE_CONFIG.name}
                <span
                  className="terminal-glow text-acid"
                  style={{ animation: 'blink 1.1s step-end infinite' }}
                >
                  ▮
                </span>
              </Link>
              <span aria-hidden="true" className="font-mono text-xs text-faint">
                — zsh
              </span>
            </div>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
