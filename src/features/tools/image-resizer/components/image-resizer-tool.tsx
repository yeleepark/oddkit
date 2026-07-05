'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { getAspectRatioHeight, getAspectRatioWidth } from '@/features/tools/image-resizer/lib/file'
import { resizeImage } from '@/features/tools/image-resizer/lib/resizer'
import {
  DEFAULT_IMAGE_RESIZER_OPTIONS,
  IMAGE_RESIZER_LIMITS,
} from '@/features/tools/image-resizer/model/config'
import {
  IMAGE_RESIZER_ACCEPTED_TYPES,
  IMAGE_RESIZER_FORMAT_OPTIONS,
  IMAGE_RESIZER_SCALE_PRESETS,
} from '@/features/tools/image-resizer/model/options'
import type {
  ImageResizerOptions,
  ImageResizerResult,
} from '@/features/tools/image-resizer/model/types'
import { formatBytes } from '@/features/tools/image-compressor/lib/file'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import FileInput from '@/shared/ui/FileInput'
import Chip from '@/shared/ui/Chip'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import Button from '@/shared/ui/Button'
import Preview from '@/shared/ui/Preview'
import Stat from '@/shared/ui/Stat'
import StatGrid from '@/shared/ui/StatGrid'
import { trackToolAction, trackDownload, trackError, trackFileUpload, trackFeaturePreference } from '@/shared/analytics'

interface SourceDimensions {
  width: number
  height: number
}

