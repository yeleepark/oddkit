/**
 * Max-width content container with responsive padding
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Constrained width wrapper
 */
export default function Container({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`mx-auto max-w-[1180px] px-6 sm:px-8 ${className}`}>{children}</div>
}
