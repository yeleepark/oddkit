export type ImageType = 'solid' | 'gradient' | 'pattern'
export type GradientDirection = 'vertical' | 'horizontal' | 'diagonal'
export type PatternStyle = 'grid' | 'dots' | 'stripes'
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg' | 'gif'

export interface DummyImageConfig {
  type: ImageType
  width: number
  height: number
  primaryColor: string
  secondaryColor: string
  text: string
  fontSize: number
  gradientDirection: GradientDirection
  patternStyle: PatternStyle
  format: ImageFormat
}
