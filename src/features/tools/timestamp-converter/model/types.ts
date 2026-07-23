export type TimestampUnit = 'seconds' | 'milliseconds'

export type TimestampUnitOption = 'auto' | TimestampUnit

export type DateInterpretation = 'local' | 'utc'

export interface ParsedTimestamp {
  epochMs: number
  unit: TimestampUnit
  date: Date
}

export type ParsedTimestampError = 'empty' | 'not_a_number' | 'out_of_range'

export type ParsedTimestampResult =
  | { ok: true; value: ParsedTimestamp }
  | { ok: false; error: ParsedTimestampError }

export interface ParsedDateTime {
  date: Date
  epochSeconds: number
  epochMs: number
}

export type ParsedDateTimeError = 'empty' | 'invalid'

export type ParsedDateTimeResult =
  | { ok: true; value: ParsedDateTime }
  | { ok: false; error: ParsedDateTimeError }
