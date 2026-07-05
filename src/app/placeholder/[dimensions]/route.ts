import { parsePlaceholderRequest } from '@/features/tools/dummy-image/lib/parse-placeholder-request'
import { generateSVG } from '@/features/tools/dummy-image/lib/svg-generator'
import { rasterizeSVG } from '@/features/tools/dummy-image/lib/rasterize'
import { DEFAULT_DUMMY_IMAGE_CONFIG } from '@/features/tools/dummy-image/model/config'
import type { PlaceholderFormat } from '@/features/tools/dummy-image/lib/parse-placeholder-request'

// resvg-js was the reviewed choice but only rasterizes to PNG; sharp covers
// PNG/JPEG/WebP from SVG input in one native dependency, so it replaced resvg.
export const runtime = 'nodejs'

const CONTENT_TYPES: Record<PlaceholderFormat, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
}

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

function buildFallbackSVG(width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#cccccc"/></svg>`
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dimensions: string }> }
) {
  const { dimensions } = await params
  const result = parsePlaceholderRequest(dimensions)

  if (!result.ok) {
    const { reason, ...details } = result.error
    return Response.json({ error: reason, ...details }, { status: 400 })
  }

  const { width, height, format } = result.value

  try {
    const svg = generateSVG({ ...DEFAULT_DUMMY_IMAGE_CONFIG, width, height })
    const buffer = await rasterizeSVG(svg, format)
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': CONTENT_TYPES[format],
        'Cache-Control': CACHE_CONTROL,
      },
    })
  } catch {
    try {
      const fallbackBuffer = await rasterizeSVG(buildFallbackSVG(width, height), format)
      return new Response(new Uint8Array(fallbackBuffer), {
        status: 200,
        headers: {
          'Content-Type': CONTENT_TYPES[format],
          'Cache-Control': 'no-store',
        },
      })
    } catch {
      return Response.json({ error: 'render-failed' }, { status: 500 })
    }
  }
}
