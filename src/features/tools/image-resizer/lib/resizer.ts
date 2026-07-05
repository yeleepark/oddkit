import { getResizedFileName, getResizerMimeType } from '@/features/tools/image-resizer/lib/file'
import type {
  ImageResizerOptions,
  ImageResizerResult,
} from '@/features/tools/image-resizer/model/types'

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

        reject(new Error('Unable to resize this image.'))
      },
      mimeType,
      quality
    )
  })
}

export async function resizeImage(
  file: File,
  options: ImageResizerOptions
): Promise<ImageResizerResult> {
  const image = await loadImage(file)
  const mimeType = getResizerMimeType(file.type, options.format)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas is not supported in this browser.')
  }

  canvas.width = Math.max(1, Math.round(options.width))
  canvas.height = Math.max(1, Math.round(options.height))

  if (mimeType === 'image/jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await canvasToBlob(canvas, mimeType, options.quality)

  return {
    blob,
    filename: getResizedFileName(file.name, mimeType),
    height: canvas.height,
    originalHeight: image.naturalHeight,
    originalSize: file.size,
    originalWidth: image.naturalWidth,
    size: blob.size,
    type: mimeType,
    width: canvas.width,
  }
}
