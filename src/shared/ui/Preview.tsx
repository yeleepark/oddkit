/**
 * Preview area for displaying tool output
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Preview content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled preview container
 */
export default function Preview({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex min-h-72 items-center justify-center rounded-xl border border-line bg-panel p-4 ${className}`}
      style={{
        boxShadow: 'var(--theme-shadow)',
      }}
    >
      {children}
    </div>
  )
}
