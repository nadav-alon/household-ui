import type { JSX } from 'preact'
import { useUniqueId } from './useUniqueId.ts'
import { useFieldError } from './FieldError.tsx'
import { FieldFrame } from './FieldFrame.tsx'

export interface SelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'class' | 'className'> {
  label: string
  /** Shown under the field as an alert and announced as its description; also marks the select invalid. */
  error?: string
}

/** A native `<select>` in the same outlined container as a TextField, its label always floated; pass `<option>`s as children. */
export function Select({ label, error, id, 'aria-describedby': describedBy, ...rest }: SelectProps) {
  const generatedId = useUniqueId()
  const selectId = id ?? generatedId
  const field = useFieldError(selectId, error, describedBy)
  return (
    <FieldFrame
      controlId={selectId}
      label={label}
      errorId={field.errorId}
      error={error}
      control={
        <select
          {...rest}
          id={selectId}
          class="ui-field__control"
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
        />
      }
    />
  )
}
