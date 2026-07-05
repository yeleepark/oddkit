export type ColorFormatId = 'hex' | 'rgb' | 'hsl' | 'oklch'

export interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

export interface ColorConversionResult {
  input: string
  rgba: RgbaColor
  hex: string
  rgb: string
  hsl: string
  oklch: string
}
