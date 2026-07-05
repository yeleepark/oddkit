import { DEFAULT_LOCALE } from '@/config/locales'
import { SITE_CONFIG } from '@/config/site'
import { TOOL_CATALOG } from '@/features/tools/catalog'
import { getDefaultLocaleUrl, getLocalizedUrl, getSiteUrl } from '@/shared/seo/url'

export function GET() {
  const tools = TOOL_CATALOG.filter((tool) => tool.enabled)
    .map((tool) => `- ${tool.id}: ${getLocalizedUrl(DEFAULT_LOCALE, tool.href)}`)
    .join('\n')

  const body = `# ${SITE_CONFIG.name}

${SITE_CONFIG.name} is a browser-based toolkit for small design, development, and content tasks.

## Primary URLs

- Home: ${getDefaultLocaleUrl()}
- Sitemap: ${getSiteUrl('/sitemap.xml')}

## Tools

${tools}

## Current Tool Details

The dummy image generator creates placeholder images locally in the browser. It supports solid colors, gradients, patterns, custom dimensions, custom text, and downloads in PNG, JPG, JPEG, WebP, SVG, and GIF formats.

The image compressor reduces JPG, PNG, and WebP image file sizes locally in the browser. It supports quality control, maximum dimensions, and output conversion to JPG, PNG, or WebP.

The image converter converts JPG, PNG, and WebP images locally in the browser. It supports JPG, PNG, and WebP output with quality control for JPG and WebP.

The image resizer changes JPG, PNG, and WebP image dimensions locally in the browser. It supports exact width and height inputs, percentage presets, aspect ratio locking, and output conversion to JPG, PNG, or WebP.

## Crawling Notes

Pages are localized. The default locale is ${DEFAULT_LOCALE}. Generated images and user inputs are not uploaded to a server.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
