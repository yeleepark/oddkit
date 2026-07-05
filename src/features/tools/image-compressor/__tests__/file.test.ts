import {
  formatBytes,
  getCompressionRatio,
  getOutputFileName,
  getOutputMimeType,
  getResizedDimensions,
  getTargetSizeBytes,
} from '@/features/tools/image-compressor/lib/file'

test('formatBytes returns readable sizes', () => {
  expect(formatBytes(512)).toBe('512 B')
  expect(formatBytes(1536)).toBe('1.50 KB')
  expect(formatBytes(1024 * 1024 * 2)).toBe('2.00 MB')
})

test('getCompressionRatio returns saved percentage', () => {
  expect(getCompressionRatio(1000, 700)).toBe(30)
  expect(getCompressionRatio(1000, 1200)).toBe(0)
  expect(getCompressionRatio(0, 100)).toBe(0)
})

test('getTargetSizeBytes converts units to bytes', () => {
  expect(getTargetSizeBytes(200, 'kb')).toBe(204800)
  expect(getTargetSizeBytes(1.5, 'mb')).toBe(1572864)
})

test('getResizedDimensions keeps aspect ratio within bounds', () => {
  expect(getResizedDimensions(4000, 2000, 1000, 1000)).toEqual({ width: 1000, height: 500 })
  expect(getResizedDimensions(800, 600, 1000, 1000)).toEqual({ width: 800, height: 600 })
})

test('getOutputMimeType maps original and explicit formats', () => {
  expect(getOutputMimeType('image/png', 'original')).toBe('image/png')
  expect(getOutputMimeType('image/gif', 'original')).toBe('image/jpeg')
  expect(getOutputMimeType('image/png', 'webp')).toBe('image/webp')
})

test('getOutputFileName appends compressed suffix and extension', () => {
  expect(getOutputFileName('photo.png', 'image/jpeg')).toBe('photo-compressed.jpg')
  expect(getOutputFileName('image', 'image/webp')).toBe('image-compressed.webp')
})
