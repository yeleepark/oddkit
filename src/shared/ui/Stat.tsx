/**
 * Statistic display with label and value
 *
 * @param {Object} props
 * @param {React.ReactNode} props.label - Stat label (monospace, uppercase)
 * @param {React.ReactNode} props.value - Stat value
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Styled stat card
 */
export default function Stat({
  label,
  value,
  className = '',
}: {
  label: React.ReactNode
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-lg border border-line p-3 ${className}`}>
      <p className="font-mono text-[10px] uppercase text-faint">{label}</p>
      <p className="mt-1 font-semibold text-text-main">{value}</p>
    </div>
  )
}
