/**
 * Form label with monospace styling and uppercase text
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Label text
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled form label
 */
export default function Label({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <label
      className={`mb-3 block font-mono text-[11px] font-medium uppercase text-mist ${className}`}
    >
      {children}
    </label>
  )
}
