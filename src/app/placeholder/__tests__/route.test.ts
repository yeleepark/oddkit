/**
 * @jest-environment node
 */
import sharp from 'sharp'
import { GET } from '@/app/placeholder/[dimensions]/route'

function makeContext(dimensions: string) {
  return { params: Promise.resolve({ dimensions }) }
}

test('잘못된 segment는 400을 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/abcxdef.png'),
    makeContext('abcxdef.png')
  )
  expect(response.status).toBe(400)
  const body = await response.json()
  expect(body).toEqual({ error: 'malformed' })
})

test('허용되지 않은 포맷은 400을 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/600x400.bmp'),
    makeContext('600x400.bmp')
  )
  expect(response.status).toBe(400)
  const body = await response.json()
  expect(body).toEqual({ error: 'unsupported-format', format: 'bmp' })
})

test('범위를 벗어난 크기는 400을 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/99999x400.png'),
    makeContext('99999x400.png')
  )
  expect(response.status).toBe(400)
  const body = await response.json()
  expect(body).toEqual({ error: 'out-of-range', width: 99999, height: 400 })
})

test('유효한 PNG 요청은 200과 올바른 content-type을 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/600x400.png'),
    makeContext('600x400.png')
  )
  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toBe('image/png')

  const buffer = Buffer.from(await response.arrayBuffer())
  const meta = await sharp(buffer).metadata()
  expect(meta.format).toBe('png')
  expect(meta.width).toBe(600)
  expect(meta.height).toBe(400)
})

test('유효한 JPG 요청은 image/jpeg content-type을 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/300x200.jpg'),
    makeContext('300x200.jpg')
  )
  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toBe('image/jpeg')
})

test('유효한 WebP 요청은 image/webp content-type을 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/300x200.webp'),
    makeContext('300x200.webp')
  )
  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toBe('image/webp')
})

test('유효한 요청은 긴 immutable 캐시 헤더를 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/600x400.png'),
    makeContext('600x400.png')
  )
  expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable')
})
