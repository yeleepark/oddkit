import type { ImageConverterOptions } from '@/features/tools/image-converter/model/types'

export const IMAGE_CONVERTER_LIMITS = {
  qualityMin: 0.1,
  qualityMax: 1,
} as const

export const DEFAULT_IMAGE_CONVERTER_OPTIONS: ImageConverterOptions = {
  format: 'webp',
  quality: 0.9,
}
