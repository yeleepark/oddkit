'use client'

import { useState } from 'react'
import ToolCard from '@/shared/ui/ToolCard'
import Input from '@/shared/ui/Input'
import Chip from '@/shared/ui/Chip'
import { TOOL_CATEGORIES } from '@/features/tools/catalog'
import type { ToolCategory, ToolCategoryFilter } from '@/features/tools/catalog'
import { filterTools } from '@/features/tools/lib/filter-tools'
import { getToolCardRounding } from '@/features/tools/lib/tool-card-rounding'

export interface ToolCatalogBrowserTool {
  id: string
  num: string
  tag: string
  category: ToolCategory
  href: string
  title: string
  description: string
}

export interface ToolCatalogBrowserLabels {
  searchPlaceholder: string
  searchAriaLabel: string
  categoryLabels: Record<ToolCategoryFilter, string>
  noResultsTitle: string
  noResultsReset: string
}

interface ToolCatalogBrowserProps {
  tools: ToolCatalogBrowserTool[]
  labels: ToolCatalogBrowserLabels
}

const CATEGORY_TABS: ToolCategoryFilter[] = ['all', ...TOOL_CATEGORIES]

export default function ToolCatalogBrowser({ tools, labels }: ToolCatalogBrowserProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ToolCategoryFilter>('all')

  const filtered = filterTools(tools, { query, category })

  const resetFilters = () => {
    setQuery('')
    setCategory('all')
  }

  return (
    <div className="mb-14">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchAriaLabel}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <Chip key={tab} active={category === tab} onClick={() => setCategory(tab)}>
              {tab === 'all' ? labels.categoryLabels.all : `#${labels.categoryLabels[tab]}`}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-[14px] border border-line bg-panel px-6 py-16 text-center"
          style={{ boxShadow: 'var(--theme-shadow)' }}
        >
          <p className="text-sm text-mist">{labels.noResultsTitle}</p>
          <Chip outline onClick={resetFilters} className="mt-4">
            {labels.noResultsReset}
          </Chip>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2"
          style={{ boxShadow: 'var(--theme-shadow)' }}
        >
          {filtered.map(({ description, href, id, num, tag, title }, index) => (
            <ToolCard
              key={id}
              title={title}
              description={description}
              href={href}
              num={num}
              tag={tag}
              roundedClassName={getToolCardRounding(index, filtered.length)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
