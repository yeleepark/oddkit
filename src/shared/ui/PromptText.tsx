/**
 * Terminal-style prompt text with acid green color
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Prompt text content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled prompt span
 */
export default function PromptText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`font-mono text-xs text-acid ${className}`}>
      {children}
    </span>
  )
}
