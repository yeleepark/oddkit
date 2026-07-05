interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

/**
 * Action button with primary and secondary variants
 *
 * @param {Object} props
 * @param {('primary'|'secondary')} [props.variant] - Button style variant
 * @param {React.ReactNode} props.children - Button label
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled button element
 */
export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ToolButtonProps) {
  const baseClass =
    variant === 'primary'
      ? 'w-full rounded-lg bg-acid px-4 py-3 font-mono text-sm font-semibold text-ink-deep transition-colors hover:bg-text-main disabled:cursor-not-allowed disabled:opacity-50'
      : 'block rounded-lg bg-text-main px-4 py-3 text-center font-mono text-sm font-semibold text-ink-deep transition-colors hover:bg-acid'

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
