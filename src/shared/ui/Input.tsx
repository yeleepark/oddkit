/**
 * Text input field with consistent styling
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Standard input props
 * @returns {JSX.Element} Styled input element
 */
export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-sm text-text-main outline-none transition-colors placeholder:text-faint focus:border-acid ${props.className || ''}`}
      style={{
        boxShadow: 'var(--theme-shadow)',
        ...props.style,
      }}
    />
  )
}
