/**
 * Select dropdown with consistent styling
 *
 * Renders its own chevron instead of the native dropdown arrow — the
 * browser-drawn arrow sits visibly off-center (pushed toward the top)
 * in narrow, auto-width selects. The incoming className (width control,
 * e.g. "w-full") is applied to the wrapper; the select itself always
 * fills that wrapper.
 *
 * @param {React.SelectHTMLAttributes<HTMLSelectElement>} props - Standard select props
 * @returns {JSX.Element} Styled select element
 */
export default function Select({
  className = '',
  style,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        {...props}
        className="h-10 w-full appearance-none rounded-md border border-line-strong bg-panel py-2 pl-3 pr-9 font-mono text-sm text-text-main outline-none transition-colors hover:border-acid/70 focus:border-acid"
        style={{
          boxShadow: 'var(--theme-shadow)',
          ...style,
        }}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}
