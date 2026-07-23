import type { JsonParseResult } from '@/features/tools/json-formatter/model/types'

/**
 * Converts a 0-based character offset into a 1-based line/column pair.
 *
 * @param {string} input - The full source text the offset refers to.
 * @param {number} offset - A 0-based character offset into `input`.
 * @returns {{line: number, column: number}} 1-based line and column numbers.
 */
export function offsetToLineColumn(input: string, offset: number): { line: number; column: number } {
  const clamped = Math.max(0, Math.min(offset, input.length))
  let line = 1
  let column = 1

  for (let i = 0; i < clamped; i += 1) {
    if (input[i] === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
  }

  return { line, column }
}

/**
 * Extracts a 0-based character offset from a native JSON.parse SyntaxError
 * message, e.g. V8's "Unexpected token } in JSON at position 12".
 *
 * @param {string} message - The SyntaxError message thrown by JSON.parse.
 * @returns {number | null} The offset, or null when the engine did not report one.
 */
export function extractPositionFromMessage(message: string): number | null {
  const match = message.match(/position (\d+)/i)
  return match ? Number(match[1]) : null
}

/**
 * Extracts a 1-based line/column pair directly reported in some engines'
 * error messages, e.g. "... (line 3 column 1)" or Firefox's
 * "JSON.parse: unexpected character at line 2 column 4".
 *
 * @param {string} message - The SyntaxError message thrown by JSON.parse.
 * @returns {{line: number, column: number} | null} The line/column, or null when absent.
 */
export function extractLineColumnFromMessage(
  message: string
): { line: number; column: number } | null {
  const match = message.match(/line (\d+) column (\d+)/i)
  if (!match) return null
  return { line: Number(match[1]), column: Number(match[2]) }
}

/**
 * Parses a JSON string, returning a discriminated result instead of throwing.
 * When parsing fails, best-effort line/column information is extracted from
 * the native SyntaxError message so callers can point users at the problem.
 *
 * @param {string} input - The raw JSON text to parse.
 * @returns {JsonParseResult<T>} The parsed value, or structured error details.
 */
export function parseJson<T = unknown>(input: string): JsonParseResult<T> {
  try {
    return { ok: true, value: JSON.parse(input) as T }
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught)
    const position = extractPositionFromMessage(message)

    if (position !== null) {
      const { line, column } = offsetToLineColumn(input, position)
      return { ok: false, error: { message, position, line, column } }
    }

    const lineColumn = extractLineColumnFromMessage(message)
    if (lineColumn) {
      return {
        ok: false,
        error: { message, position: null, line: lineColumn.line, column: lineColumn.column },
      }
    }

    return { ok: false, error: { message, position: null, line: null, column: null } }
  }
}
