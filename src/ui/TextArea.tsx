import type { JSX } from 'preact'
import { useUniqueId } from './useUniqueId.ts'
import { useFieldError } from './FieldError.tsx'
import { FieldFrame } from './FieldFrame.tsx'

export interface TextAreaProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'class' | 'className'> {
  label: string
  /** Shown under the field as an alert and announced as its description; also marks the field invalid. */
  error?: string
}

/** A native `<textarea>` styled and labelled like a TextField, with an optional error message. */
export function TextArea({ label, error, id, 'aria-describedby': describedBy, placeholder, ...rest }: TextAreaProps) {
  const generatedId = useUniqueId()
  const areaId = id ?? generatedId
  const field = useFieldError(areaId, error, describedBy)
  return (
    <FieldFrame
      controlId={areaId}
      label={label}
      errorId={field.errorId}
      error={error}
      control={
        <textarea
          {...rest}
          id={areaId}
          class="ui-field__control ui-field__control--multiline"
          placeholder={placeholder || ' '}
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
        />
      }
    />
  )
}
