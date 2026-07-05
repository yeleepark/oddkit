'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Button from '@/shared/ui/Button'
import { downloadImage } from '@/features/tools/dummy-image/lib/downloader'
import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  config: DummyImageConfig
}

export default function DownloadButton({ canvasRef, config }: DownloadButtonProps) {
  const t = useTranslations('dummyImage.download')
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!canvasRef.current) return
    setLoading(true)
    try {
      await downloadImage(canvasRef.current, config)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? t('generating') : t('button', { format: config.format.toUpperCase() })}
    </Button>
  )
}
