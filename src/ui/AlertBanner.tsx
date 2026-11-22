import { Button } from './Button.tsx'
import './AlertBanner.css'

export interface AlertBannerProps {
  /** What the household needs to know, for example `2 urgent Items`. */
  message: string
  /** An optional button beside the message, for example Review. */
  action?: { label: string; onAction: () => void }
}

/** A full-width banner announced to assistive tech as an alert. */
export function AlertBanner({ message, action }: AlertBannerProps) {
  return (
    <div role="alert" class="ui-alert-banner">
      <p class="ui-alert-banner__text">{message}</p>
      {action && (
        <Button variant="text" onClick={action.onAction}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
