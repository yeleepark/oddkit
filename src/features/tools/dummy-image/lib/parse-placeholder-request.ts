import { DUMMY_IMAGE_SIZE_LIMITS } from '@/features/tools/dummy-image/model/config'

export const PLACEHOLDER_FORMATS = ['png', 'jpg', 'webp'] as const
export type PlaceholderFormat = (typeof PLACEHOLDER_FORMATS)[number]

export interface ParsedPlaceholderRequest {
  width: number
  height: number
  format: PlaceholderFormat
}

export type PlaceholderParseError =
  | { reason: 'malformed' }
  | { reason: 'unsupported-format'; format: string }
  | { reason: 'out-of-range'; width: number; height: number }

export type PlaceholderParseResult =
  | { ok: true; value: ParsedPlaceholderRequest }
  | { ok: false; error: PlaceholderParseError }

const SEGMENT_PATTERN = /^(\d+)x(\d+)\.([a-zA-Z0-9]+)$/

function isPlaceholderFormat(format: string): format is PlaceholderFormat {
  return (PLACEHOLDER_FORMATS as readonly string[]).includes(format)
}

export function parsePlaceholderRequest(segment: string): PlaceholderParseResult {
  const match = SEGMENT_PATTERN.exec(segment)
  if (!match) {
    return { ok: false, error: { reason: 'malformed' } }
  }

  const width = Number(match[1])
  const height = Number(match[2])
  const format = match[3].toLowerCase()

  if (!isPlaceholderFormat(format)) {
    return { ok: false, error: { reason: 'unsupported-format', format } }
  }

  const { min, max } = DUMMY_IMAGE_SIZE_LIMITS
  if (width < min || width > max || height < min || height > max) {
    return { ok: false, error: { reason: 'out-of-range', width, height } }
  }

  return { ok: true, value: { width, height, format } }
}
