import {
  getAspectRatioHeight,
  getAspectRatioWidth,
  getResizedFileName,
  getResizerMimeType,
} from '@/features/tools/image-resizer/lib/file'

test('aspect ratio helpers calculate matching dimensions', () => {
  expect(getAspectRatioHeight(1000, 4000, 2000)).toBe(500)
  expect(getAspectRatioWidth(500, 4000, 2000)).toBe(1000)
})

test('getResizerMimeType keeps original or maps explicit format', () => {
  expect(getResizerMimeType('image/png', 'original')).toBe('image/png')
  expect(getResizerMimeType('image/gif', 'original')).toBe('image/jpeg')
  expect(getResizerMimeType('image/png', 'webp')).toBe('image/webp')
})

test('getResizedFileName appends resized suffix', () => {
  expect(getResizedFileName('photo.png', 'image/jpeg')).toBe('photo-resized.jpg')
  expect(getResizedFileName('image', 'image/webp')).toBe('image-resized.webp')
})
