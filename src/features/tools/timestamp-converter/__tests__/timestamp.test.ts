import {
  detectTimestampUnit,
  formatInTimeZone,
  listSupportedTimeZones,
  getLocalTimeZone,
  parseDateTimeInput,
  parseTimestampInput,
  toDateTimeLocalValue,
} from '@/features/tools/timestamp-converter/lib/timestamp'

describe('detectTimestampUnit', () => {
  test('treats present-day epoch seconds as seconds', () => {
    expect(detectTimestampUnit(1720000000)).toBe('seconds')
  })

  test('treats present-day epoch milliseconds as milliseconds', () => {
    expect(detectTimestampUnit(1720000000000)).toBe('milliseconds')
  })

  test('applies the same rule to negative values', () => {
    expect(detectTimestampUnit(-1720000000)).toBe('seconds')
    expect(detectTimestampUnit(-1720000000000)).toBe('milliseconds')
  })

  test('is inclusive at the threshold boundary', () => {
    expect(detectTimestampUnit(1e11)).toBe('milliseconds')
    expect(detectTimestampUnit(1e11 - 1)).toBe('seconds')
  })
})

describe('parseTimestampInput', () => {
  test('parses a seconds timestamp with auto-detection', () => {
    const result = parseTimestampInput('1720000000')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.unit).toBe('seconds')
      expect(result.value.date.toISOString()).toBe('2024-07-03T09:46:40.000Z')
    }
  })

  test('parses a milliseconds timestamp with auto-detection', () => {
    const result = parseTimestampInput('1720000000000')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.unit).toBe('milliseconds')
      expect(result.value.date.toISOString()).toBe('2024-07-03T09:46:40.000Z')
    }
  })

  test('respects an explicit unit override even for small numbers', () => {
    const result = parseTimestampInput('5', 'milliseconds')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.unit).toBe('milliseconds')
      expect(result.value.epochMs).toBe(5)
    }
  })

  test('respects an explicit seconds override for large numbers', () => {
    const result = parseTimestampInput('1720000000000', 'seconds')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.unit).toBe('seconds')
      expect(result.value.epochMs).toBe(1720000000000000)
    }
  })

  test('allows negative timestamps (pre-1970 dates)', () => {
    const result = parseTimestampInput('-86400')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.date.toISOString()).toBe('1969-12-31T00:00:00.000Z')
    }
  })

  test('allows fractional-second timestamps', () => {
    const result = parseTimestampInput('1720000000.5')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.epochMs).toBe(1720000000500)
    }
  })

  test('rejects empty input', () => {
    expect(parseTimestampInput('')).toEqual({ ok: false, error: 'empty' })
    expect(parseTimestampInput('   ')).toEqual({ ok: false, error: 'empty' })
  })

  test('rejects non-numeric input', () => {
    expect(parseTimestampInput('not-a-timestamp')).toEqual({
      ok: false,
      error: 'not_a_number',
    })
    expect(parseTimestampInput('12abc')).toEqual({ ok: false, error: 'not_a_number' })
  })

  test('rejects out-of-range values beyond the Date object limits', () => {
    const result = parseTimestampInput('1e300')
    expect(result).toEqual({ ok: false, error: 'not_a_number' })
  })

  test('rejects values that resolve outside the safe epoch range', () => {
    const result = parseTimestampInput('99999999999999999', 'milliseconds')
    expect(result).toEqual({ ok: false, error: 'out_of_range' })
  })
})

describe('parseDateTimeInput', () => {
  test('interprets input as UTC when requested', () => {
    const result = parseDateTimeInput('2024-07-03T09:46:40', 'utc')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.epochSeconds).toBe(1720000000)
      expect(result.value.epochMs).toBe(1720000000000)
    }
  })

  test('interprets input as local time, matching native Date parsing', () => {
    const raw = '2024-07-03T09:46:40'
    const result = parseDateTimeInput(raw, 'local')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.epochMs).toBe(new Date(raw).getTime())
    }
  })

  test('rejects empty input', () => {
    expect(parseDateTimeInput('', 'local')).toEqual({ ok: false, error: 'empty' })
  })

  test('rejects an unparsable date string', () => {
    expect(parseDateTimeInput('not-a-date', 'local')).toEqual({ ok: false, error: 'invalid' })
  })
})

describe('formatInTimeZone', () => {
  const date = new Date('2024-07-03T09:46:40.000Z')

  test('formats a date in UTC', () => {
    expect(formatInTimeZone(date, 'UTC')).toBe('2024-07-03 09:46:40')
  })

  test('formats the same date differently in another zone', () => {
    expect(formatInTimeZone(date, 'America/New_York')).toBe('2024-07-03 05:46:40')
  })
})

describe('toDateTimeLocalValue', () => {
  test('formats UTC wall-clock components', () => {
    const date = new Date('2024-07-03T09:46:40.000Z')
    expect(toDateTimeLocalValue(date, 'utc')).toBe('2024-07-03T09:46:40')
  })

  test('formats local wall-clock components in the expected shape', () => {
    const date = new Date('2024-07-03T09:46:40.000Z')
    expect(toDateTimeLocalValue(date, 'local')).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
    )
  })
})

describe('getLocalTimeZone', () => {
  test('returns a non-empty IANA time zone name', () => {
    expect(typeof getLocalTimeZone()).toBe('string')
    expect(getLocalTimeZone().length).toBeGreaterThan(0)
  })
})

describe('listSupportedTimeZones', () => {
  test('includes UTC and returns a non-trivial list', () => {
    const zones = listSupportedTimeZones()
    expect(zones).toContain('UTC')
    expect(zones.length).toBeGreaterThan(10)
  })
})
