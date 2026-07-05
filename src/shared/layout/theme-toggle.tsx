'use client'

import { useEffect, useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'oddkit-theme'
const THEME_EVENT = 'oddkit-theme-change'

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'dark' || value === 'light'
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (isTheme(storedTheme)) return storedTheme

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  window.dispatchEvent(new Event(THEME_EVENT))
}

function getThemeSnapshot(): Theme {
  if (typeof document === 'undefined') return 'dark'

  const activeTheme = document.documentElement.dataset.theme
  if (isTheme(activeTheme)) return activeTheme

  return getPreferredTheme()
}

function subscribeThemeChange(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange)
  return () => window.removeEventListener(THEME_EVENT, onChange)
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribeThemeChange, getThemeSnapshot, () => 'dark')

  useEffect(() => {
    if (!isTheme(document.documentElement.dataset.theme)) {
      applyTheme(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme)
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-strong bg-panel font-mono text-xs text-text-main transition-colors hover:border-acid/70 hover:text-acid"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
