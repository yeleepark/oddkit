import { IMAGE_CONVERTER_MIME_TYPES } from '@/features/tools/image-converter/model/options'
import type { ImageConverterFormat } from '@/features/tools/image-converter/model/types'

export function getConverterMimeType(format: ImageConverterFormat): string {
  return IMAGE_CONVERTER_MIME_TYPES[format]
}

export function getConvertedFileName(inputName: string, format: ImageConverterFormat): string {
  const baseName = inputName.replace(/\.[^.]+$/, '') || 'image'
  const extension = format === 'jpeg' ? 'jpg' : format
  return `${baseName}.${extension}`
}
