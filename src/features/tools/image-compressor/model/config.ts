import type { ImageCompressorOptions } from '@/features/tools/image-compressor/model/types'

export const IMAGE_COMPRESSOR_LIMITS = {
  qualityMin: 0.1,
  qualityMax: 1,
  targetIterations: 9,
  targetDimensionAttempts: 8,
  targetDimensionScale: 0.9,
  targetSizeMinKb: 1,
  targetSizeMaxMb: 50,
  dimensionMin: 1,
  dimensionMax: 8000,
} as const

export const DEFAULT_IMAGE_COMPRESSOR_OPTIONS: ImageCompressorOptions = {
  format: 'original',
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1920,
  mode: 'manual',
  targetSize: 500,
  targetUnit: 'kb',
}
