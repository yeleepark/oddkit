export const SITE_CONFIG = {
  name: 'oddkit',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://oddkit.tools',
  titleTemplate: '%s | oddkit',
  twitterHandle: '@oddkit',
  contactEmail: 'dev.yelee@gmail.com',
} as const
