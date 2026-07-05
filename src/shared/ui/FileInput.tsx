/**
 * File input field with dashed border and styled button
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Standard input props
 * @returns {JSX.Element} Styled file input element
 */
export default function FileInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="file"
      {...props}
      className={`block w-full rounded-[10px] border border-dashed border-line-strong bg-panel p-5 text-sm text-text-sub file:mr-4 file:rounded-md file:border-0 file:bg-acid file:px-3 file:py-2 file:font-mono file:text-xs file:font-semibold file:text-ink-deep hover:border-acid/60 ${props.className || ''}`}
    />
  )
}
