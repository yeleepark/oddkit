import { IMAGE_COMPRESSOR_MIME_TYPES } from '@/features/tools/image-compressor/model/options'
import type {
  ImageCompressorFormat,
  ImageCompressorSizeUnit,
} from '@/features/tools/image-compressor/model/types'

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`
}

export function getCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize <= 0 || compressedSize >= originalSize) {
    return 0
  }

  return Math.round(((originalSize - compressedSize) / originalSize) * 100)
}

export function getTargetSizeBytes(size: number, unit: ImageCompressorSizeUnit): number {
  const multiplier = unit === 'mb' ? 1024 * 1024 : 1024
  return Math.max(1, Math.round(size * multiplier))
}

export function getResizedDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export function getOutputMimeType(sourceType: string, format: ImageCompressorFormat): string {
  if (format !== 'original') {
    return IMAGE_COMPRESSOR_MIME_TYPES[format]
  }

  if (sourceType === 'image/png' || sourceType === 'image/webp' || sourceType === 'image/jpeg') {
    return sourceType
  }

  return 'image/jpeg'
}

export function getOutputFileName(inputName: string, mimeType: string): string {
  const baseName = inputName.replace(/\.[^.]+$/, '') || 'image'
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
  return `${baseName}-compressed.${extension}`
}
