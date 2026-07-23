import type { ColorConversionResult, RgbaColor } from '@/features/tools/color-converter/model/types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

function splitFunctionBody(body: string): { parts: string[]; alpha?: string } {
  const [mainPart, slashAlpha] = body.split('/')
  const normalized = mainPart
    .trim()
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const parts = normalized.length ? normalized.split(' ') : []
  let alpha: string | undefined = slashAlpha?.trim()

  if (!alpha && parts.length === 4) {
    alpha = parts.pop()
  }

  return { parts, alpha }
}

function parseAlpha(token: string | undefined): number {
  if (token === undefined || token === '') return 1
  const value = parseFloat(token)
  if (Number.isNaN(value)) return 1
  return token.trim().endsWith('%') ? clamp(value / 100, 0, 1) : clamp(value, 0, 1)
}

function parseRgbChannel(token: string): number | null {
  const trimmed = token.trim()
  if (!trimmed) return null
  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return null
  const scaled = trimmed.endsWith('%') ? (value / 100) * 255 : value
  return clamp(Math.round(scaled), 0, 255)
}

function parseHue(token: string): number | null {
  const trimmed = token.trim().toLowerCase()
  if (!trimmed) return null
  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return null

  let degrees = value
  if (trimmed.endsWith('turn')) degrees = value * 360
  else if (trimmed.endsWith('grad')) degrees = value * 0.9
  else if (trimmed.endsWith('rad')) degrees = (value * 180) / Math.PI

  return ((degrees % 360) + 360) % 360
}

function parsePercentish(token: string): number | null {
  const trimmed = token.trim()
  if (!trimmed) return null
  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return null
  return value
}

function parseOklchLightness(token: string): number | null {
  const trimmed = token.trim()
  if (!trimmed) return null
  const value = parseFloat(trimmed)
  if (Number.isNaN(value)) return null
  const lightness = trimmed.endsWith('%') ? value / 100 : value
  return clamp(lightness, 0, 1)
}

function parseHex(value: string): RgbaColor | null {
  const hex = value.slice(1)
  if (!/^[0-9a-f]+$/i.test(hex)) return null

  let r: string
  let g: string
  let b: string
  let a = 'ff'

  switch (hex.length) {
    case 3:
      r = hex[0] + hex[0]
      g = hex[1] + hex[1]
      b = hex[2] + hex[2]
      break
    case 4:
      r = hex[0] + hex[0]
      g = hex[1] + hex[1]
      b = hex[2] + hex[2]
      a = hex[3] + hex[3]
      break
    case 6:
      r = hex.slice(0, 2)
      g = hex.slice(2, 4)
      b = hex.slice(4, 6)
      break
    case 8:
      r = hex.slice(0, 2)
      g = hex.slice(2, 4)
      b = hex.slice(4, 6)
      a = hex.slice(6, 8)
      break
    default:
      return null
  }

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
    a: roundTo(parseInt(a, 16) / 255, 3),
  }
}

function parseRgbFunction(body: string): RgbaColor | null {
  const { parts, alpha } = splitFunctionBody(body)
  if (parts.length !== 3) return null

  const r = parseRgbChannel(parts[0])
  const g = parseRgbChannel(parts[1])
  const b = parseRgbChannel(parts[2])
  if (r === null || g === null || b === null) return null

  return { r, g, b, a: parseAlpha(alpha) }
}

function parseHslFunction(body: string): RgbaColor | null {
  const { parts, alpha } = splitFunctionBody(body)
  if (parts.length !== 3) return null

  const h = parseHue(parts[0])
  const s = parsePercentish(parts[1])
  const l = parsePercentish(parts[2])
  if (h === null || s === null || l === null) return null

  const rgb = hslToRgb(h, clamp(s, 0, 100), clamp(l, 0, 100))
  return { ...rgb, a: parseAlpha(alpha) }
}

function parseOklchFunction(body: string): RgbaColor | null {
  const { parts, alpha } = splitFunctionBody(body)
  if (parts.length !== 3) return null

  const l = parseOklchLightness(parts[0])
  const c = parseFloat(parts[1])
  const h = parseHue(parts[2])
  if (l === null || Number.isNaN(c) || c < 0 || h === null) return null

  const rgb = oklchToRgb(l, c, h)
  return { ...rgb, a: parseAlpha(alpha) }
}

/**
 * Parse a CSS color string (hex, rgb/rgba, hsl/hsla, or oklch) into an
 * RGBA representation with 0-255 channels and a 0-1 alpha value.
 *
 * @param {string} input - Raw color text supplied by the user
 * @returns {RgbaColor | null} Parsed color, or null when the input is invalid
 */
