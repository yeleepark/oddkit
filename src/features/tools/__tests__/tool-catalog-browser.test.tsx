import { fireEvent, render, screen } from '@testing-library/react'
import ToolCatalogBrowser from '@/features/tools/components/tool-catalog-browser'

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

const tools = [
  {
    id: 'dummy-image',
    num: '01',
    tag: '#image · #placeholder',
    category: 'image' as const,
    href: '/tools/dummy-image',
    title: 'Dummy Image Generator',
    description: 'Create placeholder images',
  },
  {
    id: 'color-converter',
    num: '05',
    tag: '#color · #convert',
    category: 'color' as const,
    href: '/tools/color-converter',
    title: 'Color Converter',
    description: 'Convert HEX, RGB, HSL, and OKLCH',
  },
  {
    id: 'json-formatter',
    num: '07',
    tag: '#dev · #json',
    category: 'dev' as const,
    href: '/tools/json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON',
  },
]

const labels = {
  searchPlaceholder: 'Search tools...',
  searchAriaLabel: 'Search tools',
  categoryLabels: {
    all: 'All',
    image: 'Image',
    color: 'Color',
    text: 'Text',
    dev: 'Dev',
  },
  noResultsTitle: 'No tools found',
  noResultsReset: 'Reset filters',
}

describe('ToolCatalogBrowser', () => {
  test('renders every tool by default', () => {
    render(<ToolCatalogBrowser tools={tools} labels={labels} />)

    expect(screen.getByRole('heading', { name: /Dummy Image Generator/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Color Converter/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /JSON Formatter/ })).toBeInTheDocument()
  })

  test('filters by search query across title, description, and tag', () => {
    render(<ToolCatalogBrowser tools={tools} labels={labels} />)

    fireEvent.change(screen.getByRole('searchbox', { name: labels.searchAriaLabel }), {
      target: { value: 'json' },
    })

    expect(screen.getByRole('heading', { name: /JSON Formatter/ })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Dummy Image Generator/ })
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Color Converter/ })).not.toBeInTheDocument()
  })

  test('filters by category', () => {
    render(<ToolCatalogBrowser tools={tools} labels={labels} />)

    fireEvent.click(screen.getByRole('button', { name: '#Image' }))

    expect(screen.getByRole('heading', { name: /Dummy Image Generator/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Color Converter/ })).not.toBeInTheDocument()
  })

  test('combines search and category with AND', () => {
    render(<ToolCatalogBrowser tools={tools} labels={labels} />)

    fireEvent.click(screen.getByRole('button', { name: '#Dev' }))
    fireEvent.change(screen.getByRole('searchbox', { name: labels.searchAriaLabel }), {
      target: { value: 'color' },
    })

    expect(screen.getByText(labels.noResultsTitle)).toBeInTheDocument()
  })

  test('reset button in the empty state clears the query and category', () => {
    render(<ToolCatalogBrowser tools={tools} labels={labels} />)

    fireEvent.change(screen.getByRole('searchbox', { name: labels.searchAriaLabel }), {
      target: { value: 'nonexistent tool' },
    })
    expect(screen.getByText(labels.noResultsTitle)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: labels.noResultsReset }))

    expect(screen.getByRole('heading', { name: /Dummy Image Generator/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Color Converter/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /JSON Formatter/ })).toBeInTheDocument()
  })
})
