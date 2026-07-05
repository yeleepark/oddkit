import {
  getConvertedFileName,
  getConverterMimeType,
} from '@/features/tools/image-converter/lib/file'

test('getConverterMimeType maps output formats', () => {
  expect(getConverterMimeType('jpeg')).toBe('image/jpeg')
  expect(getConverterMimeType('png')).toBe('image/png')
  expect(getConverterMimeType('webp')).toBe('image/webp')
})

test('getConvertedFileName replaces extension', () => {
  expect(getConvertedFileName('photo.png', 'jpeg')).toBe('photo.jpg')
  expect(getConvertedFileName('image', 'webp')).toBe('image.webp')
})
