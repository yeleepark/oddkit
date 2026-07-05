import GA4React from 'react-ga4'

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

interface EventParams {
  [key: string]: string | number | boolean
}

export function trackEvent(eventName: string, params?: EventParams) {
  if (!GOOGLE_ANALYTICS_ID || process.env.NODE_ENV !== 'production') return

  GA4React.event(eventName, params || {})
}

export function trackToolOpened(toolId: string, toolName: string) {
  trackEvent('tool_opened', {
    tool_id: toolId,
    tool_name: toolName,
  })
}

export function trackToolAction(
  toolId: string,
  action: string,
  params?: Record<string, string | number | boolean>
) {
  trackEvent('tool_action', {
    tool_id: toolId,
    action,
    ...params,
  })
}

export function trackDownload(
  toolId: string,
  fileName: string,
  fileSize?: number,
  format?: string
) {
  trackEvent('download', {
    tool_id: toolId,
    file_name: fileName,
    ...(fileSize && { file_size_bytes: fileSize }),
    ...(format && { format }),
  })
}

export function trackError(toolId: string, errorType: string, errorMessage?: string) {
  trackEvent('error', {
    tool_id: toolId,
    error_type: errorType,
    ...(errorMessage && { error_message: errorMessage }),
  })
}

export function trackFileUpload(toolId: string, fileSize: number, fileType: string) {
  trackEvent('file_upload', {
    tool_id: toolId,
    file_size_bytes: fileSize,
    file_type: fileType,
  })
}

export function trackFeaturePreference(
  toolId: string,
  feature: string,
  value: string | number | boolean
) {
  trackEvent('feature_preference', {
    tool_id: toolId,
    feature,
    value,
  })
}
