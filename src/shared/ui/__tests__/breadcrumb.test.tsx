import { fireEvent, render, screen } from '@testing-library/react'
import Breadcrumb from '@/shared/ui/Breadcrumb'

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

const items = [
  { id: 'a', label: 'Tool A', href: '/tools/a' },
  { id: 'b', label: 'Tool B', href: '/tools/b' },
  { id: 'c', label: 'Tool C', href: '/tools/c' },
]

describe('Breadcrumb', () => {
  test('루트 링크와 현재 항목 라벨을 보여주고, 드롭다운은 처음에는 닫혀 있다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />)

    expect(screen.getByRole('link', { name: '~/tools' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: /Tool B/ })).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('현재 세그먼트를 클릭하면 형제 항목이 모두 보이는 드롭다운이 열린다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />)

    fireEvent.click(screen.getByRole('button', { name: /Tool B/ }))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Tool A' })).toHaveAttribute('href', '/tools/a')
    expect(screen.getByRole('option', { name: 'Tool C' })).toHaveAttribute('href', '/tools/c')
  })

  test('현재 항목은 선택 표시되고 링크가 아니다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />)
    fireEvent.click(screen.getByRole('button', { name: /Tool B/ }))

    const currentOption = screen.getByRole('option', { name: 'Tool B' })
    expect(currentOption).toHaveAttribute('aria-selected', 'true')
    expect(currentOption.tagName).toBe('BUTTON')
  })

  test('현재 항목을 클릭하면 이동 없이 드롭다운만 닫힌다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />)
    fireEvent.click(screen.getByRole('button', { name: /Tool B/ }))
    fireEvent.click(screen.getByRole('option', { name: 'Tool B' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('다른 형제 항목을 클릭하면 드롭다운이 닫힌다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />)
    fireEvent.click(screen.getByRole('button', { name: /Tool B/ }))
    fireEvent.click(screen.getByRole('option', { name: 'Tool A' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('Escape를 누르면 닫히고 트리거에 포커스가 돌아간다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />)
    const trigger = screen.getByRole('button', { name: /Tool B/ })
    fireEvent.click(trigger)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  test('드롭다운 바깥을 클릭하면 닫힌다', () => {
    render(
      <div>
        <Breadcrumb rootLabel="~/tools" rootHref="/" items={items} currentId="b" />
        <button type="button">outside</button>
      </div>
    )
    fireEvent.click(screen.getByRole('button', { name: /Tool B/ }))
    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('items가 비어 있으면 루트 링크만 렌더링하고 트리거는 표시하지 않는다', () => {
    render(<Breadcrumb rootLabel="~/tools" rootHref="/" items={[]} currentId="b" />)

    expect(screen.getByRole('link', { name: '~/tools' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
