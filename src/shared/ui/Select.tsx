/**
 * Select dropdown with consistent styling
 *
 * @param {React.SelectHTMLAttributes<HTMLSelectElement>} props - Standard select props
 * @returns {JSX.Element} Styled select element
 */
export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-10 rounded-md border border-line-strong bg-panel px-3 font-mono text-sm text-text-main outline-none transition-colors hover:border-acid/70 focus:border-acid ${props.className || ''}`}
      style={{
        boxShadow: 'var(--theme-shadow)',
        ...props.style,
      }}
    />
  )
}
