/**
 * @jest-environment node
 */
jest.mock('../../../features/tools/dummy-image/lib/svg-generator', () => ({
  generateSVG: jest.fn(() => {
    throw new Error('boom: simulated primary render failure')
  }),
}))

import { GET } from '@/app/placeholder/[dimensions]/route'

function makeContext(dimensions: string) {
  return { params: Promise.resolve({ dimensions }) }
}

test('기본 렌더링이 실패해도 500이 아니라 폴백 이미지를 200으로 반환', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/600x400.png'),
    makeContext('600x400.png')
  )
  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toBe('image/png')

  const buffer = Buffer.from(await response.arrayBuffer())
  expect(buffer.byteLength).toBeGreaterThan(0)
})

test('폴백은 캐시하지 않음 (no-store)', async () => {
  const response = await GET(
    new Request('https://oddkit.tools/placeholder/600x400.png'),
    makeContext('600x400.png')
  )
  expect(response.headers.get('Cache-Control')).toBe('no-store')
})
