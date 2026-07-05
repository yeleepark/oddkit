import { getMimeType, getFileExtension } from '@/features/tools/dummy-image/lib/downloader'

test('getMimeType: 각 포맷에 올바른 MIME 반환', () => {
  expect(getMimeType('png')).toBe('image/png')
  expect(getMimeType('jpg')).toBe('image/jpeg')
  expect(getMimeType('jpeg')).toBe('image/jpeg')
  expect(getMimeType('webp')).toBe('image/webp')
  expect(getMimeType('svg')).toBe('image/svg+xml')
  expect(getMimeType('gif')).toBe('image/gif')
})

test('getFileExtension: 포맷 그대로 반환', () => {
  expect(getFileExtension('jpg')).toBe('jpg')
  expect(getFileExtension('jpeg')).toBe('jpeg')
  expect(getFileExtension('svg')).toBe('svg')
  expect(getFileExtension('gif')).toBe('gif')
})
