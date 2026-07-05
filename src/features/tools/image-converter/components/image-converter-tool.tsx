'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { convertImage } from '@/features/tools/image-converter/lib/converter'
import {
  DEFAULT_IMAGE_CONVERTER_OPTIONS,
  IMAGE_CONVERTER_LIMITS,
} from '@/features/tools/image-converter/model/config'
import {
  IMAGE_CONVERTER_ACCEPTED_TYPES,
  IMAGE_CONVERTER_FORMAT_OPTIONS,
} from '@/features/tools/image-converter/model/options'
import type {
  ImageConverterOptions,
  ImageConverterResult,
} from '@/features/tools/image-converter/model/types'
import { formatBytes } from '@/features/tools/image-compressor/lib/file'
import ToolPageLayout from '@/shared/ui/ToolPageLayout'
import Grid from '@/shared/ui/Grid'
import Controls from '@/shared/ui/Controls'
import Label from '@/shared/ui/Label'
import FileInput from '@/shared/ui/FileInput'
import Select from '@/shared/ui/Select'
import Button from '@/shared/ui/Button'
import Preview from '@/shared/ui/Preview'
import Stat from '@/shared/ui/Stat'
import StatGrid from '@/shared/ui/StatGrid'
import { trackToolAction, trackDownload, trackError, trackFileUpload } from '@/shared/analytics'

export default function ImageConverterTool() {
  const t = useTranslations('imageConverter')
  const commonT = useTranslations('common')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [result, setResult] = useState<ImageConverterResult | null>(null)
  const [options, setOptions] = useState<ImageConverterOptions>(DEFAULT_IMAGE_CONVERTER_OPTIONS)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = useMemo(() => IMAGE_CONVERTER_ACCEPTED_TYPES.join(','), [])

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

  const setOption = (partial: Partial<ImageConverterOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    resetResult()
  }

  const handleFileChange = (nextFile: File | null) => {
    setError(null)
    resetResult()
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!IMAGE_CONVERTER_ACCEPTED_TYPES.includes(nextFile.type as never)) {
      setFile(null)
      setError(t('errors.unsupported'))
      trackError('image-converter', 'unsupported_format', nextFile.type)
      return
    }

    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
    trackFileUpload('image-converter', nextFile.size, nextFile.type)
  }

  const handleConvert = async () => {
    if (!file) return
    setIsConverting(true)
    setError(null)
    resetResult()

    try {
      trackToolAction('image-converter', 'convert', {
        input_format: file.type,
        output_format: options.format,
        quality: options.quality,
      })
      const nextResult = await convertImage(file, options)
      setResult(nextResult)
      setResultUrl(URL.createObjectURL(nextResult.blob))
      trackDownload('image-converter', nextResult.filename, nextResult.size, options.format)
    } catch (error) {
      trackError('image-converter', 'convert_failed', error instanceof Error ? error.message : String(error))
      setError(t('errors.convert'))
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <ToolPageLayout
      toolId="image-converter"
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
            <Label>{t('controls.format')}</Label>
            <Select
              aria-label={t('controls.format')}
              value={options.format}
              onChange={(event) =>
                setOption({ format: event.target.value as ImageConverterOptions['format'] })
              }
              className="w-full"
            >
              {IMAGE_CONVERTER_FORMAT_OPTIONS.map(({ value, key }) => (
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
                min={IMAGE_CONVERTER_LIMITS.qualityMin}
                max={IMAGE_CONVERTER_LIMITS.qualityMax}
                step={0.05}
                value={options.quality}
                onChange={(event) => setOption({ quality: Number(event.target.value) })}
                className="w-full"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button onClick={handleConvert} disabled={!file || isConverting}>
            {isConverting ? t('actions.converting') : t('actions.convert')}
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
            <Stat label={t('stats.output')} value={result ? formatBytes(result.size) : '-'} />
            <Stat
              label={t('stats.format')}
              value={result ? result.type.replace('image/', '').toUpperCase() : '-'}
            />
            <Stat
              label={t('stats.dimensions')}
              value={result ? `${result.width}x${result.height}` : '-'}
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
