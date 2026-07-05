export type ImageConverterFormat = 'jpeg' | 'png' | 'webp'

export interface ImageConverterOptions {
  format: ImageConverterFormat
  quality: number
}

export interface ImageConverterResult {
  blob: Blob
  filename: string
  height: number
  originalSize: number
  size: number
  type: string
  width: number
}
