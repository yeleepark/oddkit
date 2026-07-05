import {
  getConvertedFileName,
  getConverterMimeType,
} from '@/features/tools/image-converter/lib/file'
import type {
  ImageConverterOptions,
  ImageConverterResult,
} from '@/features/tools/image-converter/model/types'

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

        reject(new Error('Unable to convert this image.'))
      },
      mimeType,
      quality
    )
  })
}

export async function convertImage(
  file: File,
  options: ImageConverterOptions
): Promise<ImageConverterResult> {
  const image = await loadImage(file)
  const mimeType = getConverterMimeType(options.format)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas is not supported in this browser.')
  }

  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  if (mimeType === 'image/jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  context.drawImage(image, 0, 0)

  const blob = await canvasToBlob(canvas, mimeType, options.quality)

  return {
    blob,
    filename: getConvertedFileName(file.name, options.format),
    height: canvas.height,
    originalSize: file.size,
    size: blob.size,
    type: mimeType,
    width: canvas.width,
  }
}
