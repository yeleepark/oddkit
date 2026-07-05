import { GoogleAnalytics } from '@/shared/analytics/google-analytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      {children}
    </>
  )
}
