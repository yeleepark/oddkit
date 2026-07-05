import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'
import { DEFAULT_DUMMY_IMAGE_CONFIG } from '@/features/tools/dummy-image/model/config'

test('DEFAULT_DUMMY_IMAGE_CONFIG has expected shape', () => {
  const config: DummyImageConfig = DEFAULT_DUMMY_IMAGE_CONFIG
  expect(config.type).toBe('solid')
  expect(config.width).toBe(400)
  expect(config.height).toBe(300)
  expect(config.format).toBe('png')
  expect(config.text).toBe('')
})
