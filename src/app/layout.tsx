import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import Script from 'next/script'
import { GoogleAnalytics } from '@/shared/analytics/google-analytics'
import '@/app/globals.css'

const GOOGLE_ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

/* The theme must be applied before first paint, so this stays a raw
   synchronous inline script in <head>. It lives in the root layout (not the
   [locale] layout) because the root layout never re-renders on client-side
   locale switches — React 19 warns and refuses to execute <script> tags it
   (re)creates during client rendering. */
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

export const metadata: Metadata = {
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {GOOGLE_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} min-h-screen bg-ink font-sans text-text-main`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
