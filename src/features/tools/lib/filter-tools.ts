import type { ToolCategoryFilter } from '@/features/tools/catalog'

export interface FilterableTool {
  title: string
  description: string
  tag: string
  category: string
}

export interface ToolFilter {
  query: string
  category: ToolCategoryFilter
}

/**
 * Filters a list of already-localized tools by a free-text query and category.
 *
 * @param {T[]} tools - Tools with localized title/description/tag text.
 * @param {ToolFilter} filter - Search query and selected category.
 * @returns {T[]} Tools matching both the query and category (AND).
 */
export function filterTools<T extends FilterableTool>(tools: T[], { query, category }: ToolFilter): T[] {
  const normalizedQuery = query.trim().toLowerCase()

  return tools.filter((tool) => {
    if (category !== 'all' && tool.category !== category) return false
    if (!normalizedQuery) return true

    return (
      tool.title.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.tag.toLowerCase().includes(normalizedQuery)
    )
  })
}
