export type JsonFormatterMode = 'format' | 'minify'

export interface JsonParseErrorInfo {
  /** Raw message from the native JSON.parse SyntaxError. */
  message: string
  /** 0-based character offset where parsing failed, when the engine reports one. */
  position: number | null
  /** 1-based line number derived from the offset (or reported directly by the engine). */
  line: number | null
  /** 1-based column number derived from the offset (or reported directly by the engine). */
  column: number | null
}

export type JsonParseResult<T = unknown> =
  | { ok: true; value: T }
  | { ok: false; error: JsonParseErrorInfo }
