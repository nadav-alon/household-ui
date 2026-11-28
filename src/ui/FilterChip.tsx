import CheckIcon from '~icons/material-symbols/check'
import { Icon } from './Icon.tsx'
import './FilterChip.css'

export interface FilterChipProps {
  label: string
  selected: boolean
  onToggle: () => void
}

/** A filter chip: a toggle button that reads as pressed while its filter applies, with a leading check when it does. */
export function FilterChip({ label, selected, onToggle }: FilterChipProps) {
  return (
    <button type="button" class="ui-filter-chip" aria-pressed={selected} onClick={onToggle}>
      {selected && <Icon symbol={CheckIcon} size="1.125rem" />}
      {label}
    </button>
  )
}
