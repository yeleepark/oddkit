import {
  FALLBACK_TIME_ZONES,
  MAX_SAFE_EPOCH_MS,
  MILLISECONDS_DETECTION_THRESHOLD,
  MIN_SAFE_EPOCH_MS,
} from '@/features/tools/timestamp-converter/model/config'
import type {
  DateInterpretation,
  ParsedDateTimeResult,
  ParsedTimestampResult,
  TimestampUnit,
  TimestampUnitOption,
} from '@/features/tools/timestamp-converter/model/types'

const NUMERIC_INPUT_PATTERN = /^-?\d+(\.\d+)?$/

/**
 * Auto-detects whether a raw numeric value is more likely a Unix timestamp
 * expressed in seconds or milliseconds, based on its magnitude.
 */
export function detectTimestampUnit(value: number): TimestampUnit {
  return Math.abs(value) >= MILLISECONDS_DETECTION_THRESHOLD ? 'milliseconds' : 'seconds'
}

/**
 * Parses a raw timestamp string into a concrete Date, auto-detecting or
 * respecting an explicit seconds/milliseconds unit.
 */
export function parseTimestampInput(
  rawInput: string,
  unitOption: TimestampUnitOption = 'auto'
): ParsedTimestampResult {
  const trimmed = rawInput.trim()

  if (!trimmed) {
    return { ok: false, error: 'empty' }
  }

  if (!NUMERIC_INPUT_PATTERN.test(trimmed)) {
    return { ok: false, error: 'not_a_number' }
  }

  const value = Number(trimmed)
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'not_a_number' }
  }

  const unit = unitOption === 'auto' ? detectTimestampUnit(value) : unitOption
  const epochMs = unit === 'seconds' ? value * 1000 : value

  if (epochMs < MIN_SAFE_EPOCH_MS || epochMs > MAX_SAFE_EPOCH_MS) {
    return { ok: false, error: 'out_of_range' }
  }

  const date = new Date(epochMs)
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'out_of_range' }
  }

  return { ok: true, value: { epochMs, unit, date } }
}

/**
 * Parses a `datetime-local`-shaped string ("YYYY-MM-DDTHH:mm[:ss]") into a
 * Date, interpreting the wall-clock value as either local time or UTC.
 */
export function parseDateTimeInput(
  rawInput: string,
  interpretation: DateInterpretation
): ParsedDateTimeResult {
  const trimmed = rawInput.trim()

  if (!trimmed) {
    return { ok: false, error: 'empty' }
  }

  const isoCandidate =
    interpretation === 'utc' && !/[zZ]$/.test(trimmed) ? `${trimmed}Z` : trimmed
  const date = new Date(isoCandidate)

  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'invalid' }
  }

  const epochMs = date.getTime()
  return {
    ok: true,
    value: { date, epochMs, epochSeconds: Math.floor(epochMs / 1000) },
  }
}

/**
 * Formats a Date as "YYYY-MM-DD HH:mm:ss" within the given IANA time zone.
 */
export function formatInTimeZone(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value
    return acc
  }, {})

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`
}

/**
 * Formats a `datetime-local` input value ("YYYY-MM-DDTHH:mm:ss") from a Date,
 * reading either its local or UTC wall-clock components.
 */
export function toDateTimeLocalValue(date: Date, interpretation: DateInterpretation): string {
  const pad = (value: number) => String(value).padStart(2, '0')

  const parts =
    interpretation === 'utc'
      ? {
          year: date.getUTCFullYear(),
          month: date.getUTCMonth() + 1,
          day: date.getUTCDate(),
          hour: date.getUTCHours(),
          minute: date.getUTCMinutes(),
          second: date.getUTCSeconds(),
        }
      : {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
          second: date.getSeconds(),
        }

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
}

/**
 * Returns the browser's resolved IANA time zone (e.g. "Asia/Seoul").
 */
export function getLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

/**
 * Returns the list of IANA time zone names the runtime supports, for use in
 * a comparison time zone selector. Falls back to a small curated list on
 * runtimes without `Intl.supportedValuesOf`.
 */
export function listSupportedTimeZones(): string[] {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      const zones = Intl.supportedValuesOf('timeZone')
      // "UTC" is a valid Intl time zone identifier but ICU's IANA zone list
      // does not always include it explicitly, so it's added up front.
      return zones.includes('UTC') ? zones : ['UTC', ...zones]
    }
  } catch {
    // fall through to the fallback list below
  }
  return [...FALLBACK_TIME_ZONES]
}
