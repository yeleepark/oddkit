'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'

export interface BreadcrumbItem {
  id: string
  label: string
  href: string
}

interface BreadcrumbProps {
  rootLabel: string
  rootHref: string
  items: BreadcrumbItem[]
  currentId: string
}

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

export default function Breadcrumb({ rootLabel, rootHref, items, currentId }: BreadcrumbProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const currentItem = items.find((item) => item.id === currentId) ?? items[0]

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

  function closeMenu() {
    setIsOpen(false)
  }

  if (items.length === 0) {
    return (
      <div className="relative mb-7 inline-flex items-center font-mono text-xs text-mist">
        <Link href={rootHref} className="transition-colors hover:text-acid">
          {rootLabel}
        </Link>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative mb-7 inline-flex items-center font-mono text-xs text-mist"
    >
      <Link href={rootHref} className="transition-colors hover:text-acid">
        {rootLabel}
      </Link>
      <span className="mx-2 text-faint">/</span>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1 text-text-main outline-none transition-colors hover:text-acid focus:text-acid"
      >
        <span>{currentItem.label}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={currentItem.label}
          className="absolute left-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-md border border-line-strong bg-panel py-1 shadow-lg"
        >
          {items.map((item) => {
            const isSelected = item.id === currentId
            return (
              <li key={item.id} role="presentation">
                {isSelected ? (
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={closeMenu}
                    className="block w-full whitespace-nowrap px-3 py-1.5 text-left text-text-main transition-colors hover:bg-line-strong/40 hover:text-acid focus:bg-line-strong/40 focus:text-acid focus:outline-none text-acid"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    role="option"
                    aria-selected={isSelected}
                    onClick={closeMenu}
                    className="block w-full whitespace-nowrap px-3 py-1.5 text-left text-text-main transition-colors hover:bg-line-strong/40 hover:text-acid focus:bg-line-strong/40 focus:text-acid focus:outline-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
