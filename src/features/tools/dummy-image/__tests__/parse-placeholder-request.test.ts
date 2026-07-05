import { parsePlaceholderRequest } from '@/features/tools/dummy-image/lib/parse-placeholder-request'
import { DUMMY_IMAGE_SIZE_LIMITS } from '@/features/tools/dummy-image/model/config'

test('유효한 segment: 크기·포맷 파싱', () => {
  const result = parsePlaceholderRequest('600x400.png')
  expect(result).toEqual({ ok: true, value: { width: 600, height: 400, format: 'png' } })
})

test('포맷 대소문자 무시', () => {
  const result = parsePlaceholderRequest('600x400.PNG')
  expect(result).toEqual({ ok: true, value: { width: 600, height: 400, format: 'png' } })
})

test('잘못된 segment: 숫자가 아닌 크기', () => {
  const result = parsePlaceholderRequest('abcxdef.png')
  expect(result).toEqual({ ok: false, error: { reason: 'malformed' } })
})

test('잘못된 segment: 포맷 확장자 없음', () => {
  const result = parsePlaceholderRequest('600x400')
  expect(result).toEqual({ ok: false, error: { reason: 'malformed' } })
})

test('허용되지 않은 포맷', () => {
  const result = parsePlaceholderRequest('600x400.bmp')
  expect(result).toEqual({ ok: false, error: { reason: 'unsupported-format', format: 'bmp' } })
})

test('최대 크기 초과', () => {
  const oversized = DUMMY_IMAGE_SIZE_LIMITS.max + 1
  const result = parsePlaceholderRequest(`${oversized}x400.png`)
  expect(result).toEqual({
    ok: false,
    error: { reason: 'out-of-range', width: oversized, height: 400 },
  })
})

test('최소 크기 미만', () => {
  const result = parsePlaceholderRequest('0x400.png')
  expect(result).toEqual({
    ok: false,
    error: { reason: 'out-of-range', width: 0, height: 400 },
  })
})

test('경계값: 최대 크기와 정확히 같으면 허용', () => {
  const max = DUMMY_IMAGE_SIZE_LIMITS.max
  const result = parsePlaceholderRequest(`${max}x${max}.webp`)
  expect(result).toEqual({ ok: true, value: { width: max, height: max, format: 'webp' } })
})
