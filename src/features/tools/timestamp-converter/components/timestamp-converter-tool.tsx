'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  formatInTimeZone,
  getLocalTimeZone,
  listSupportedTimeZones,
  parseDateTimeInput,
  parseTimestampInput,
  toDateTimeLocalValue,
} from '@/features/tools/timestamp-converter/lib/timestamp'
import type {
  DateInterpretation,
  ParsedDateTimeError,
  ParsedTimestampError,
  TimestampUnitOption,
} from '@/features/tools/timestamp-converter/model/types'
import CopyableValue from '@/features/tools/timestamp-converter/components/copyable-value'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import Button from '@/shared/ui/Button'
import { trackToolAction } from '@/shared/analytics'

const TIMESTAMP_UNIT_OPTIONS: TimestampUnitOption[] = ['auto', 'seconds', 'milliseconds']
const DATE_INTERPRETATION_OPTIONS: DateInterpretation[] = ['local', 'utc']

const TIMESTAMP_ERROR_KEYS: Record<ParsedTimestampError, string> = {
  empty: 'errors.empty',
  not_a_number: 'errors.not_a_number',
  out_of_range: 'errors.out_of_range',
}

const DATE_ERROR_KEYS: Record<ParsedDateTimeError, string> = {
  empty: 'errors.dateEmpty',
  invalid: 'errors.dateInvalid',
}

export default function TimestampConverterTool() {
  const t = useTranslations('timestampConverter')
  const commonT = useTranslations('common')

  const localTimeZone = useMemo(() => getLocalTimeZone(), [])
  const timeZoneOptions = useMemo(() => listSupportedTimeZones(), [])

  const [timestampInput, setTimestampInput] = useState('')
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnitOption>('auto')
  const [compareZone, setCompareZone] = useState('')

  const [dateInput, setDateInput] = useState('')
  const [interpretAs, setInterpretAs] = useState<DateInterpretation>('local')

  const timestampResult = useMemo(
    () => parseTimestampInput(timestampInput, timestampUnit),
    [timestampInput, timestampUnit]
  )

  const dateResult = useMemo(
    () => parseDateTimeInput(dateInput, interpretAs),
    [dateInput, interpretAs]
  )

  const timestampError =
    timestampInput.trim().length > 0 && !timestampResult.ok
      ? t(TIMESTAMP_ERROR_KEYS[timestampResult.error])
      : null

  const dateError =
    dateInput.trim().length > 0 && !dateResult.ok ? t(DATE_ERROR_KEYS[dateResult.error]) : null

  const handleNow = () => {
    setTimestampUnit('auto')
    setTimestampInput(String(Math.floor(Date.now() / 1000)))
    trackToolAction('timestamp-converter', 'use_now')
  }

  const handleUseCurrentTime = () => {
    setDateInput(toDateTimeLocalValue(new Date(), interpretAs))
    trackToolAction('timestamp-converter', 'use_current_time')
  }

  return (
    <ToolPageLayout
      toolId="timestamp-converter"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <p className="mb-6 font-mono text-xs text-faint">{commonT('noServerUpload')}</p>

      <Grid className="md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-text-main">{t('sections.toDate.title')}</h2>
          <Controls>
            <div>
              <Label>{t('controls.timestamp')}</Label>
              <div className="flex gap-2">
                <Input
                  aria-label={t('controls.timestamp')}
                  inputMode="decimal"
                  placeholder={t('controls.timestampPlaceholder')}
                  value={timestampInput}
                  onChange={(event) => setTimestampInput(event.target.value)}
                  className="flex-1"
                />
                <Select
                  aria-label={t('controls.unit')}
                  value={timestampUnit}
                  onChange={(event) =>
                    setTimestampUnit(event.target.value as TimestampUnitOption)
                  }
                >
                  {TIMESTAMP_UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {t(`units.${unit}`)}
                    </option>
                  ))}
                </Select>
              </div>
              {timestampResult.ok && timestampUnit === 'auto' && (
                <p className="mt-2 font-mono text-xs text-faint">
                  {t('results.detectedUnit', { unit: t(`units.${timestampResult.value.unit}`) })}
                </p>
              )}
              {timestampError && <p className="mt-2 text-sm text-red-400">{timestampError}</p>}
            </div>

            <Button variant="secondary" onClick={handleNow} className="w-full">
              {t('controls.now')}
            </Button>

            <div>
              <Label>{t('controls.compareZone')}</Label>
              <Select
                aria-label={t('controls.compareZone')}
                value={compareZone}
                onChange={(event) => setCompareZone(event.target.value)}
                className="w-full"
              >
                <option value="">{t('controls.compareZonePlaceholder')}</option>
                {timeZoneOptions.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </Select>
            </div>
          </Controls>

          <div className="space-y-3">
            <CopyableValue
              label={t('results.local', { zone: localTimeZone })}
              value={timestampResult.ok ? formatInTimeZone(timestampResult.value.date, localTimeZone) : null}
              emptyValue={t('results.empty')}
              copyLabel={t('actions.copy')}
              copiedLabel={t('actions.copied')}
            />
            <CopyableValue
              label={t('results.utc')}
              value={timestampResult.ok ? formatInTimeZone(timestampResult.value.date, 'UTC') : null}
              emptyValue={t('results.empty')}
              copyLabel={t('actions.copy')}
              copiedLabel={t('actions.copied')}
            />
            {compareZone && (
              <CopyableValue
                label={compareZone}
                value={
                  timestampResult.ok ? formatInTimeZone(timestampResult.value.date, compareZone) : null
                }
                emptyValue={t('results.empty')}
                copyLabel={t('actions.copy')}
                copiedLabel={t('actions.copied')}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-text-main">
            {t('sections.toTimestamp.title')}
          </h2>
          <Controls>
            <div>
              <Label>{t('controls.dateTime')}</Label>
              <Input
                aria-label={t('controls.dateTime')}
                type="datetime-local"
                step={1}
                value={dateInput}
                onChange={(event) => setDateInput(event.target.value)}
                className="w-full"
              />
              {dateError && <p className="mt-2 text-sm text-red-400">{dateError}</p>}
            </div>

            <div>
              <Label>{t('controls.interpretAs')}</Label>
              <Select
                aria-label={t('controls.interpretAs')}
                value={interpretAs}
                onChange={(event) => setInterpretAs(event.target.value as DateInterpretation)}
                className="w-full"
              >
                {DATE_INTERPRETATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`interpretations.${option}`)}
                  </option>
                ))}
              </Select>
            </div>

            <Button variant="secondary" onClick={handleUseCurrentTime} className="w-full">
              {t('controls.useCurrentTime')}
            </Button>
          </Controls>

          <div className="space-y-3">
            <CopyableValue
              label={t('results.unixSeconds')}
              value={dateResult.ok ? String(dateResult.value.epochSeconds) : null}
              emptyValue={t('results.empty')}
              copyLabel={t('actions.copy')}
              copiedLabel={t('actions.copied')}
            />
            <CopyableValue
              label={t('results.unixMilliseconds')}
              value={dateResult.ok ? String(dateResult.value.epochMs) : null}
              emptyValue={t('results.empty')}
              copyLabel={t('actions.copy')}
              copiedLabel={t('actions.copied')}
            />
            <CopyableValue
              label={t('results.isoUtc')}
              value={dateResult.ok ? dateResult.value.date.toISOString() : null}
              emptyValue={t('results.empty')}
              copyLabel={t('actions.copy')}
              copiedLabel={t('actions.copied')}
            />
          </div>
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
