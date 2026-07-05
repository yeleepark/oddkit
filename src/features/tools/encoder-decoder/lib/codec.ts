import type { CodecDirection, CodecErrorCode, CodecMode } from '@/features/tools/encoder-decoder/model/types'

/**
 * Error thrown when encoding or decoding fails.
 * `code` maps to a localized error message key; `detail` carries
 * interpolation data (e.g. the offending token) when available.
 */
export class CodecError extends Error {
  code: CodecErrorCode
  detail?: string

  constructor(code: CodecErrorCode, detail?: string) {
    super(detail ? `${code}: ${detail}` : code)
    this.name = 'CodecError'
    this.code = code
    this.detail = detail
  }
}

export function encodeUrlText(input: string): string {
  try {
    return encodeURIComponent(input)
  } catch {
    throw new CodecError('generic')
  }
}

export function decodeUrlText(input: string): string {
  try {
    return decodeURIComponent(input)
  } catch {
    throw new CodecError('invalidUrl')
  }
}

const BASE64_CHARS_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/

export function encodeBase64Text(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

export function decodeBase64Text(input: string): string {
  const sanitized = input.replace(/\s+/g, '')

  if (sanitized === '') return ''

  if (!BASE64_CHARS_PATTERN.test(sanitized) || sanitized.length % 4 !== 0) {
    throw new CodecError('invalidBase64')
  }

  try {
    const binary = atob(sanitized)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new CodecError('invalidBase64')
  }
}

const HTML_ENTITY_ENCODE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const HTML_ENTITY_DECODE_MAP: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  euro: '€',
  pound: '£',
  yen: '¥',
  cent: '¢',
}

const HTML_ENTITY_PATTERN = /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g

function isValidCodePoint(codePoint: number): boolean {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 0x10ffff &&
    !(codePoint >= 0xd800 && codePoint <= 0xdfff)
  )
}

export function encodeHtmlEntitiesText(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ENTITY_ENCODE_MAP[char])
}

export function decodeHtmlEntitiesText(input: string): string {
  let invalidToken: string | null = null

  const result = input.replace(HTML_ENTITY_PATTERN, (match, body: string) => {
    if (invalidToken) return match

    if (body[0] === '#' && (body[1] === 'x' || body[1] === 'X')) {
      const codePoint = parseInt(body.slice(2), 16)
      if (!isValidCodePoint(codePoint)) {
        invalidToken = match
        return match
      }
      return String.fromCodePoint(codePoint)
    }

    if (body[0] === '#') {
      const codePoint = parseInt(body.slice(1), 10)
      if (!isValidCodePoint(codePoint)) {
        invalidToken = match
        return match
      }
      return String.fromCodePoint(codePoint)
    }

    const decoded = HTML_ENTITY_DECODE_MAP[body.toLowerCase()]
    if (decoded === undefined) {
      invalidToken = match
      return match
    }
    return decoded
  })

  if (invalidToken) {
    throw new CodecError('invalidHtmlEntity', invalidToken)
  }

  return result
}

export function encodeText(mode: CodecMode, input: string): string {
  switch (mode) {
    case 'url':
      return encodeUrlText(input)
    case 'base64':
      return encodeBase64Text(input)
    case 'html':
      return encodeHtmlEntitiesText(input)
  }
}

export function decodeText(mode: CodecMode, input: string): string {
  switch (mode) {
    case 'url':
      return decodeUrlText(input)
    case 'base64':
      return decodeBase64Text(input)
    case 'html':
      return decodeHtmlEntitiesText(input)
  }
}

export function transformText(mode: CodecMode, direction: CodecDirection, input: string): string {
  return direction === 'encode' ? encodeText(mode, input) : decodeText(mode, input)
}
