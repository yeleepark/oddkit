'use client'

import { useEffect } from 'react'
import Preview from '@/shared/ui/Preview'
import { drawToCanvas } from '@/features/tools/dummy-image/lib/canvas-generator'
import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

interface CanvasPreviewProps {
  config: DummyImageConfig
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function CanvasPreview({ config, canvasRef }: CanvasPreviewProps) {
  useEffect(() => {
    if (canvasRef.current) {
      drawToCanvas(canvasRef.current, config)
    }
  }, [config, canvasRef])

  return (
    <Preview>
      <canvas
        ref={canvasRef}
        className="max-h-96 max-w-full object-contain shadow-sm"
      />
    </Preview>
  )
}
