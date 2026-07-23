'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { countCharacters } from '@/features/tools/character-counter/lib/count'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import Button from '@/shared/ui/Button'
import StatGrid from '@/shared/ui/StatGrid'
import Stat from '@/shared/ui/Stat'

export default function CharacterCounterTool() {
  const t = useTranslations('characterCounter')
  const [input, setInput] = useState('')

  const count = useMemo(() => countCharacters(input), [input])

  const handleClear = () => {
    setInput('')
  }

  return (
    <ToolPageLayout
      toolId="character-counter"
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
            <textarea
              aria-label={t('controls.inputLabel')}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('controls.placeholder')}
              spellCheck={false}
              className="h-72 w-full resize-y rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-xs leading-relaxed text-text-main outline-none transition-colors placeholder:text-faint focus:border-acid sm:text-sm"
              style={{ boxShadow: 'var(--theme-shadow)' }}
            />
          </div>
          <Button variant="secondary" type="button" onClick={handleClear} disabled={!input}>
            {t('actions.clear')}
          </Button>
        </Controls>

        <div>
          <div className="mb-3 flex min-h-9 items-center">
            <Label>{t('stats.title')}</Label>
          </div>
          <StatGrid>
            <Stat label={t('stats.withSpaces')} value={count.withSpaces} />
            <Stat label={t('stats.withoutSpaces')} value={count.withoutSpaces} />
          </StatGrid>
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
