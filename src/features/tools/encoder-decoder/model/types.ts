export type CodecMode = 'url' | 'base64' | 'html'

export type CodecDirection = 'encode' | 'decode'

export type CodecErrorCode = 'invalidUrl' | 'invalidBase64' | 'invalidHtmlEntity' | 'generic'

export interface CodecModeOption {
  value: CodecMode
  key: string
}

export interface CodecDirectionOption {
  value: CodecDirection
  key: string
}
