/**
 * Copies text to the clipboard using the async Clipboard API when available,
 * falling back to a hidden textarea + execCommand for older browsers.
 * Returns true on success, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to legacy fallback
    }
  }

  if (typeof document === 'undefined') return false

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const succeeded = document.execCommand('copy')
    document.body.removeChild(textarea)
    return succeeded
  } catch {
    return false
  }
}
