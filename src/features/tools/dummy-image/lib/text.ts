import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

export function getDisplayText(config: Pick<DummyImageConfig, 'height' | 'text' | 'width'>): string {
  return config.text || `${config.width}x${config.height}`
}
