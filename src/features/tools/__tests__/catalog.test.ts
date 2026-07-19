import { TOOL_CATALOG, TOOL_CATEGORIES } from '@/features/tools/catalog'

describe('TOOL_CATALOG', () => {
  test('every entry has a category that is one of TOOL_CATEGORIES', () => {
    for (const tool of TOOL_CATALOG) {
      expect(TOOL_CATEGORIES).toContain(tool.category)
    }
  })

  test('every entry has a unique id and num', () => {
    const ids = TOOL_CATALOG.map((tool) => tool.id)
    const nums = TOOL_CATALOG.map((tool) => tool.num)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(nums).size).toBe(nums.length)
  })
})
