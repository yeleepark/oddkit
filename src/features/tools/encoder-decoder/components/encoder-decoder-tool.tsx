'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CodecError, transformText } from '@/features/tools/encoder-decoder/lib/codec'
import { copyToClipboard } from '@/features/tools/encoder-decoder/lib/clipboard'
import {
  ENCODER_DECODER_DIRECTION_OPTIONS,
  ENCODER_DECODER_MODE_OPTIONS,
} from '@/features/tools/encoder-decoder/model/options'
import type { CodecDirection, CodecMode } from '@/features/tools/encoder-decoder/model/types'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import Chip from '@/shared/ui/Chip'
import Button from '@/shared/ui/Button'
import { trackToolAction, trackError, trackFeaturePreference } from '@/shared/analytics'

const textareaClassName =
  'w-full resize-y rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-sm text-text-main outline-none transition-colors placeholder:text-faint focus:border-acid'

export default function EncoderDecoderTool() {
  const t = useTranslations('encoderDecoder')
  const commonT = useTranslations('common')
  const [mode, setMode] = useState<CodecMode>('url')
  const [direction, setDirection] = useState<CodecDirection>('encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const { output, errorMessage } = useMemo(() => {
    if (input === '') {
      return { output: '', errorMessage: null as string | null }
    }

    try {
      return { output: transformText(mode, direction, input), errorMessage: null as string | null }
    } catch (error) {
      const code = error instanceof CodecError ? error.code : 'generic'
      trackError('encoder-decoder', `${direction}_failed`, `${mode}:${code}`)
      const message =
        error instanceof CodecError && error.detail
          ? t(`errors.${code}`, { token: error.detail })
          : t(`errors.${code}`)
      return { output: '', errorMessage: message }
    }
  }, [mode, direction, input, t])

  const handleModeChange = (nextMode: CodecMode) => {
    setMode(nextMode)
    setCopied(false)
    trackFeaturePreference('encoder-decoder', 'mode', nextMode)
  }

  const handleDirectionChange = (nextDirection: CodecDirection) => {
    setDirection(nextDirection)
    setCopied(false)
    trackFeaturePreference('encoder-decoder', 'direction', nextDirection)
  }

  const handleCopy = async () => {
    if (!output) return
    const succeeded = await copyToClipboard(output)
    setCopied(succeeded)
    if (succeeded) {
      trackToolAction('encoder-decoder', 'copy', { mode, direction })
    }
  }

  return (
    <ToolPageLayout
      toolId="encoder-decoder"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <Grid>
        <Controls>
          <div>
            <Label>{t('controls.input')}</Label>
            <textarea
              aria-label={t('controls.input')}
              className={textareaClassName}
              rows={10}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setCopied(false)
              }}
              placeholder={t('controls.inputPlaceholder')}
              spellCheck={false}
            />
            <p className="mt-2 font-mono text-xs text-faint">{commonT('noServerUpload')}</p>
          </div>

          <div>
            <Label>{t('controls.mode')}</Label>
            <div className="flex flex-wrap gap-2">
              {ENCODER_DECODER_MODE_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  active={mode === option.value}
                  onClick={() => handleModeChange(option.value)}
                >
                  {t(`modes.${option.key}`)}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <Label>{t('controls.direction')}</Label>
            <div className="flex flex-wrap gap-2">
              {ENCODER_DECODER_DIRECTION_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  active={direction === option.value}
                  onClick={() => handleDirectionChange(option.value)}
                >
                  {t(`directions.${option.key}`)}
                </Chip>
              ))}
            </div>
          </div>
        </Controls>

        <div className="space-y-4">
          <div>
            <Label>{t('controls.output')}</Label>
            <textarea
              aria-label={t('controls.output')}
              className={`${textareaClassName} ${errorMessage ? 'border-red-400/70' : ''}`}
              rows={10}
              value={output}
              readOnly
              placeholder={t('controls.outputPlaceholder')}
              spellCheck={false}
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <Button onClick={handleCopy} disabled={!output || Boolean(errorMessage)}>
            {copied ? t('actions.copied') : t('actions.copy')}
          </Button>
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
