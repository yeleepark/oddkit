import { fireEvent, render, screen } from '@testing-library/react'
import ThemeToggle from '@/shared/layout/theme-toggle'

function mockColorScheme(prefersLight: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: prefersLight && query === '(prefers-color-scheme: light)',
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockColorScheme(false)
  })

  test('저장된 테마가 없으면 시스템 선호도에 따라 라이트 모드를 적용한다', async () => {
    mockColorScheme(true)

    render(<ThemeToggle />)

    expect(await screen.findByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  test('저장된 다크 테마가 있으면 시스템 선호도보다 저장값을 우선 적용한다', async () => {
    mockColorScheme(true)
    window.localStorage.setItem('oddkit-theme', 'dark')

    render(<ThemeToggle />)

    expect(await screen.findByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  test('토글을 클릭하면 라이트 모드로 전환하고 선택값을 저장한다', async () => {
    render(<ThemeToggle />)

    fireEvent.click(await screen.findByRole('button', { name: 'Switch to light mode' }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(window.localStorage.getItem('oddkit-theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
  })
})
