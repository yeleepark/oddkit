import Chip from '@/shared/ui/Chip'

interface OptionButtonProps<T extends string> {
  active: boolean
  children: React.ReactNode
  onSelect: (value: T) => void
  value: T
  className?: string
}

export default function OptionButton<T extends string>({
  active,
  children,
  className = '',
  onSelect,
  value,
}: OptionButtonProps<T>) {
  return (
    <Chip type="button" onClick={() => onSelect(value)} active={active} className={className}>
      {children}
    </Chip>
  )
}
