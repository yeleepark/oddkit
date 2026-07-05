'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import Container from '@/shared/ui/Container'
import PageHeader from '@/shared/ui/PageHeader'
import Breadcrumb from '@/shared/ui/Breadcrumb'
import { TOOL_CATALOG } from '@/features/tools/catalog'

interface ToolPageLayoutProps {
  children: ReactNode
  description: string
  eyebrow: string
  toolId: string
  title: string
}

export default function ToolPageLayout({
  children,
  description,
  eyebrow,
  toolId,
  title,
}: ToolPageLayoutProps) {
  const t = useTranslations()
  const commonT = useTranslations('common')

  const items = TOOL_CATALOG.filter((tool) => tool.enabled).map((tool) => ({
    id: tool.id,
    label: t(tool.titleKey),
    href: tool.href,
  }))

  return (
    <Container>
      <div className="py-7 sm:py-10">
        <Breadcrumb rootLabel={commonT('breadcrumb.root')} rootHref="/" items={items} currentId={toolId} />
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </Container>
  )
}
