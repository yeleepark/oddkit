import {
  getOutputFileName,
  getOutputMimeType,
  getResizedDimensions,
  getTargetSizeBytes,
} from '@/features/tools/image-compressor/lib/file'
import { IMAGE_COMPRESSOR_LIMITS } from '@/features/tools/image-compressor/model/config'
import type {
  ImageCompressorOptions,
  ImageCompressorResult,
} from '@/features/tools/image-compressor/model/types'

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unable to read this image.'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Unable to compress this image.'))
      },
      mimeType,
      quality
    )
  })
}

function drawImageToCanvas(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  mimeType: string,
  width: number,
  height: number
): void {
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas is not supported in this browser.')
  }

  canvas.width = width
  canvas.height = height

  if (mimeType === 'image/jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  } else {
    context.clearRect(0, 0, width, height)
  }

  context.drawImage(image, 0, 0, width, height)
}

async function compressToTargetSize(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  mimeType: string,
  initialWidth: number,
  initialHeight: number,
  targetBytes: number
): Promise<{ blob: Blob; height: number; quality: number; targetReached: boolean; width: number }> {
  let width = initialWidth
  let height = initialHeight
  let bestBlob: Blob | null = null
  let bestQuality: number = IMAGE_COMPRESSOR_LIMITS.qualityMin
  let bestWidth = width
  let bestHeight = height
  let smallestBlob: Blob | null = null
  let smallestQuality: number = IMAGE_COMPRESSOR_LIMITS.qualityMin
  let smallestWidth = width
  let smallestHeight = height

  for (let attempt = 0; attempt <= IMAGE_COMPRESSOR_LIMITS.targetDimensionAttempts; attempt += 1) {
    drawImageToCanvas(image, canvas, mimeType, width, height)

    let low: number = IMAGE_COMPRESSOR_LIMITS.qualityMin
    let high: number = IMAGE_COMPRESSOR_LIMITS.qualityMax

    for (let iteration = 0; iteration < IMAGE_COMPRESSOR_LIMITS.targetIterations; iteration += 1) {
      const quality = (low + high) / 2
      const blob = await canvasToBlob(canvas, mimeType, quality)

      if (!smallestBlob || blob.size < smallestBlob.size) {
        smallestBlob = blob
        smallestQuality = quality
        smallestWidth = width
        smallestHeight = height
      }

      if (blob.size <= targetBytes) {
        bestBlob = blob
        bestQuality = quality
        bestWidth = width
        bestHeight = height
        low = quality
      } else {
        high = quality
      }
    }

    if (bestBlob) {
      return {
        blob: bestBlob,
        height: bestHeight,
        quality: bestQuality,
        targetReached: true,
        width: bestWidth,
      }
    }

    width = Math.max(1, Math.round(width * IMAGE_COMPRESSOR_LIMITS.targetDimensionScale))
    height = Math.max(1, Math.round(height * IMAGE_COMPRESSOR_LIMITS.targetDimensionScale))
  }

  return {
    blob:
      smallestBlob ?? (await canvasToBlob(canvas, mimeType, IMAGE_COMPRESSOR_LIMITS.qualityMin)),
    height: smallestHeight,
    quality: smallestQuality,
    targetReached: false,
    width: smallestWidth,
  }
}

export async function compressImage(
  file: File,
  options: ImageCompressorOptions
): Promise<ImageCompressorResult> {
  const image = await loadImage(file)
  const { width, height } = getResizedDimensions(
    image.naturalWidth,
    image.naturalHeight,
    options.maxWidth,
    options.maxHeight
  )
  const mimeType = getOutputMimeType(file.type, options.format)
  const canvas = document.createElement('canvas')

  if (options.mode === 'target') {
    const compressed = await compressToTargetSize(
      image,
      canvas,
      mimeType,
      width,
      height,
      getTargetSizeBytes(options.targetSize, options.targetUnit)
    )

    return {
      blob: compressed.blob,
      filename: getOutputFileName(file.name, mimeType),
      height: compressed.height,
      originalSize: file.size,
      quality: compressed.quality,
      size: compressed.blob.size,
      targetReached: compressed.targetReached,
      type: mimeType,
      width: compressed.width,
    }
  }

  drawImageToCanvas(image, canvas, mimeType, width, height)
  const blob = await canvasToBlob(canvas, mimeType, options.quality)

  return {
    blob,
    filename: getOutputFileName(file.name, mimeType),
    height,
    originalSize: file.size,
    quality: options.quality,
    size: blob.size,
    targetReached: true,
    type: mimeType,
    width,
  }
}
