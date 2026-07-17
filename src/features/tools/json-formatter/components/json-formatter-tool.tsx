'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { formatJson, minifyJson } from '@/features/tools/json-formatter/lib/format'
import { parseJson } from '@/features/tools/json-formatter/lib/parse'
import {
  DEFAULT_JSON_FORMATTER_INPUT,
  DEFAULT_JSON_FORMATTER_MODE,
} from '@/features/tools/json-formatter/model/config'
import type { JsonFormatterMode } from '@/features/tools/json-formatter/model/types'
import JsonTextarea from '@/features/tools/json-formatter/components/json-textarea'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import Chip from '@/shared/ui/Chip'
import Button from '@/shared/ui/Button'
import { trackToolAction, trackError, trackFeaturePreference } from '@/shared/analytics'

type JsonStatus = 'empty' | 'valid' | 'invalid'

export default function JsonFormatterTool() {
  const t = useTranslations('jsonFormatter')
  const commonT = useTranslations('common')
  const [input, setInput] = useState(DEFAULT_JSON_FORMATTER_INPUT)
  const [mode, setMode] = useState<JsonFormatterMode>(DEFAULT_JSON_FORMATTER_MODE)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const parseResult = useMemo(() => (input.trim() === '' ? null : parseJson(input)), [input])

  const status: JsonStatus = !parseResult ? 'empty' : parseResult.ok ? 'valid' : 'invalid'
  const error = parseResult && !parseResult.ok ? parseResult.error : null

  const output = useMemo(() => {
    if (input.trim() === '') return ''
    const result = mode === 'format' ? formatJson(input) : minifyJson(input)
    return result.ok ? result.value : ''
  }, [input, mode])

  const errorMessage = useMemo(() => {
    if (!error) return ''
    if (error.line !== null && error.column !== null) {
      return t('errors.at', { message: error.message, line: error.line, column: error.column })
    }
    if (error.position !== null) {
      return t('errors.atPosition', { message: error.message, position: error.position })
    }
    return t('errors.plain', { message: error.message })
  }, [error, t])

  const handleModeChange = (nextMode: JsonFormatterMode) => {
    setMode(nextMode)
    trackFeaturePreference('json-formatter', 'mode', nextMode)
  }

  const handleClear = () => {
    setInput('')
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      trackToolAction('json-formatter', mode, { chars: output.length })
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch (caught) {
      trackError(
        'json-formatter',
        'copy_failed',
        caught instanceof Error ? caught.message : String(caught)
      )
    }
  }

  const statusClassName =
    status === 'invalid' ? 'text-red-400' : status === 'valid' ? 'text-acid' : 'text-faint'

  return (
    <ToolPageLayout
      toolId="json-formatter"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <Grid>
        <Controls>
          <div>
            <div className="mb-3 flex min-h-9 items-center">
              <Label>{t('controls.inputLabel')}</Label>
            </div>
            <JsonTextarea
              aria-label={t('controls.inputLabel')}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('controls.placeholder')}
              hasError={status === 'invalid'}
            />
            <div className="mt-2 flex items-center justify-between font-mono text-xs text-faint">
              <span>{t('controls.charCount', { count: input.length })}</span>
              <span className={statusClassName}>{t(`status.${status}`)}</span>
            </div>
          </div>
          <Button variant="secondary" type="button" onClick={handleClear} disabled={!input}>
            {t('actions.clear')}
          </Button>
        </Controls>

        <div>
          <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
            <Label>{t('controls.outputLabel')}</Label>
            <div className="flex gap-2">
              <Chip active={mode === 'format'} onClick={() => handleModeChange('format')}>
                {t('modes.format')}
              </Chip>
              <Chip active={mode === 'minify'} onClick={() => handleModeChange('minify')}>
                {t('modes.minify')}
              </Chip>
            </div>
          </div>

          {error ? (
            <div
              className="h-72 overflow-auto rounded-md border border-red-500/60 bg-panel p-4"
              style={{ boxShadow: 'var(--theme-shadow)' }}
            >
              <p className="font-mono text-xs text-red-400 sm:text-sm">{errorMessage}</p>
            </div>
          ) : (
            <JsonTextarea
              aria-label={t('controls.outputLabel')}
              value={output}
              readOnly
              placeholder={t('controls.outputPlaceholder')}
            />
          )}

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-mono text-xs text-faint">
              {t(`modes.${mode}`)} · {t('controls.charCount', { count: output.length })} ·{' '}
              {commonT('noServerUpload')}
            </p>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? t('actions.copied') : t('actions.copy')}
            </Button>
          </div>
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
