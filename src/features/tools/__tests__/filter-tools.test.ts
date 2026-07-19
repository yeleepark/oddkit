import { filterTools } from '@/features/tools/lib/filter-tools'

const tools = [
  {
    title: 'Dummy Image Generator',
    description: 'Create placeholder images locally',
    tag: '#image · #placeholder',
    category: 'image',
  },
  {
    title: 'Color Converter',
    description: 'Convert HEX, RGB, HSL, and OKLCH',
    tag: '#color · #convert',
    category: 'color',
  },
  {
    title: 'JSON Formatter',
    description: 'Format, minify, and validate JSON',
    tag: '#dev · #json',
    category: 'dev',
  },
]

describe('filterTools', () => {
  test('returns every tool when the query is empty and category is "all"', () => {
    expect(filterTools(tools, { query: '', category: 'all' })).toEqual(tools)
  })

  test('matches by title, case-insensitively', () => {
    const result = filterTools(tools, { query: 'color CONVERTER', category: 'all' })
    expect(result.map((tool) => tool.title)).toEqual(['Color Converter'])
  })

  test('matches by description', () => {
    const result = filterTools(tools, { query: 'minify', category: 'all' })
    expect(result.map((tool) => tool.title)).toEqual(['JSON Formatter'])
  })

  test('matches by tag text', () => {
    const result = filterTools(tools, { query: 'placeholder', category: 'all' })
    expect(result.map((tool) => tool.title)).toEqual(['Dummy Image Generator'])
  })

  test('filters by category', () => {
    const result = filterTools(tools, { query: '', category: 'image' })
    expect(result.map((tool) => tool.title)).toEqual(['Dummy Image Generator'])
  })

  test('combines query and category with AND', () => {
    const result = filterTools(tools, { query: 'color', category: 'dev' })
    expect(result).toEqual([])
  })

  test('ignores leading and trailing whitespace in the query', () => {
    const result = filterTools(tools, { query: '  json  ', category: 'all' })
    expect(result.map((tool) => tool.title)).toEqual(['JSON Formatter'])
  })

  test('returns an empty array when nothing matches', () => {
    expect(filterTools(tools, { query: 'nonexistent tool', category: 'all' })).toEqual([])
  })
})
