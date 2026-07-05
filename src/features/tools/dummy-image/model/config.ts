import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

export const DUMMY_IMAGE_SIZE_LIMITS = {
  min: 1,
  max: 4000,
} as const

export const DUMMY_IMAGE_FONT_SIZE_LIMITS = {
  min: 10,
  max: 72,
} as const

export const DUMMY_IMAGE_PATTERN = {
  gridStep: 20,
  dotStep: 20,
  dotRadius: 3,
  stripeStep: 10,
  stripeWidth: 1.5,
} as const

export const DUMMY_IMAGE_GIF_CONFIG = {
  workers: 2,
  quality: 10,
  workerScript: '/gif.worker.js',
} as const

export const DEFAULT_DUMMY_IMAGE_CONFIG: DummyImageConfig = {
  type: 'solid',
  width: 400,
  height: 300,
  primaryColor: '#cccccc',
  secondaryColor: '#999999',
  text: '',
  fontSize: 24,
  gradientDirection: 'vertical',
  patternStyle: 'grid',
  format: 'png',
}
