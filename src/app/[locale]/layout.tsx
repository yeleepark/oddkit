import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
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
import '@/app/globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const themeScript = `
  (function() {
    try {
      var key = 'oddkit-theme';
      var stored = localStorage.getItem(key);
      var theme = stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.dataset.theme = theme;
    } catch (_) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();
`

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params as { locale: AppLocale }
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen bg-ink font-sans text-text-main`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b border-line bg-ink/80 px-6 py-4 backdrop-blur-md sm:px-8">
              <div className="mx-auto flex max-w-[1180px] items-center justify-between">
                <Link
                  href="/"
                  className="font-mono text-[19px] font-semibold text-text-main transition-colors hover:text-acid"
                >
                  {SITE_CONFIG.name}
                  <span className="text-acid" style={{ animation: 'blink 1.1s step-end infinite' }}>▮</span>
                </Link>
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
      </body>
    </html>
  )
}
