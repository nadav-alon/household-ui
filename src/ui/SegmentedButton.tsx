import CheckIcon from '~icons/material-symbols/check'
import { Icon } from './Icon.tsx'
import './SegmentedButton.css'

export interface SegmentedOption<Value extends string> {
  value: Value
  label: string
}

export interface SegmentedButtonProps<Value extends string> {
  /** The group's accessible name. */
  label: string
  options: readonly SegmentedOption<Value>[]
  value: Value
  onChange: (value: Value) => void
}

/** A group of native toggle buttons, one per option; the selected one has `aria-pressed="true"` and a leading check. */
export function SegmentedButton<Value extends string>({ label, options, value, onChange }: SegmentedButtonProps<Value>) {
  return (
    <div role="group" aria-label={label} class="ui-segmented">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            class="ui-segmented__option"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {selected && <Icon symbol={CheckIcon} size="1.125rem" />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
