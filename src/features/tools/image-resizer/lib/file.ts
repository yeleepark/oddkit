import { IMAGE_RESIZER_MIME_TYPES } from '@/features/tools/image-resizer/model/options'
import type { ImageResizerFormat } from '@/features/tools/image-resizer/model/types'

export function getAspectRatioHeight(
  width: number,
  originalWidth: number,
  originalHeight: number
): number {
  if (originalWidth <= 0) return originalHeight
  return Math.max(1, Math.round((width / originalWidth) * originalHeight))
}

export function getAspectRatioWidth(
  height: number,
  originalWidth: number,
  originalHeight: number
): number {
  if (originalHeight <= 0) return originalWidth
  return Math.max(1, Math.round((height / originalHeight) * originalWidth))
}

export function getResizerMimeType(sourceType: string, format: ImageResizerFormat): string {
  if (format !== 'original') {
    return IMAGE_RESIZER_MIME_TYPES[format]
  }

  if (sourceType === 'image/png' || sourceType === 'image/webp' || sourceType === 'image/jpeg') {
    return sourceType
  }

  return 'image/jpeg'
}

export function getResizedFileName(inputName: string, mimeType: string): string {
  const baseName = inputName.replace(/\.[^.]+$/, '') || 'image'
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
  return `${baseName}-resized.${extension}`
}
