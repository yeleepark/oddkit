/**
 * Grid layout for displaying multiple statistics
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - ToolStat components
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Responsive grid container
 */
export default function StatGrid({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`grid gap-3 text-sm sm:grid-cols-2 ${className}`}>{children}</div>
}
