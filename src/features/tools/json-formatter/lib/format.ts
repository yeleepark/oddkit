import { parseJson } from '@/features/tools/json-formatter/lib/parse'
import { JSON_FORMAT_INDENT } from '@/features/tools/json-formatter/model/config'
import type { JsonParseResult } from '@/features/tools/json-formatter/model/types'

/**
 * Parses and pretty-prints a JSON string with a fixed indent.
 *
 * @param {string} input - The raw JSON text to format.
 * @returns {JsonParseResult<string>} The formatted JSON text, or the parse error.
 */
export function formatJson(input: string): JsonParseResult<string> {
  const result = parseJson(input)
  if (!result.ok) return result
  return { ok: true, value: JSON.stringify(result.value, null, JSON_FORMAT_INDENT) }
}

/**
 * Parses and compacts a JSON string into a single line with no extra whitespace.
 *
 * @param {string} input - The raw JSON text to minify.
 * @returns {JsonParseResult<string>} The minified JSON text, or the parse error.
 */
export function minifyJson(input: string): JsonParseResult<string> {
  const result = parseJson(input)
  if (!result.ok) return result
  return { ok: true, value: JSON.stringify(result.value) }
}
