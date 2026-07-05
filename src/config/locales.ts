export const LOCALE_OPTIONS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'es', label: 'ES' },
] as const

export const DEFAULT_LOCALE = 'en'
export const LOCALES = LOCALE_OPTIONS.map((locale) => locale.code)

export type AppLocale = (typeof LOCALES)[number]
