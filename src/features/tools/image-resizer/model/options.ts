import type { ImageResizerFormat } from '@/features/tools/image-resizer/model/types'

export const IMAGE_RESIZER_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const IMAGE_RESIZER_FORMAT_OPTIONS = [
  { value: 'original', key: 'original' },
  { value: 'jpeg', key: 'jpeg' },
  { value: 'png', key: 'png' },
  { value: 'webp', key: 'webp' },
] as const satisfies readonly { value: ImageResizerFormat; key: ImageResizerFormat }[]

export const IMAGE_RESIZER_MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const

export const IMAGE_RESIZER_SCALE_PRESETS = [
  { label: '25%', scale: 0.25 },
  { label: '50%', scale: 0.5 },
  { label: '75%', scale: 0.75 },
  { label: '100%', scale: 1 },
] as const
