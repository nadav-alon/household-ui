import type { ComponentChildren, JSX } from 'preact'
import { FieldError } from './FieldError.tsx'
import './Field.css'

export interface FieldFrameProps {
  controlId: JSX.HTMLAttributes['id']
  label: string
  errorId: string
  error: string | undefined
  /** The control, rendered first so the label and outline can react to its state through sibling selectors. */
  control: ComponentChildren
  /** Anything laid over the container's trailing edge; it must not intercept pointer events. */
  trailing?: ComponentChildren
}

/**
 * The outlined container every field shares: the control, its label floating in the top outline, the
 * outline with a notch for the floated label, and the error message beneath.
 */
export function FieldFrame({ controlId, label, errorId, error, control, trailing }: FieldFrameProps) {
  return (
    <div class="ui-field">
      <div class="ui-field__container">
        {control}
        <label class="ui-field__label" for={controlId}>
          {label}
        </label>
        <fieldset class="ui-field__outline" aria-hidden="true">
          <legend class="ui-field__notch">
            <span data-label={label} />
          </legend>
        </fieldset>
        {trailing}
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  )
}
