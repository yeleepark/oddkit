/**
 * Vertical stack layout for tool input controls
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Control elements
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Flex column container
 */
export default function Controls({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-6 text-sm ${className}`}>
      {children}
    </div>
  )
}
