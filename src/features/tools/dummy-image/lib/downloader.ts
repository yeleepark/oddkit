import { SITE_CONFIG } from '@/config/site'
import type { DummyImageConfig, ImageFormat } from '@/features/tools/dummy-image/model/types'
import { generateSVG } from '@/features/tools/dummy-image/lib/svg-generator'
import { generateGIF } from '@/features/tools/dummy-image/lib/gif-generator'
import { IMAGE_FORMAT_MIME_TYPES } from '@/features/tools/dummy-image/model/options'
import { trackDownload } from '@/shared/analytics'

export function getMimeType(format: ImageFormat): string {
  return IMAGE_FORMAT_MIME_TYPES[format]
}

export function getFileExtension(format: ImageFormat): string {
  return format
}

export async function downloadImage(
  canvas: HTMLCanvasElement,
  config: DummyImageConfig
): Promise<void> {
  const { format } = config
  const filename = `${SITE_CONFIG.name}-${config.width}x${config.height}.${getFileExtension(format)}`

  if (format === 'svg') {
    const svgString = generateSVG(config)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    triggerDownload(URL.createObjectURL(blob), filename)
    trackDownload('dummy-image', filename, blob.size, format)
    return
  }

  if (format === 'gif') {
    const blob = await generateGIF(canvas)
    triggerDownload(URL.createObjectURL(blob), filename)
    trackDownload('dummy-image', filename, blob.size, format)
    return
  }

  const dataUrl = canvas.toDataURL(getMimeType(format))
  const blob = await fetch(dataUrl).then((r) => r.blob())
  triggerDownload(dataUrl, filename)
  trackDownload('dummy-image', filename, blob.size, format)
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}
