import { getContrastColor } from '@/features/tools/dummy-image/lib/color'
import { getDisplayText } from '@/features/tools/dummy-image/lib/text'
import { DUMMY_IMAGE_PATTERN } from '@/features/tools/dummy-image/model/config'
import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

export function drawToCanvas(canvas: HTMLCanvasElement, config: DummyImageConfig): void {
  const {
    type,
    width,
    height,
    primaryColor,
    secondaryColor,
    text,
    fontSize,
    gradientDirection,
    patternStyle,
  } = config
  const displayText = getDisplayText({ height, text, width })
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  if (type === 'solid') {
    ctx.fillStyle = primaryColor
    ctx.fillRect(0, 0, width, height)
    drawText(ctx, displayText, fontSize, getContrastColor(primaryColor), width, height)
    return
  }

  if (type === 'gradient') {
    let grad: CanvasGradient
    if (gradientDirection === 'vertical') {
      grad = ctx.createLinearGradient(0, 0, 0, height)
    } else if (gradientDirection === 'horizontal') {
      grad = ctx.createLinearGradient(0, 0, width, 0)
    } else {
      grad = ctx.createLinearGradient(0, 0, width, height)
    }
    grad.addColorStop(0, primaryColor)
    grad.addColorStop(1, secondaryColor)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
    drawText(ctx, displayText, fontSize, '#ffffff', width, height)
    return
  }

  // pattern
  ctx.fillStyle = secondaryColor
  ctx.fillRect(0, 0, width, height)
  drawPattern(ctx, patternStyle, primaryColor, width, height)
  drawText(ctx, displayText, fontSize, getContrastColor(secondaryColor), width, height)
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  color: string,
  width: number,
  height: number
): void {
  ctx.fillStyle = color
  ctx.font = `${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  style: DummyImageConfig['patternStyle'],
  color: string,
  width: number,
  height: number
): void {
  ctx.strokeStyle = color
  ctx.fillStyle = color

  if (style === 'grid') {
    const step = DUMMY_IMAGE_PATTERN.gridStep
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = 0; x <= width; x += step) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    for (let y = 0; y <= height; y += step) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    ctx.stroke()
    return
  }

  if (style === 'dots') {
    const step = DUMMY_IMAGE_PATTERN.dotStep
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        ctx.beginPath()
        ctx.arc(x, y, DUMMY_IMAGE_PATTERN.dotRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return
  }

  // stripes
  const step = DUMMY_IMAGE_PATTERN.stripeStep
  ctx.lineWidth = DUMMY_IMAGE_PATTERN.stripeWidth
  ctx.beginPath()
  for (let i = -height; i < width + height; i += step) {
    ctx.moveTo(i, 0)
    ctx.lineTo(i + height, height)
  }
  ctx.stroke()
}
