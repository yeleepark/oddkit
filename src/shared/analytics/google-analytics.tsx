/**
 * Google Analytics integration for Next.js
 *
 * @returns Analytics tracking component
 */
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import GA4React from 'react-ga4'

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID) return

    GA4React.initialize(GOOGLE_ANALYTICS_ID)
  }, [])

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID || !pathname) return

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    GA4React.pageview({
      page_path: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}
