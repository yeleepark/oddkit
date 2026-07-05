/**
 * Google Analytics integration for Next.js
 *
 * @returns Analytics tracking component
 */
'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import GA4React from 'react-ga4'

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

function GoogleAnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID || process.env.NODE_ENV !== 'production') return

    GA4React.initialize(GOOGLE_ANALYTICS_ID)
  }, [])

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID || !pathname || process.env.NODE_ENV !== 'production') return

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    GA4React.event('page_view', {
      page_path: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent />
    </Suspense>
  )
}
