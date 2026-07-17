'use client'

import { useState } from 'react'
import { copyToClipboard } from '@/features/tools/timestamp-converter/lib/clipboard'

interface CopyableValueProps {
  label: string
  labelSlot?: React.ReactNode
  value: string | null
  emptyValue: string
  copyLabel: string
  copiedLabel: string
  onCopy?: () => void
}

/**
 * Labeled, monospaced value row with a copy-to-clipboard button. Used for
 * every generated timestamp/date value so results can be grabbed with one
 * click without leaving the page. labelSlot, when given, replaces the
 * plain label text (e.g. with a select) while label still drives the
 * copy button's accessible name.
 */
export default function CopyableValue({
  label,
  labelSlot,
  value,
  emptyValue,
  copyLabel,
  copiedLabel,
  onCopy,
}: CopyableValueProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!value) return
    const succeeded = await copyToClipboard(value)
    if (succeeded) {
      setCopied(true)
      onCopy?.()
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line p-3">
      <div className="min-w-0 flex-1">
        {labelSlot ?? <p className="truncate font-mono text-[10px] uppercase text-faint">{label}</p>}
        <p className="mt-1 truncate font-mono text-sm text-text-main">{value ?? emptyValue}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!value}
        aria-label={`${copyLabel}: ${label}`}
        className="shrink-0 rounded-md border border-line-strong px-2.5 py-1.5 font-mono text-xs text-text-sub transition-colors hover:border-acid hover:text-text-main disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}
