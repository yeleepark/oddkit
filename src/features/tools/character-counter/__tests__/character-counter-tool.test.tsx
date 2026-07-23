import { fireEvent, render, screen } from '@testing-library/react'
import CharacterCounterTool from '@/features/tools/character-counter/components/character-counter-tool'
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
  const result = render(<CharacterCounterTool />)
  await screen.findByRole('heading', { name: '글자수 세기' })
  return result
}

describe('CharacterCounterTool', () => {
  test('초기 화면: 입력이 비어 있으면 두 카운트 모두 0이다', async () => {
    await renderTool()

    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  test('입력하면 공백 포함/제외 글자 수가 실시간으로 갱신된다', async () => {
    await renderTool()

    const textarea = screen.getByRole('textbox', { name: '텍스트' })
    fireEvent.change(textarea, { target: { value: 'hello world' } })

    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  test('Clear 버튼은 입력이 비어 있으면 비활성화되고, 클릭하면 입력과 카운트를 초기화한다', async () => {
    await renderTool()

    const clearButton = screen.getByRole('button', { name: '지우기' })
    expect(clearButton).toBeDisabled()

    const textarea = screen.getByRole('textbox', { name: '텍스트' })
    fireEvent.change(textarea, { target: { value: 'test' } })
    expect(clearButton).not.toBeDisabled()

    fireEvent.click(clearButton)
    expect(textarea).toHaveValue('')
    expect(clearButton).toBeDisabled()
    expect(screen.getAllByText('0')).toHaveLength(2)
  })
})
