'use client'

import { useEffect } from 'react'

/**
 * Keeps <html lang> in sync after client-side locale switches. The lang
 * attribute is rendered by the root layout, which does not re-render when
 * only the [locale] segment changes.
 */
export default function DocumentLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
