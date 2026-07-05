'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { LOCALE_OPTIONS } from '@/config/locales'
import { useRouter, usePathname } from '@/i18n/navigation'

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3"
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

export default function LocaleSwitcher() {
  const locale = useLocale()
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const activeIndex = LOCALE_OPTIONS.findIndex(({ code }) => code === locale)
  const activeOption = LOCALE_OPTIONS[activeIndex] ?? LOCALE_OPTIONS[0]

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

    const activeItem = containerRef.current?.querySelector<HTMLElement>(`[data-code="${locale}"]`)
    activeItem?.focus()

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, locale])

  function selectLocale(code: string) {
    setIsOpen(false)
    buttonRef.current?.focus()
    if (code !== locale) {
      router.replace(pathname, { locale: code })
    }
  }

  function handleListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    const focusableIndex = LOCALE_OPTIONS.findIndex(
      ({ code }) => code === (document.activeElement as HTMLElement)?.dataset.code,
    )

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = focusableIndex < 0 ? 0 : (focusableIndex + 1) % LOCALE_OPTIONS.length
      const nextItem = containerRef.current?.querySelector<HTMLElement>(
        `[data-code="${LOCALE_OPTIONS[nextIndex].code}"]`,
      )
      nextItem?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex =
        focusableIndex <= 0 ? LOCALE_OPTIONS.length - 1 : focusableIndex - 1
      const prevItem = containerRef.current?.querySelector<HTMLElement>(
        `[data-code="${LOCALE_OPTIONS[prevIndex].code}"]`,
      )
      prevItem?.focus()
    }
  }

  return (
    <div ref={containerRef} className="relative inline-block font-mono text-xs">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('language')}
        className="flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-panel px-2 text-text-main outline-none transition-colors hover:border-acid/70 focus:border-acid"
      >
        <span>{activeOption.label}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t('language')}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="absolute right-0 z-20 mt-1 min-w-full overflow-hidden rounded-md border border-line-strong bg-panel py-1 shadow-lg"
        >
          {LOCALE_OPTIONS.map(({ code, label }) => {
            const isSelected = code === locale
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-code={code}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectLocale(code)}
                  className={`block w-full whitespace-nowrap px-3 py-1.5 text-left transition-colors hover:bg-line-strong/40 hover:text-acid focus:bg-line-strong/40 focus:text-acid focus:outline-none ${
                    isSelected ? 'text-acid' : 'text-text-main'
                  }`}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