export function parseColor(input: string): RgbaColor | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('#')) return parseHex(trimmed)

  const functional = trimmed.match(/^(rgb|rgba|hsl|hsla|oklch)\s*\(([^)]*)\)$/i)
  if (functional) {
    const kind = functional[1].toLowerCase()
    const body = functional[2]
    if (kind === 'rgb' || kind === 'rgba') return parseRgbFunction(body)
    if (kind === 'hsl' || kind === 'hsla') return parseHslFunction(body)
    return parseOklchFunction(body)
  }

  if (/^[0-9a-f]+$/i.test(trimmed) && [3, 4, 6, 8].includes(trimmed.length)) {
    return parseHex(`#${trimmed}`)
  }

  return null
}

/* ------------------------------------------------------------------ */
/* RGB <-> HSL                                                         */
/* ------------------------------------------------------------------ */

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 }
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0)
      break
    case gn:
      h = (bn - rn) / d + 2
      break
    default:
      h = (rn - gn) / d + 4
  }
  h *= 60

  return { h, s: s * 100, l: l * 100 }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100
  const ln = l / 100

  if (sn === 0) {
    const value = Math.round(ln * 255)
    return { r: value, g: value, b: value }
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hk = (((h % 360) + 360) % 360) / 360

  const hueToRgb = (t: number): number => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  return {
    r: Math.round(hueToRgb(hk + 1 / 3) * 255),
    g: Math.round(hueToRgb(hk) * 255),
    b: Math.round(hueToRgb(hk - 1 / 3) * 255),
  }
}

/* ------------------------------------------------------------------ */
/* RGB <-> OKLCH (via OKLab, https://bottosson.github.io/posts/oklab/)  */
/* ------------------------------------------------------------------ */

function srgbChannelToLinear(value: number): number {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function linearChannelToSrgb(value: number): number {
  const c = clamp(value, 0, 1)
  const gammaCorrected = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
  return clamp(Math.round(gammaCorrected * 255), 0, 255)
}

function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  const lr = srgbChannelToLinear(r)
  const lg = srgbChannelToLinear(g)
  const lb = srgbChannelToLinear(b)

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const okL = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const okA = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const okB = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const c = Math.sqrt(okA * okA + okB * okB)
  let h = (Math.atan2(okB, okA) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: okL, c, h }
}

function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hRad = (h * Math.PI) / 180
  const okA = c * Math.cos(hRad)
  const okB = c * Math.sin(hRad)

  const l_ = l + 0.3963377774 * okA + 0.2158037573 * okB
  const m_ = l - 0.1055613458 * okA - 0.0638541728 * okB
  const s_ = l - 0.0894841775 * okA - 1.291485548 * okB

  const lc = l_ ** 3
  const mc = m_ ** 3
  const sc = s_ ** 3

  const lr = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc
  const lg = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc
  const lb = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc

  return {
    r: linearChannelToSrgb(lr),
    g: linearChannelToSrgb(lg),
    b: linearChannelToSrgb(lb),
  }
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

function toHexChannel(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')
}

function formatAlphaValue(a: number): string {
  const rounded = roundTo(a, 3)
  return String(rounded)
}

export function formatHex(rgba: RgbaColor): string {
  const base = `#${toHexChannel(rgba.r)}${toHexChannel(rgba.g)}${toHexChannel(rgba.b)}`
  if (rgba.a >= 1) return base
  return `${base}${toHexChannel(Math.round(rgba.a * 255))}`
}

export function formatRgb(rgba: RgbaColor): string {
  const { r, g, b, a } = rgba
  return a >= 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${formatAlphaValue(a)})`
}

export function formatHsl(rgba: RgbaColor): string {
  const { h, s, l } = rgbToHsl(rgba.r, rgba.g, rgba.b)
  const hRound = roundTo(h, 0)
  const sRound = roundTo(s, 0)
  const lRound = roundTo(l, 0)
  return rgba.a >= 1
    ? `hsl(${hRound} ${sRound}% ${lRound}%)`
    : `hsl(${hRound} ${sRound}% ${lRound}% / ${formatAlphaValue(rgba.a)})`
}

export function formatOklch(rgba: RgbaColor): string {
  const { l, c, h } = rgbToOklch(rgba.r, rgba.g, rgba.b)
  const lPercent = roundTo(l * 100, 1)
  const cRound = roundTo(c, 3)
  const hRound = roundTo(h, 1)
  return rgba.a >= 1
    ? `oklch(${lPercent}% ${cRound} ${hRound})`
    : `oklch(${lPercent}% ${cRound} ${hRound} / ${formatAlphaValue(rgba.a)})`
}

/**
 * Parse and convert a color string into hex, rgb, hsl, and oklch
 * equivalents. Returns null when the input cannot be parsed as a
 * recognized color format.
 *
 * @param {string} input - Raw color text supplied by the user
 * @returns {ColorConversionResult | null} Conversion result, or null when invalid
 */
export function convertColor(input: string): ColorConversionResult | null {
  const rgba = parseColor(input)
  if (!rgba) return null

  return {
    input,
    rgba,
    hex: formatHex(rgba),
    rgb: formatRgb(rgba),
    hsl: formatHsl(rgba),
    oklch: formatOklch(rgba),
  }
}
