import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ColorConverterTool from '@/features/tools/color-converter/components/color-converter-tool'
import mockKoMessages from '@/messages/ko.json'

jest.mock('next-intl', () => {
  const readMessage = (path: string) =>
    path.split('.').reduce<unknown>((current, segment) => {
      if (!current || typeof current !== 'object') return undefined
      return (current as Record<string, unknown>)[segment]
    }, mockKoMessages)

  const interpolate = (message: string, values?: Record<string, string | number>) => {
    if (!values) return message
    return Object.entries(values).reduce(
      (current, [key, value]) => current.replaceAll(`{${key}}`, String(value)),
      message
    )
  }

  return {
    useTranslations: (namespace?: string) => {
      const translate = (key: string, values?: Record<string, string | number>) => {
        const path = namespace ? `${namespace}.${key}` : key
        const message = readMessage(path)
        if (typeof message !== 'string') throw new Error(`Missing mock translation: ${path}`)
        return interpolate(message, values)
      }
      translate.raw = (key: string) => readMessage(namespace ? `${namespace}.${key}` : key)
      return translate
    },
  }
})

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

async function renderTool() {
  const result = render(<ColorConverterTool />)
  await screen.findByRole('heading', { name: '컬러 변환기' })
  return result
}

describe('ColorConverterTool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    })
  })

  test('초기 화면: 기본 색상의 HEX/RGB/HSL/OKLCH 값을 보여준다', async () => {
    await renderTool()

    expect(screen.getByDisplayValue('#7c5cff')).toBeInTheDocument()
    expect(screen.getByText('#7c5cff')).toBeInTheDocument()
    expect(screen.getByText('rgb(124 92 255)')).toBeInTheDocument()
  })

  test('유효한 색상 입력: RGB 값을 입력하면 HEX/HSL/OKLCH가 함께 갱신된다', async () => {
    await renderTool()

    fireEvent.change(screen.getByLabelText('색상 입력'), {
      target: { value: 'rgb(255, 0, 0)' },
    })

    await waitFor(() => {
      expect(screen.getByText('#ff0000')).toBeInTheDocument()
    })
    expect(screen.getByText('hsl(0 100% 50%)')).toBeInTheDocument()
  })

  test('잘못된 입력: 파싱할 수 없는 값은 오류 메시지를 보여주고 앱이 멈추지 않는다', async () => {
    await renderTool()

    fireEvent.change(screen.getByLabelText('색상 입력'), {
      target: { value: 'not-a-color' },
    })

    expect(await screen.findByText('올바른 HEX, RGB, HSL, OKLCH 색상 값을 입력하세요.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '컬러 변환기' })).toBeInTheDocument()
  })

  test('복사 버튼: 클릭하면 클립보드에 값이 복사되고 안내 문구가 바뀐다', async () => {
    await renderTool()

    const copyButtons = screen.getAllByRole('button', { name: '복사' })
    fireEvent.click(copyButtons[0])

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#7c5cff')
    })
    expect(await screen.findByText('복사됨')).toBeInTheDocument()
  })
})
