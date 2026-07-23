'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { generateDummyText } from '@/features/tools/dummy-text/lib/generate'
import {
  DEFAULT_DUMMY_TEXT_CHAR_COUNT,
  DEFAULT_DUMMY_TEXT_LANGUAGE,
  DUMMY_TEXT_CHAR_COUNT_LIMITS,
  DUMMY_TEXT_LANGUAGES,
} from '@/features/tools/dummy-text/model/config'
import type { DummyTextLanguage } from '@/features/tools/dummy-text/model/types'
import { LOCALE_OPTIONS } from '@/config/locales'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import Chip from '@/shared/ui/Chip'
import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import { trackToolAction, trackError, trackFeaturePreference } from '@/shared/analytics'

const LANGUAGE_LABELS: Record<DummyTextLanguage, string> = Object.fromEntries(
  LOCALE_OPTIONS.map((option) => [option.code, option.label])
) as Record<DummyTextLanguage, string>

export default function DummyTextTool() {
  const t = useTranslations('dummyText')
  const commonT = useTranslations('common')
  const [language, setLanguage] = useState<DummyTextLanguage>(DEFAULT_DUMMY_TEXT_LANGUAGE)
  const [charCount, setCharCount] = useState(DEFAULT_DUMMY_TEXT_CHAR_COUNT)
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const limits = DUMMY_TEXT_CHAR_COUNT_LIMITS

  const output = useMemo(
    () => generateDummyText({ language, charCount }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, charCount, seed]
  )

  const handleLanguageChange = (nextLanguage: DummyTextLanguage) => {
    setLanguage(nextLanguage)
    trackFeaturePreference('dummy-text', 'language', nextLanguage)
  }

  const handleCharCountChange = (value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    setCharCount(Math.min(Math.max(Math.round(parsed), limits.min), limits.max))
  }

  const handleRegenerate = () => {
    setSeed((current) => current + 1)
    trackToolAction('dummy-text', 'regenerate', { language, charCount })
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      trackToolAction('dummy-text', 'copy', { language, charCount })
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch (caught) {
      trackError('dummy-text', 'copy_failed', caught instanceof Error ? caught.message : String(caught))
    }
  }

  return (
    <ToolPageLayout
      toolId="dummy-text"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <Grid>
        <Controls>
          <div>
            <div className="mb-3 flex min-h-9 items-center">
              <Label>{t('controls.languageLabel')}</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {DUMMY_TEXT_LANGUAGES.map((option) => (
                <Chip key={option} active={language === option} onClick={() => handleLanguageChange(option)}>
                  {LANGUAGE_LABELS[option]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex min-h-9 items-center">
              <Label>{t('controls.charCountLabel')}</Label>
            </div>
            <Input
              type="number"
              min={limits.min}
              max={limits.max}
              value={charCount}
              onChange={(event) => handleCharCountChange(event.target.value)}
              className="w-28"
            />
            <p className="mt-2 font-mono text-xs text-faint">
              {t('controls.countRange', { min: limits.min, max: limits.max })}
            </p>
          </div>

          <Button variant="secondary" type="button" onClick={handleRegenerate}>
            {t('actions.regenerate')}
          </Button>
        </Controls>

        <div>
          <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
            <Label>{t('controls.outputLabel')}</Label>
          </div>

          <textarea
            aria-label={t('controls.outputLabel')}
            value={output}
            readOnly
            spellCheck={false}
            className="h-72 w-full resize-y rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-xs leading-relaxed text-text-main outline-none transition-colors placeholder:text-faint focus:border-acid sm:text-sm"
            style={{ boxShadow: 'var(--theme-shadow)' }}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-mono text-xs text-faint">
              {t('controls.charCount', { count: output.length })} · {commonT('noServerUpload')}
            </p>
            <Button variant="secondary" type="button" onClick={handleCopy} disabled={!output}>
              {copied ? t('actions.copied') : t('actions.copy')}
            </Button>
          </div>
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
