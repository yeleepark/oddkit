import { formatJson, minifyJson } from '@/features/tools/json-formatter/lib/format'

describe('formatJson', () => {
  test('pretty-prints valid JSON with a 2-space indent', () => {
    const result = formatJson('{"a":1,"b":[1,2,3]}')
    expect(result).toEqual({
      ok: true,
      value: JSON.stringify({ a: 1, b: [1, 2, 3] }, null, 2),
    })
  })

  test('returns the parse error for invalid JSON', () => {
    const result = formatJson('{"a":1,}')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0)
    }
  })
})

describe('minifyJson', () => {
  test('compacts valid JSON onto a single line', () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": [1, 2, 3]\n}')
    expect(result).toEqual({ ok: true, value: '{"a":1,"b":[1,2,3]}' })
  })

  test('returns the parse error for invalid JSON', () => {
    const result = minifyJson('not json')
    expect(result.ok).toBe(false)
  })
})
