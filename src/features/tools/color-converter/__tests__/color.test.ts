import {
  convertColor,
  formatHex,
  formatHsl,
  formatOklch,
  formatRgb,
  parseColor,
} from '@/features/tools/color-converter/lib/color'

describe('parseColor - hex', () => {
  test('parses 6-digit hex with #', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  test('parses 3-digit shorthand hex', () => {
    expect(parseColor('#0f0')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
  })

  test('parses 8-digit hex with alpha', () => {
    expect(parseColor('#0000ff80')).toEqual({ r: 0, g: 0, b: 255, a: 0.502 })
  })

  test('parses 4-digit shorthand hex with alpha', () => {
    expect(parseColor('#00f8')).toEqual({ r: 0, g: 0, b: 255, a: 0.533 })
  })

  test('parses bare hex digits without a leading #', () => {
    expect(parseColor('ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  test('is case-insensitive', () => {
    expect(parseColor('#FF0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })
})

describe('parseColor - rgb', () => {
  test('parses comma syntax', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  test('parses space syntax with alpha', () => {
    expect(parseColor('rgb(255 0 0 / 0.5)')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
  })

  test('parses rgba() with comma alpha', () => {
    expect(parseColor('rgba(0, 128, 255, 0.25)')).toEqual({ r: 0, g: 128, b: 255, a: 0.25 })
  })

  test('parses percentage channels', () => {
    expect(parseColor('rgb(100% 0% 0%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  test('parses percentage alpha', () => {
    expect(parseColor('rgb(255 0 0 / 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
  })

  test('clamps out-of-range channels', () => {
    expect(parseColor('rgb(300, -10, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })
})

describe('parseColor - hsl', () => {
  test('parses pure red', () => {
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  test('parses pure green with deg unit and space syntax', () => {
    expect(parseColor('hsl(120deg 100% 50%)')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
  })

  test('parses alpha via slash', () => {
    expect(parseColor('hsl(240 100% 50% / 0.5)')).toEqual({ r: 0, g: 0, b: 255, a: 0.5 })
  })

  test('parses hsla() with comma alpha', () => {
    expect(parseColor('hsla(0, 0%, 100%, 0.8)')).toEqual({ r: 255, g: 255, b: 255, a: 0.8 })
  })

  test('handles achromatic gray (s = 0)', () => {
    expect(parseColor('hsl(0 0% 50%)')).toEqual({ r: 128, g: 128, b: 128, a: 1 })
  })
})

describe('parseColor - oklch', () => {
  test('round-trips pure red through oklch within rounding tolerance', () => {
    const converted = convertColor('#ff0000')
    expect(converted).not.toBeNull()
    const roundTripped = parseColor(converted!.oklch)
    expect(roundTripped).not.toBeNull()
    expect(roundTripped!.r).toBeCloseTo(255, -1)
    expect(roundTripped!.g).toBeCloseTo(0, -1)
    expect(roundTripped!.b).toBeCloseTo(0, -1)
  })

  test('parses an explicit oklch string with alpha', () => {
    const result = parseColor('oklch(100% 0 0 / 0.5)')
    expect(result).not.toBeNull()
    expect(result!.r).toBeCloseTo(255, 0)
    expect(result!.g).toBeCloseTo(255, 0)
    expect(result!.b).toBeCloseTo(255, 0)
    expect(result!.a).toBe(0.5)
  })

  test('parses black at L = 0', () => {
    const result = parseColor('oklch(0% 0 0)')
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  })
})

describe('parseColor - invalid input', () => {
  test.each([
    '',
    '   ',
    'not-a-color',
    '#12',
    '#gggggg',
    '#1234567',
    'rgb(255, 0)',
    'rgb()',
    'hsl(bad, 1, 1)',
    'oklch()',
    'rgb(255 0 0',
  ])('returns null for %p', (input) => {
    expect(parseColor(input)).toBeNull()
  })

  test('does not throw for non-string input', () => {
    // @ts-expect-error intentionally passing a non-string to verify runtime safety
    expect(parseColor(null)).toBeNull()
    // @ts-expect-error intentionally passing a non-string to verify runtime safety
    expect(parseColor(undefined)).toBeNull()
  })
})

describe('formatting', () => {
  const opaqueRed = { r: 255, g: 0, b: 0, a: 1 }
  const translucentBlue = { r: 0, g: 0, b: 255, a: 0.5 }

  test('formatHex omits alpha when opaque and includes it otherwise', () => {
    expect(formatHex(opaqueRed)).toBe('#ff0000')
    expect(formatHex(translucentBlue)).toBe('#0000ff80')
  })

  test('formatRgb omits alpha when opaque and includes it otherwise', () => {
    expect(formatRgb(opaqueRed)).toBe('rgb(255 0 0)')
    expect(formatRgb(translucentBlue)).toBe('rgb(0 0 255 / 0.5)')
  })

  test('formatHsl produces expected hue/saturation/lightness for red', () => {
    expect(formatHsl(opaqueRed)).toBe('hsl(0 100% 50%)')
    expect(formatHsl(translucentBlue)).toBe('hsl(240 100% 50% / 0.5)')
  })

  test('formatOklch produces a valid oklch() string', () => {
    expect(formatOklch(opaqueRed)).toMatch(/^oklch\(\d+(\.\d+)?% \d+(\.\d+)? \d+(\.\d+)?\)$/)
    expect(formatOklch(translucentBlue)).toMatch(
      /^oklch\(\d+(\.\d+)?% \d+(\.\d+)? \d+(\.\d+)? \/ 0\.5\)$/
    )
  })
})

describe('convertColor', () => {
  test('returns all four formats for a valid input', () => {
    const result = convertColor('#ff0000')
    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      input: '#ff0000',
      rgba: { r: 255, g: 0, b: 0, a: 1 },
      hex: '#ff0000',
      rgb: 'rgb(255 0 0)',
      hsl: 'hsl(0 100% 50%)',
    })
    expect(result!.oklch).toMatch(/^oklch\(/)
  })

  test('carries alpha through every output format', () => {
    const result = convertColor('rgba(10, 20, 30, 0.4)')
    expect(result).not.toBeNull()
    expect(result!.hex.endsWith('66')).toBe(true)
    expect(result!.rgb).toContain('/ 0.4')
    expect(result!.hsl).toContain('/ 0.4')
    expect(result!.oklch).toContain('/ 0.4')
  })

  test('returns null for invalid input', () => {
    expect(convertColor('nope')).toBeNull()
  })
})
