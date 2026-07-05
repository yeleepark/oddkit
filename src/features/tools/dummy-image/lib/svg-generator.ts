import { getContrastColor } from '@/features/tools/dummy-image/lib/color'
import { getDisplayText } from '@/features/tools/dummy-image/lib/text'
import { DUMMY_IMAGE_PATTERN } from '@/features/tools/dummy-image/model/config'
import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

export function generateSVG(config: DummyImageConfig): string {
  const { type, width, height, primaryColor, secondaryColor, text, fontSize, gradientDirection, patternStyle } = config
  const displayText = getDisplayText({ height, text, width })
  const textEl = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" fill="${getContrastColor(primaryColor)}">${displayText}</text>`

  if (type === 'solid') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${primaryColor}"/>${textEl}</svg>`
  }

  if (type === 'gradient') {
    const x2 = gradientDirection === 'horizontal' || gradientDirection === 'diagonal' ? '100%' : '0%'
    const y2 = gradientDirection === 'vertical' || gradientDirection === 'diagonal' ? '100%' : '0%'
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0%" y1="0%" x2="${x2}" y2="${y2}"><stop offset="0%" stop-color="${primaryColor}"/><stop offset="100%" stop-color="${secondaryColor}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>${textEl}</svg>`
  }

  // pattern
  const patternDef = buildPatternDef(patternStyle, primaryColor, secondaryColor)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs>${patternDef}</defs><rect width="100%" height="100%" fill="url(#p)"/>${textEl}</svg>`
}

function buildPatternDef(style: DummyImageConfig['patternStyle'], fg: string, bg: string): string {
  if (style === 'grid') {
    const step = DUMMY_IMAGE_PATTERN.gridStep
    return `<pattern id="p" width="${step}" height="${step}" patternUnits="userSpaceOnUse"><rect width="${step}" height="${step}" fill="${bg}"/><path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${fg}" stroke-width="1"/></pattern>`
  }
  if (style === 'dots') {
    const step = DUMMY_IMAGE_PATTERN.dotStep
    return `<pattern id="p" width="${step}" height="${step}" patternUnits="userSpaceOnUse"><rect width="${step}" height="${step}" fill="${bg}"/><circle cx="${step / 2}" cy="${step / 2}" r="${DUMMY_IMAGE_PATTERN.dotRadius}" fill="${fg}"/></pattern>`
  }
  // stripes
  const step = DUMMY_IMAGE_PATTERN.stripeStep
  return `<pattern id="p" width="${step}" height="${step}" patternUnits="userSpaceOnUse"><rect width="${step}" height="${step}" fill="${bg}"/><path d="M 0 ${step} L ${step} 0" stroke="${fg}" stroke-width="${DUMMY_IMAGE_PATTERN.stripeWidth}"/></pattern>`
}
