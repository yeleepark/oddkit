/**
 * Absolute value threshold used to auto-detect whether a numeric timestamp is
 * expressed in seconds or milliseconds.
 *
 * Present-day Unix seconds are ~1.7e9 and won't reach 1e11 until the year 5138.
 * Present-day Unix milliseconds are ~1.7e12, comfortably above this threshold.
 */
export const MILLISECONDS_DETECTION_THRESHOLD = 1e11

/**
 * Matches the valid range of the JS `Date` object (+/-100,000,000 days from epoch).
 */
export const MIN_SAFE_EPOCH_MS = -8.64e15
export const MAX_SAFE_EPOCH_MS = 8.64e15

/**
 * Used only when the runtime does not support `Intl.supportedValuesOf('timeZone')`.
 */
export const FALLBACK_TIME_ZONES = [
  'UTC',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Seoul',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
] as const
