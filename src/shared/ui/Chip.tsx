interface ToolChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  outline?: boolean
  children: React.ReactNode
}

/**
 * Chip/toggle button for selections and options
 *
 * @param {Object} props
 * @param {boolean} [props.active] - Whether the chip is selected
 * @param {boolean} [props.outline] - Outline-only style variant
 * @param {React.ReactNode} props.children - Chip label
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled chip button
 */
export default function Chip({
  active = false,
  outline = false,
  children,
  className = '',
  ...props
}: ToolChipProps) {
  let baseClass = 'rounded-md border px-4 py-2 font-mono text-xs transition-colors'

  if (active && outline) {
    baseClass += ' border-acid text-acid'
  } else if (active) {
    baseClass += ' border-acid bg-acid font-semibold text-ink-deep hover:text-ink-deep'
  } else {
    baseClass += ' border-line-strong text-text-sub hover:border-acid/70 hover:text-acid'
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
