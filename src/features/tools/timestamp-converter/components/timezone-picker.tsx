'use client'

import { useEffect, useRef, useState } from 'react'

interface TimeZonePickerProps {
  zones: string[]
  value: string
  onChange: (zone: string) => void
  placeholder: string
  ariaLabel: string
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * Click-to-open timezone picker. The row's title itself is the trigger —
 * clicking it reveals a listbox of IANA zones instead of using a native
 * select, so it visually matches the plain-label title style of the other
 * result rows above it.
 */
export default function TimeZonePicker({
  zones,
  value,
  onChange,
  placeholder,
  ariaLabel,
}: TimeZonePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function selectZone(zone: string) {
    onChange(zone)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="flex w-full items-center gap-1 truncate font-mono text-[10px] uppercase text-faint transition-colors hover:text-acid"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-full z-20 mt-2 max-h-60 min-w-[240px] overflow-auto rounded-md border border-line-strong bg-panel py-1 normal-case shadow-lg"
          style={{ boxShadow: 'var(--theme-shadow)' }}
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === ''}
              onClick={() => selectZone('')}
              className={`block w-full whitespace-nowrap px-3 py-1.5 text-left font-mono text-xs transition-colors hover:bg-line-strong/40 hover:text-acid focus:bg-line-strong/40 focus:text-acid focus:outline-none ${
                value === '' ? 'text-acid' : 'text-text-main'
              }`}
            >
              {placeholder}
            </button>
          </li>
          {zones.map((zone) => (
            <li key={zone} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === zone}
                onClick={() => selectZone(zone)}
                className={`block w-full whitespace-nowrap px-3 py-1.5 text-left font-mono text-xs transition-colors hover:bg-line-strong/40 hover:text-acid focus:bg-line-strong/40 focus:text-acid focus:outline-none ${
                  value === zone ? 'text-acid' : 'text-text-main'
                }`}
              >
                {zone}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
