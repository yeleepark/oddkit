import {
  extractLineColumnFromMessage,
  extractPositionFromMessage,
  offsetToLineColumn,
  parseJson,
} from '@/features/tools/json-formatter/lib/parse'

describe('offsetToLineColumn', () => {
  test('computes column on a single line', () => {
    expect(offsetToLineColumn('abcdef', 0)).toEqual({ line: 1, column: 1 })
    expect(offsetToLineColumn('abcdef', 3)).toEqual({ line: 1, column: 4 })
  })

  test('computes line and column across newlines', () => {
    const input = '{\n"a":1\n"b":2\n}'
    expect(offsetToLineColumn(input, 8)).toEqual({ line: 3, column: 1 })
  })

  test('clamps offsets outside the input range', () => {
    expect(offsetToLineColumn('ab', 99)).toEqual({ line: 1, column: 3 })
    expect(offsetToLineColumn('ab', -5)).toEqual({ line: 1, column: 1 })
  })
})

describe('extractPositionFromMessage', () => {
  test('extracts a numeric position when present', () => {
    expect(extractPositionFromMessage("Expected property name or '}' in JSON at position 1")).toBe(
      1
    )
  })

  test('returns null when no position is present', () => {
    expect(extractPositionFromMessage('Unexpected end of JSON input')).toBeNull()
  })
})

describe('extractLineColumnFromMessage', () => {
  test('extracts line/column when present', () => {
    expect(extractLineColumnFromMessage('... in JSON at position 8 (line 3 column 1)')).toEqual({
      line: 3,
      column: 1,
    })
  })

  test('returns null when absent', () => {
    expect(extractLineColumnFromMessage('Unexpected end of JSON input')).toBeNull()
  })
})

describe('parseJson', () => {
  test('parses valid JSON', () => {
    const result = parseJson<{ a: number }>('{"a":1}')
    expect(result).toEqual({ ok: true, value: { a: 1 } })
  })

  test('parses valid JSON with nested arrays and objects', () => {
    const result = parseJson('{"a":[1,2,{"b":true}],"c":null}')
    expect(result).toEqual({
      ok: true,
      value: { a: [1, 2, { b: true }], c: null },
    })
  })

  test('reports position and line/column for a missing comma across lines', () => {
    const input = '{\n"a":1\n"b":2\n}'
    const result = parseJson(input)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.position).toBe(8)
      expect(result.error.line).toBe(3)
      expect(result.error.column).toBe(1)
    }
  })

  test('reports a trailing comma error on a single line', () => {
    const result = parseJson('{"a":1,}')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.position).not.toBeNull()
      expect(result.error.line).toBe(1)
    }
  })

  test('falls back gracefully when the engine gives no position', () => {
    const result = parseJson('')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0)
      expect(result.error.position).toBeNull()
      expect(result.error.line).toBeNull()
      expect(result.error.column).toBeNull()
    }
  })

  test('does not throw on malformed input', () => {
    expect(() => parseJson('not json')).not.toThrow()
    expect(parseJson('not json').ok).toBe(false)
  })
})
