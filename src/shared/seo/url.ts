import { DEFAULT_LOCALE, LOCALES } from '@/config/locales'
import { SITE_CONFIG } from '@/config/site'
import type { AppLocale } from '@/config/locales'

type Pathname = `/${string}` | ''

function normalizePath(pathname: Pathname): string {
  if (!pathname || pathname === '/') {
    return ''
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export function getSiteUrl(pathname: Pathname = ''): string {
  return new URL(normalizePath(pathname), SITE_CONFIG.url).toString()
}

export function getLocalizedPath(locale: AppLocale, pathname: Pathname = ''): string {
  return `/${locale}${normalizePath(pathname)}`
}

export function getLocalizedUrl(locale: AppLocale, pathname: Pathname = ''): string {
  return getSiteUrl(getLocalizedPath(locale, pathname) as Pathname)
}

export function getCanonicalUrl(locale: AppLocale, pathname: Pathname = ''): string {
  return getLocalizedUrl(locale, pathname)
}

export function getLanguageAlternates(pathname: Pathname = ''): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, getLocalizedUrl(locale, pathname)])
  )
}

export function getDefaultLocaleUrl(pathname: Pathname = ''): string {
  return getLocalizedUrl(DEFAULT_LOCALE, pathname)
}
