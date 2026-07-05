/**
 * Page header with eyebrow, title, and description
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.eyebrow] - Small text above title
 * @param {React.ReactNode} props.title - Page title (H1)
 * @param {React.ReactNode} [props.description] - Subtitle/description
 * @returns {JSX.Element} Styled page header
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="mb-8">
      {eyebrow && <div className="mb-2 font-mono text-xs text-acid">{eyebrow}</div>}
      <h1 className="mb-2 text-[30px] font-semibold text-text-main">{title}</h1>
      {description && <p className="max-w-2xl text-[14.5px] text-mist">{description}</p>}
    </div>
  )
}
