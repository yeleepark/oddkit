export type ImageResizerFormat = 'original' | 'jpeg' | 'png' | 'webp'

export interface ImageResizerOptions {
  format: ImageResizerFormat
  height: number
  keepAspectRatio: boolean
  quality: number
  width: number
}

export interface ImageResizerResult {
  blob: Blob
  filename: string
  height: number
  originalHeight: number
  originalSize: number
  originalWidth: number
  size: number
  type: string
  width: number
}
