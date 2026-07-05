'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { compressImage } from '@/features/tools/image-compressor/lib/compressor'
import {
  formatBytes,
  getCompressionRatio,
  getTargetSizeBytes,
} from '@/features/tools/image-compressor/lib/file'
import {
  DEFAULT_IMAGE_COMPRESSOR_OPTIONS,
  IMAGE_COMPRESSOR_LIMITS,
} from '@/features/tools/image-compressor/model/config'
import {
  IMAGE_COMPRESSOR_ACCEPTED_TYPES,
  IMAGE_COMPRESSOR_FORMAT_OPTIONS,
} from '@/features/tools/image-compressor/model/options'
import type {
  ImageCompressorOptions,
  ImageCompressorResult,
} from '@/features/tools/image-compressor/model/types'
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

export default function ImageCompressorTool() {
  const t = useTranslations('imageCompressor')
  const commonT = useTranslations('common')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [result, setResult] = useState<ImageCompressorResult | null>(null)
  const [options, setOptions] = useState<ImageCompressorOptions>(DEFAULT_IMAGE_COMPRESSOR_OPTIONS)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = useMemo(() => IMAGE_COMPRESSOR_ACCEPTED_TYPES.join(','), [])
  const savings = result ? getCompressionRatio(result.originalSize, result.size) : 0
  const targetBytes = getTargetSizeBytes(options.targetSize, options.targetUnit)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [previewUrl, resultUrl])

  const setOption = (partial: Partial<ImageCompressorOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setResult(null)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
  }

  const handleFileChange = (nextFile: File | null) => {
    setError(null)
    setResult(null)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!IMAGE_COMPRESSOR_ACCEPTED_TYPES.includes(nextFile.type as never)) {
      setFile(null)
      setError(t('errors.unsupported'))
      return
    }

    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
  }

  const handleCompress = async () => {
    if (!file) return

    setIsCompressing(true)
    setError(null)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }

    try {
      const nextResult = await compressImage(file, options)
      setResult(nextResult)
      setResultUrl(URL.createObjectURL(nextResult.blob))
    } catch {
      setError(t('errors.compress'))
    } finally {
      setIsCompressing(false)
    }
  }

  return (
    <ToolPageLayout
      toolId="image-compressor"
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
            <Label>{t('controls.mode')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Chip
                active={options.mode === 'manual'}
                onClick={() => setOption({ mode: 'manual' })}
              >
                {t('modes.manual')}
              </Chip>
              <Chip
                active={options.mode === 'target'}
                onClick={() =>
                  setOption({
                    mode: 'target',
                    format: options.format === 'png' ? 'webp' : options.format,
                  })
                }
              >
                {t('modes.target')}
              </Chip>
            </div>
          </div>

          {options.mode === 'target' && (
            <div>
              <Label>{t('controls.targetSize')}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  aria-label={t('controls.targetSize')}
                  min={IMAGE_COMPRESSOR_LIMITS.targetSizeMinKb}
                  max={
                    options.targetUnit === 'mb'
                      ? IMAGE_COMPRESSOR_LIMITS.targetSizeMaxMb
                      : IMAGE_COMPRESSOR_LIMITS.targetSizeMaxMb * 1024
                  }
                  value={options.targetSize}
                  onChange={(event) =>
                    setOption({ targetSize: Math.max(1, Number(event.target.value)) })
                  }
                  className="w-full"
                />
                <Select
                  aria-label="target unit"
                  value={options.targetUnit}
                  onChange={(event) =>
                    setOption({
                      targetUnit: event.target.value as ImageCompressorOptions['targetUnit'],
                    })
                  }
                >
                  <option value="kb">KB</option>
                  <option value="mb">MB</option>
                </Select>
              </div>
              <p className="mt-2 font-mono text-xs text-faint">
                {t('controls.targetHint', { size: formatBytes(targetBytes) })}
              </p>
            </div>
          )}

          {options.mode === 'manual' && (
            <div>
              <Label>{t('controls.quality', { quality: Math.round(options.quality * 100) })}</Label>
              <input
                type="range"
                aria-label={t('controls.quality', { quality: Math.round(options.quality * 100) })}
                min={IMAGE_COMPRESSOR_LIMITS.qualityMin}
                max={IMAGE_COMPRESSOR_LIMITS.qualityMax}
                step={0.05}
                value={options.quality}
                onChange={(event) => setOption({ quality: Number(event.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div>
            <Label>{t('controls.maxSize')}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                aria-label="max width"
                min={IMAGE_COMPRESSOR_LIMITS.dimensionMin}
                max={IMAGE_COMPRESSOR_LIMITS.dimensionMax}
                value={options.maxWidth}
                onChange={(event) =>
                  setOption({ maxWidth: Math.max(1, Number(event.target.value)) })
                }
                className="w-24"
              />
              <span className="font-mono text-sm text-faint">x</span>
              <Input
                type="number"
                aria-label="max height"
                min={IMAGE_COMPRESSOR_LIMITS.dimensionMin}
                max={IMAGE_COMPRESSOR_LIMITS.dimensionMax}
                value={options.maxHeight}
                onChange={(event) =>
                  setOption({ maxHeight: Math.max(1, Number(event.target.value)) })
                }
                className="w-24"
              />
              <span className="font-mono text-sm text-faint">px</span>
            </div>
          </div>

          <div>
            <Label>{t('controls.format')}</Label>
            <Select
              aria-label={t('controls.format')}
              value={options.format}
              onChange={(event) =>
                setOption({ format: event.target.value as ImageCompressorOptions['format'] })
              }
              className="w-full"
            >
              {IMAGE_COMPRESSOR_FORMAT_OPTIONS.map(({ value, key }) => (
                <option key={value} value={value}>
                  {t(`formats.${key}`)}
                </option>
              ))}
            </Select>
          </div>
          {options.mode === 'target' && options.format === 'png' && (
            <p className="text-xs text-acid">{t('controls.pngTargetWarning')}</p>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button onClick={handleCompress} disabled={!file || isCompressing}>
            {isCompressing ? t('actions.compressing') : t('actions.compress')}
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
            {t('ui.captionAction')} · {options.format} · {commonT('noServerUpload')}
          </p>

          <StatGrid>
            <Stat label={t('stats.original')} value={file ? formatBytes(file.size) : '-'} />
            <Stat label={t('stats.compressed')} value={result ? formatBytes(result.size) : '-'} />
            <Stat label={t('stats.saved')} value={result ? `${savings}%` : '-'} />
            <Stat
              label={t('stats.output')}
              value={result ? `${result.width}x${result.height}` : '-'}
            />
            <Stat
              label={t('stats.quality')}
              value={result ? `${Math.round(result.quality * 100)}%` : '-'}
            />
            <Stat
              label={t('stats.target')}
              value={
                result
                  ? result.targetReached
                    ? t('stats.targetReached')
                    : t('stats.targetMissed')
                  : '-'
              }
              className={result?.targetReached === false ? 'text-acid' : ''}
            />
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
