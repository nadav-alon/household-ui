import type { JSX } from 'preact'
import './Checkbox.css'

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'class' | 'className'> {
  /** A tappable label beside the box. Without it, name the checkbox with `aria-label`, or let a surrounding label (a `ListRow`'s control slot) name it. */
  label?: string
}

/** A native `<input type="checkbox">`; the box and its state layer are drawn around it, and `onChange`, `checked` and the other input props pass through. */
export function Checkbox({ label, ...rest }: CheckboxProps) {
  const control = (
    <span class="ui-checkbox__control">
      <input {...rest} type="checkbox" class="ui-checkbox__input" />
      <span class="ui-checkbox__layer" aria-hidden="true" />
      <span class="ui-checkbox__box" aria-hidden="true" />
    </span>
  )
  if (label === undefined) return <span class="ui-checkbox">{control}</span>
  return (
    <label class="ui-checkbox ui-checkbox--labelled">
      {control}
      <span class="ui-checkbox__label">{label}</span>
    </label>
  )
}
