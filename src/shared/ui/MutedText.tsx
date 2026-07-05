/**
 * Muted/secondary text with reduced contrast
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled muted span
 */
export default function MutedText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`text-faint ${className}`}>
      {children}
    </span>
  )
}
