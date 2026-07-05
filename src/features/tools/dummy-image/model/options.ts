import type {
  GradientDirection,
  ImageFormat,
  ImageType,
  PatternStyle,
} from '@/features/tools/dummy-image/model/types'

export const DUMMY_IMAGE_PRESETS = [
  { label: '1:1', width: 400, height: 400 },
  { label: '16:9', width: 1280, height: 720 },
  { label: '4:3', width: 800, height: 600 },
] as const

export const IMAGE_FORMATS = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'svg',
  'gif',
] as const satisfies readonly ImageFormat[]

export const IMAGE_FORMAT_MIME_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
} as const satisfies Record<ImageFormat, string>

export const IMAGE_TYPE_OPTIONS = [
  { value: 'solid', key: 'solid' },
  { value: 'gradient', key: 'gradient' },
  { value: 'pattern', key: 'pattern' },
] as const satisfies readonly { value: ImageType; key: ImageType }[]

export const GRADIENT_DIRECTION_OPTIONS = [
  { value: 'vertical', key: 'vertical' },
  { value: 'horizontal', key: 'horizontal' },
  { value: 'diagonal', key: 'diagonal' },
] as const satisfies readonly { value: GradientDirection; key: GradientDirection }[]

export const PATTERN_STYLE_OPTIONS = [
  { value: 'grid', key: 'grid' },
  { value: 'dots', key: 'dots' },
  { value: 'stripes', key: 'stripes' },
] as const satisfies readonly { value: PatternStyle; key: PatternStyle }[]
