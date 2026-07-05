import { Link } from '@/i18n/navigation'

interface ToolCardProps {
  title: string
  description: string
  href: string
  num: string
  tag: string
  roundedClassName?: string
}

export default function ToolCard({
  title,
  description,
  href,
  num,
  tag,
  roundedClassName,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`group block bg-ink p-7 transition-colors hover:bg-acid-hover hover:outline hover:outline-1 hover:-outline-offset-1 hover:outline-acid/50 ${roundedClassName ?? ''}`}
    >
      <div className="flex items-start justify-between font-mono text-xs">
        <span className="text-faint group-hover:text-acid">{num}</span>
        <span className="text-acid group-hover:hidden">·</span>
        <span className="terminal-glow hidden text-acid group-hover:inline">→ run</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-text-main">
        <span aria-hidden="true" className="font-mono text-faint group-hover:text-acid">
          ./
        </span>
        {title}
      </h2>
      <p className="mt-2 max-w-md text-[13.5px] text-mist">{description}</p>
      <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-faint">
        <span>{tag}</span>
        <span aria-hidden="true" className="group-hover:text-acid">
          -rwxr-xr-x
        </span>
      </div>
    </Link>
  )
}
