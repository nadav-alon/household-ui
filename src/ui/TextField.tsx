import type { JSX } from 'preact'
import { useUniqueId } from './useUniqueId.ts'
import { useFieldError } from './FieldError.tsx'
import { FieldFrame } from './FieldFrame.tsx'

export interface TextFieldProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'class' | 'className'> {
  label: string
  /** Shown under the field as an alert and announced as its description; also marks the input invalid. */
  error?: string
}

/** A native `<input>` in an outlined container, labelled by a `<label>` that floats when it is focused or filled, with an optional error message. */
export function TextField({ label, error, id, 'aria-describedby': describedBy, placeholder, ...rest }: TextFieldProps) {
  const generatedId = useUniqueId()
  const inputId = id ?? generatedId
  const field = useFieldError(inputId, error, describedBy)
  return (
    <FieldFrame
      controlId={inputId}
      label={label}
      errorId={field.errorId}
      error={error}
      control={
        <input
          {...rest}
          id={inputId}
          class="ui-field__control"
          placeholder={placeholder || ' '}
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
        />
      }
    />
  )
}
