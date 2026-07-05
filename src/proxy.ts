import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/',
    '/(ko|en|ja|zh-CN|zh-TW|es)/:path*',
    '/((?!_next|_vercel|placeholder|opengraph-image|twitter-image|.*\\..*).*)',
  ],
}
