import { SITE_CONFIG } from '@/config/site'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function Footer() {
  const t = await getTranslations('common')

  return (
    <footer className="mt-auto border-t border-line px-6 py-3 sm:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-xs text-faint">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{t('footer', { name: SITE_CONFIG.name })}</span>
          <span aria-hidden="true">·</span>
          <span>{t('copyright', { year: new Date().getFullYear(), name: SITE_CONFIG.name })}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/privacy" className="text-text-main transition-colors hover:text-acid">
            {t('legal.privacy')}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="text-text-main transition-colors hover:text-acid">
            {t('legal.terms')}
          </Link>
          <span aria-hidden="true">·</span>
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="text-text-main transition-colors hover:text-acid"
          >
            {t('contact')}
          </a>
        </div>
      </div>
    </footer>
  )
}
