import type { ImageConverterFormat } from '@/features/tools/image-converter/model/types'

export const IMAGE_CONVERTER_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const IMAGE_CONVERTER_FORMAT_OPTIONS = [
  { value: 'jpeg', key: 'jpeg' },
  { value: 'png', key: 'png' },
  { value: 'webp', key: 'webp' },
] as const satisfies readonly { value: ImageConverterFormat; key: ImageConverterFormat }[]

export const IMAGE_CONVERTER_MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const satisfies Record<ImageConverterFormat, string>