export default function ImageResizerTool() {
  const t = useTranslations('imageResizer')
  const commonT = useTranslations('common')
  const [file, setFile] = useState<File | null>(null)
  const [sourceDimensions, setSourceDimensions] = useState<SourceDimensions | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [result, setResult] = useState<ImageResizerResult | null>(null)
  const [options, setOptions] = useState<ImageResizerOptions>(DEFAULT_IMAGE_RESIZER_OPTIONS)
  const [isResizing, setIsResizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = useMemo(() => IMAGE_RESIZER_ACCEPTED_TYPES.join(','), [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [previewUrl, resultUrl])

  const resetResult = () => {
    setResult(null)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
  }

  const setOption = (partial: Partial<ImageResizerOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    resetResult()
  }

  const updateWidth = (width: number) => {
    const nextWidth = Math.max(IMAGE_RESIZER_LIMITS.dimensionMin, Math.round(width))
    setOption({
      width: nextWidth,
      height:
        options.keepAspectRatio && sourceDimensions
          ? getAspectRatioHeight(nextWidth, sourceDimensions.width, sourceDimensions.height)
          : options.height,
    })
  }

  const updateHeight = (height: number) => {
    const nextHeight = Math.max(IMAGE_RESIZER_LIMITS.dimensionMin, Math.round(height))
    setOption({
      height: nextHeight,
      width:
        options.keepAspectRatio && sourceDimensions
          ? getAspectRatioWidth(nextHeight, sourceDimensions.width, sourceDimensions.height)
          : options.width,
    })
  }

  const readDimensions = (nextFile: File, url: string) => {
    const image = new Image()
    image.onload = () => {
      const dimensions = { width: image.naturalWidth, height: image.naturalHeight }
      setSourceDimensions(dimensions)
      setOptions((current) => ({
        ...current,
        width: dimensions.width,
        height: dimensions.height,
      }))
    }
    image.onerror = () => setError(t('errors.read'))
    image.src = url
  }

  const handleFileChange = (nextFile: File | null) => {
    setError(null)
    setSourceDimensions(null)
    resetResult()
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!IMAGE_RESIZER_ACCEPTED_TYPES.includes(nextFile.type as never)) {
      setFile(null)
      setError(t('errors.unsupported'))
      trackError('image-resizer', 'unsupported_format', nextFile.type)
      return
    }

    const url = URL.createObjectURL(nextFile)
    setFile(nextFile)
    setPreviewUrl(url)
    trackFileUpload('image-resizer', nextFile.size, nextFile.type)
    readDimensions(nextFile, url)
  }

  const applyScale = (scale: number) => {
    if (!sourceDimensions) return
    setOption({
      width: Math.max(1, Math.round(sourceDimensions.width * scale)),
      height: Math.max(1, Math.round(sourceDimensions.height * scale)),
    })
  }

  const handleResize = async () => {
    if (!file) return
    setIsResizing(true)
    setError(null)
    resetResult()

    try {
      trackToolAction('image-resizer', 'resize', {
        width: options.width,
        height: options.height,
        format: options.format,
        quality: options.quality,
        keep_aspect_ratio: options.keepAspectRatio,
      })
      const nextResult = await resizeImage(file, options)
      setResult(nextResult)
      setResultUrl(URL.createObjectURL(nextResult.blob))
      trackDownload('image-resizer', nextResult.filename, nextResult.size, options.format)
    } catch (error) {
      trackError('image-resizer', 'resize_failed', error instanceof Error ? error.message : String(error))
      setError(t('errors.resize'))
    } finally {
      setIsResizing(false)
    }
  }

  return (
    <ToolPageLayout
      toolId="image-resizer"
      eyebrow={t('ui.eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <Grid>
        <Controls>
          <div>
            <Label>{t('controls.image')}</Label>
            <FileInput
              aria-label={t('controls.image')}
              accept={accept}
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
            <p className="mt-2 font-mono text-xs text-faint">{t('controls.supported')}</p>
          </div>

          <div>
            <Label>{t('controls.size')}</Label>
            <div className="mb-2 flex flex-wrap gap-2">
              {IMAGE_RESIZER_SCALE_PRESETS.map((preset) => (
                <Chip
                  key={preset.label}
                  onClick={() => {
                    trackFeaturePreference('image-resizer', 'preset', preset.label)
                    applyScale(preset.scale)
                  }}
                  disabled={!sourceDimensions}
                  outline
                  active
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {preset.label}
                </Chip>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                aria-label="width"
                min={IMAGE_RESIZER_LIMITS.dimensionMin}
                max={IMAGE_RESIZER_LIMITS.dimensionMax}
                value={options.width}
                onChange={(event) => updateWidth(Number(event.target.value))}
                className="w-24"
              />
              <span className="font-mono text-sm text-faint">x</span>
              <Input
                type="number"
                aria-label="height"
                min={IMAGE_RESIZER_LIMITS.dimensionMin}
                max={IMAGE_RESIZER_LIMITS.dimensionMax}
                value={options.height}
                onChange={(event) => updateHeight(Number(event.target.value))}
                className="w-24"
              />
              <span className="font-mono text-sm text-faint">px</span>
            </div>
            <label className="mt-3 flex items-center gap-2 font-mono text-sm text-text-sub">
              <input
                type="checkbox"
                checked={options.keepAspectRatio}
                onChange={(event) => setOption({ keepAspectRatio: event.target.checked })}
              />
              {t('controls.keepAspectRatio')}
            </label>
          </div>

          <div>
            <Label>{t('controls.format')}</Label>
            <Select
              aria-label={t('controls.format')}
              value={options.format}
              onChange={(event) =>
                setOption({ format: event.target.value as ImageResizerOptions['format'] })
              }
              className="w-full"
            >
              {IMAGE_RESIZER_FORMAT_OPTIONS.map(({ value, key }) => (
                <option key={value} value={value}>
                  {t(`formats.${key}`)}
                </option>
              ))}
            </Select>
          </div>

          {options.format !== 'png' && (
            <div>
              <Label>{t('controls.quality', { quality: Math.round(options.quality * 100) })}</Label>
              <input
                type="range"
                aria-label={t('controls.quality', { quality: Math.round(options.quality * 100) })}
                min={IMAGE_RESIZER_LIMITS.qualityMin}
                max={IMAGE_RESIZER_LIMITS.qualityMax}
                step={0.05}
                value={options.quality}
                onChange={(event) => setOption({ quality: Number(event.target.value) })}
                className="w-full"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button onClick={handleResize} disabled={!file || isResizing}>
            {isResizing ? t('actions.resizing') : t('actions.resize')}
          </Button>
        </Controls>

        <div className="space-y-4">
          <Preview>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={file?.name || t('preview.alt')}
                className="max-h-96 max-w-full object-contain shadow-sm"
              />
            ) : (
              <p className="font-mono text-sm text-faint">{t('preview.empty')}</p>
            )}
          </Preview>
          <p className="mt-3 font-mono text-xs text-faint">
            {t('ui.captionAction')} · {options.width}x{options.height} · {commonT('noServerUpload')}
          </p>

          <StatGrid>
            <Stat
              label={t('stats.original')}
              value={
                sourceDimensions ? `${sourceDimensions.width}x${sourceDimensions.height}` : '-'
              }
            />
            <Stat
              label={t('stats.output')}
              value={result ? `${result.width}x${result.height}` : '-'}
            />
            <Stat label={t('stats.originalSize')} value={file ? formatBytes(file.size) : '-'} />
            <Stat label={t('stats.outputSize')} value={result ? formatBytes(result.size) : '-'} />
          </StatGrid>

          {result && resultUrl && (
            <a
              href={resultUrl}
              download={result.filename}
              className="block rounded-lg bg-text-main px-4 py-3 text-center font-mono text-sm font-semibold text-ink-deep transition-colors hover:bg-acid"
            >
              {t('actions.download')}
            </a>
          )}
        </div>
      </Grid>
    </ToolPageLayout>
  )
}
