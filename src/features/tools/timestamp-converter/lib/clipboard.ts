/**
 * Copies text to the clipboard, preferring the async Clipboard API and
 * falling back to a hidden textarea + execCommand for older browsers or
 * insecure (non-HTTPS) contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to the legacy path below
    }
  }

  if (typeof document === 'undefined') {
    return false
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const succeeded = document.execCommand('copy')
    document.body.removeChild(textarea)
    return succeeded
  } catch {
    return false
  }
}
