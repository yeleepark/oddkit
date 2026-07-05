/**
 * Two-column layout grid for tool pages (controls and preview)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Responsive grid layout
 */
export default function Grid({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1.05fr] md:gap-12 ${className}`}>
      {children}
    </div>
  )
}
