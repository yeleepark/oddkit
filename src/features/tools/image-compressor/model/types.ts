export type ImageCompressorFormat = 'original' | 'jpeg' | 'png' | 'webp'
export type ImageCompressorMode = 'manual' | 'target'
export type ImageCompressorSizeUnit = 'kb' | 'mb'

export interface ImageCompressorOptions {
  format: ImageCompressorFormat
  quality: number
  maxWidth: number
  maxHeight: number
  mode: ImageCompressorMode
  targetSize: number
  targetUnit: ImageCompressorSizeUnit
}

export interface ImageCompressorResult {
  blob: Blob
  filename: string
  height: number
  originalSize: number
  quality: number
  size: number
  targetReached: boolean
  type: string
  width: number
}
