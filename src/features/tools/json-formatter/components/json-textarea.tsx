interface JsonTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

/**
 * Monospace textarea for JSON input/output panels.
 *
 * @param {Object} props
 * @param {boolean} [props.hasError] - Renders the border in an error state
 * @returns {JSX.Element} Styled textarea element
 */
export default function JsonTextarea({ hasError = false, className = '', ...props }: JsonTextareaProps) {
  return (
    <textarea
      spellCheck={false}
      {...props}
      className={`h-72 w-full resize-y rounded-md border px-3 py-2 font-mono text-xs leading-relaxed text-text-main outline-none transition-colors placeholder:text-faint sm:text-sm ${
        hasError ? 'border-red-500/60 bg-panel' : 'border-line-strong bg-panel focus:border-acid'
      } ${className}`}
      style={{
        boxShadow: 'var(--theme-shadow)',
        ...props.style,
      }}
    />
  )
}
