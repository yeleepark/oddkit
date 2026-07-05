import { getTranslations } from 'next-intl/server'
import Container from '@/shared/ui/Container'
import PageHeader from '@/shared/ui/PageHeader'
import Breadcrumb from '@/shared/ui/Breadcrumb'
import { SITE_CONFIG } from '@/config/site'
import type { AppLocale } from '@/config/locales'

interface LegalSection {
  heading: string
  body: string[]
}

interface LegalPageProps {
  locale: AppLocale
  namespace: 'privacy' | 'terms'
}

function withContactEmail(text: string): string {
  return text.replaceAll('{email}', SITE_CONFIG.contactEmail)
}

export default async function LegalPage({ locale, namespace }: LegalPageProps) {
  const t = await getTranslations({ locale, namespace })
  const commonT = await getTranslations({ locale, namespace: 'common' })
  const privacyT = await getTranslations({ locale, namespace: 'privacy' })
  const termsT = await getTranslations({ locale, namespace: 'terms' })
  const sections = t.raw('sections') as LegalSection[]

  const items = [
    { id: 'privacy', label: privacyT('title'), href: '/privacy' },
    { id: 'terms', label: termsT('title'), href: '/terms' },
  ]

  return (
    <Container>
      <div className="py-7 sm:py-10">
        <Breadcrumb
          rootLabel={commonT('breadcrumb.root')}
          rootHref="/"
          items={items}
          currentId={namespace}
        />
        <PageHeader title={t('title')} description={t('updated')} />
        <div className="max-w-3xl space-y-8 text-[14.5px] leading-relaxed text-mist">
          <p>{t('intro')}</p>
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-2 text-base font-semibold text-text-main">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2">
                  {withContactEmail(paragraph)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
