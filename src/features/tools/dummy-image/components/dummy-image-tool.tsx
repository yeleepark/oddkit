'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import CanvasPreview from '@/features/tools/dummy-image/components/canvas-preview'
import Controls from '@/features/tools/dummy-image/components/Controls'
import DownloadButton from '@/features/tools/dummy-image/components/download-button'
import { DEFAULT_DUMMY_IMAGE_CONFIG } from '@/features/tools/dummy-image/model/config'
import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Label from '@/shared/ui/Label'

export default function DummyImageTool() {
  const t = useTranslations('dummyImage')
  const commonT = useTranslations('common')
  const [config, setConfig] = useState<DummyImageConfig>(DEFAULT_DUMMY_IMAGE_CONFIG)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  return (
    <ToolPageLayout
      toolId="dummy-image"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <Grid>
        <div className="flex flex-col gap-6 text-sm">
          <Controls config={config} onChange={setConfig} />
          <DownloadButton canvasRef={canvasRef} config={config} />
        </div>
        <div>
          <Label>{t('preview')}</Label>
          <CanvasPreview config={config} canvasRef={canvasRef} />
          <p className="mt-3 font-mono text-xs text-faint">
            {t('ui.captionAction', { type: config.type })} · {config.width}x{config.height} ·{' '}
            {config.format} · {commonT('noServerUpload')}
          </p>
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
