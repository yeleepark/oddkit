import type { ImageCompressorFormat } from '@/features/tools/image-compressor/model/types'

export const IMAGE_COMPRESSOR_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const IMAGE_COMPRESSOR_FORMAT_OPTIONS = [
  { value: 'original', key: 'original' },
  { value: 'jpeg', key: 'jpeg' },
  { value: 'png', key: 'png' },
  { value: 'webp', key: 'webp' },
] as const satisfies readonly { value: ImageCompressorFormat; key: ImageCompressorFormat }[]

export const IMAGE_COMPRESSOR_MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const
