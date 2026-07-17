'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { convertColor } from '@/features/tools/color-converter/lib/color'
import { copyToClipboard } from '@/features/tools/color-converter/lib/clipboard'
import { DEFAULT_COLOR_CONVERTER_INPUT } from '@/features/tools/color-converter/model/config'
import { COLOR_CONVERTER_FORMATS } from '@/features/tools/color-converter/model/options'
import type { ColorFormatId } from '@/features/tools/color-converter/model/types'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import Input from '@/shared/ui/Input'
import { trackToolAction, trackError } from '@/shared/analytics'

const COPY_FEEDBACK_MS = 1500

export default function ColorConverterTool() {
  const t = useTranslations('colorConverter')
  const commonT = useTranslations('common')
  const [inputValue, setInputValue] = useState(DEFAULT_COLOR_CONVERTER_INPUT)
  const [copiedFormat, setCopiedFormat] = useState<ColorFormatId | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const result = useMemo(() => convertColor(inputValue), [inputValue])
  const trimmedInput = inputValue.trim()
  const isInvalid = trimmedInput.length > 0 && !result

  const handleCopy = async (format: ColorFormatId, value: string) => {
    const success = await copyToClipboard(value)
    if (!success) {
      trackError('color-converter', 'copy_failed', format)
      return
    }

    trackToolAction('color-converter', 'copy', { format })
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    setCopiedFormat(format)
    copyTimeoutRef.current = setTimeout(() => setCopiedFormat(null), COPY_FEEDBACK_MS)
  }

  const pickerValue = result ? result.hex.slice(0, 7) : '#000000'

  return (
    <ToolPageLayout
      toolId="color-converter"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <Grid>
        <Controls>
          <div>
            <Label>{t('controls.input')}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                aria-label={t('controls.picker')}
                value={pickerValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-line-strong bg-panel p-1"
              />
              <Input
                id="color-converter-input"
                aria-label={t('controls.input')}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={t('controls.placeholder')}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full"
              />
            </div>
            <p className="mt-2 font-mono text-xs text-faint">{t('controls.supported')}</p>
          </div>

          {isInvalid && <p className="text-sm text-red-400">{t('errors.invalid')}</p>}

          <p className="font-mono text-xs text-faint">{commonT('noServerUpload')}</p>
        </Controls>

        <div className="space-y-2">
          {COLOR_CONVERTER_FORMATS.map(({ id, key }) => {
            const value = result ? result[id] : '-'
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel p-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase text-faint">{t(`formats.${key}`)}</p>
                  <p className="mt-1 truncate font-mono text-sm text-text-main">{value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => result && handleCopy(id, value)}
                  disabled={!result}
                  className="shrink-0 rounded-md border border-line-strong px-3 py-1.5 font-mono text-xs text-text-sub transition-colors hover:border-acid/70 hover:text-acid disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copiedFormat === id ? t('actions.copied') : t('actions.copy')}
                </button>
              </div>
            )
          })}
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
