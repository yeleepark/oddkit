'use client'

import { useTranslations } from 'next-intl'
import OptionButton from '@/features/tools/dummy-image/components/option-button'
import Label from '@/shared/ui/Label'
import Chip from '@/shared/ui/Chip'
import Input from '@/shared/ui/Input'
import { DUMMY_IMAGE_FONT_SIZE_LIMITS, DUMMY_IMAGE_SIZE_LIMITS } from '@/features/tools/dummy-image/model/config'
import {
  DUMMY_IMAGE_PRESETS,
  GRADIENT_DIRECTION_OPTIONS,
  IMAGE_FORMATS,
  IMAGE_TYPE_OPTIONS,
  PATTERN_STYLE_OPTIONS,
} from '@/features/tools/dummy-image/model/options'
import type { DummyImageConfig } from '@/features/tools/dummy-image/model/types'

interface ControlsProps {
  config: DummyImageConfig
  onChange: (config: DummyImageConfig) => void
}

export default function Controls({ config, onChange }: ControlsProps) {
  const t = useTranslations('dummyImage.controls')
  const set = (partial: Partial<DummyImageConfig>) => onChange({ ...config, ...partial })
  const setDimension = (field: 'height' | 'width', value: number) => {
    set({ [field]: Math.max(DUMMY_IMAGE_SIZE_LIMITS.min, value) })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>{t('type')}</Label>
        <div className="flex gap-2">
          {IMAGE_TYPE_OPTIONS.map(({ value, key }) => (
            <OptionButton
              key={value}
              active={config.type === value}
              onSelect={(type) => set({ type })}
              value={value}
            >
              {t(key)}
            </OptionButton>
          ))}
        </div>
      </div>

      <div>
        <Label>{t('size')}</Label>
        <div className="flex gap-2 mb-2">
          {DUMMY_IMAGE_PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              type="button"
              onClick={() => set({ width: preset.width, height: preset.height })}
              outline
              active
            >
              {preset.label}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={config.width}
            min={DUMMY_IMAGE_SIZE_LIMITS.min}
            max={DUMMY_IMAGE_SIZE_LIMITS.max}
            onChange={(e) => setDimension('width', Number(e.target.value))}
            className="w-24"
          />
          <span className="font-mono text-sm text-faint">x</span>
          <Input
            type="number"
            value={config.height}
            min={DUMMY_IMAGE_SIZE_LIMITS.min}
            max={DUMMY_IMAGE_SIZE_LIMITS.max}
            onChange={(e) => setDimension('height', Number(e.target.value))}
            className="w-24"
          />
          <span className="font-mono text-sm text-faint">px</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <Label>
            {config.type === 'gradient' ? t('startColor') : config.type === 'pattern' ? t('fgColor') : t('bgColor')}
          </Label>
          <input
            type="color"
            value={config.primaryColor}
            onChange={(e) => set({ primaryColor: e.target.value })}
            className="h-9 w-16 cursor-pointer rounded-md border border-line-strong bg-panel"
          />
        </div>
        {(config.type === 'gradient' || config.type === 'pattern') && (
          <div>
            <Label>
              {config.type === 'gradient' ? t('endColor') : t('bgColor')}
            </Label>
            <input
              type="color"
              value={config.secondaryColor}
              onChange={(e) => set({ secondaryColor: e.target.value })}
              className="h-9 w-16 cursor-pointer rounded-md border border-line-strong bg-panel"
            />
          </div>
        )}
      </div>

      {config.type === 'gradient' && (
        <div>
          <Label>{t('direction')}</Label>
          <div className="flex gap-2">
            {GRADIENT_DIRECTION_OPTIONS.map(({ value, key }) => (
              <OptionButton
                key={value}
                active={config.gradientDirection === value}
                onSelect={(gradientDirection) => set({ gradientDirection })}
                value={value}
              >
                {t(key)}
              </OptionButton>
            ))}
          </div>
        </div>
      )}

      {config.type === 'pattern' && (
        <div>
          <Label>{t('patternStyle')}</Label>
          <div className="flex gap-2">
            {PATTERN_STYLE_OPTIONS.map(({ value, key }) => (
              <OptionButton
                key={value}
                active={config.patternStyle === value}
                onSelect={(patternStyle) => set({ patternStyle })}
                value={value}
              >
                {t(key)}
              </OptionButton>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>{t('text')}</Label>
        <Input
          type="text"
          value={config.text}
          placeholder={`${config.width}x${config.height}`}
          onChange={(e) => set({ text: e.target.value })}
          className="w-full"
        />
      </div>

      <div>
        <Label>
          {t('fontSize', { size: config.fontSize })}
        </Label>
        <input
          type="range"
          min={DUMMY_IMAGE_FONT_SIZE_LIMITS.min}
          max={DUMMY_IMAGE_FONT_SIZE_LIMITS.max}
          value={config.fontSize}
          onChange={(e) => set({ fontSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <Label>{t('format')}</Label>
        <div className="flex flex-wrap gap-2">
          {IMAGE_FORMATS.map((format) => (
            <OptionButton
              key={format}
              active={config.format === format}
              className="uppercase"
              onSelect={(selectedFormat) => set({ format: selectedFormat })}
              value={format}
            >
              {format}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  )
}
