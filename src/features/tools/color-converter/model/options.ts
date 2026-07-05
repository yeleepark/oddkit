import type { ColorFormatId } from '@/features/tools/color-converter/model/types'

export const COLOR_CONVERTER_FORMATS = [
  { id: 'hex', key: 'hex' },
  { id: 'rgb', key: 'rgb' },
  { id: 'hsl', key: 'hsl' },
  { id: 'oklch', key: 'oklch' },
] as const satisfies readonly { id: ColorFormatId; key: ColorFormatId }[]
