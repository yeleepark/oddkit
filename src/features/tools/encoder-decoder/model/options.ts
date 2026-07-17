import type { CodecDirectionOption, CodecModeOption } from '@/features/tools/encoder-decoder/model/types'

export const ENCODER_DECODER_MODE_OPTIONS: CodecModeOption[] = [
  { value: 'url', key: 'url' },
  { value: 'base64', key: 'base64' },
  { value: 'html', key: 'html' },
]

export const ENCODER_DECODER_DIRECTION_OPTIONS: CodecDirectionOption[] = [
  { value: 'encode', key: 'encode' },
  { value: 'decode', key: 'decode' },
]
