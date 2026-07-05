import type { ImageResizerOptions } from '@/features/tools/image-resizer/model/types'

export const IMAGE_RESIZER_LIMITS = {
  dimensionMin: 1,
  dimensionMax: 8000,
  qualityMin: 0.1,
  qualityMax: 1,
} as const

export const DEFAULT_IMAGE_RESIZER_OPTIONS: ImageResizerOptions = {
  format: 'original',
  height: 600,
  keepAspectRatio: true,
  quality: 0.9,
  width: 800,
}
