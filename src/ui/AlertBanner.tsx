import CloseIcon from '~icons/material-symbols/close'
import { Button } from './Button.tsx'
import { IconButton } from './IconButton.tsx'
import './AlertBanner.css'

export interface AlertBannerProps {
  /** What the household needs to know, for example `2 urgent Items`. */
  message: string
  /** An optional button beside the message, for example Review. */
  action?: { label: string; onAction: () => void }
  /** When given, the banner shows a dismiss button that calls it; hiding the banner is the caller's to do. */
  onDismiss?: () => void
}

/** A full-width banner announced to assistive tech as an alert. */
export function AlertBanner({ message, action, onDismiss }: AlertBannerProps) {
  return (
    <div role="alert" class="ui-alert-banner">
      <p class="ui-alert-banner__text">{message}</p>
      {action && (
        <Button variant="text" onClick={action.onAction}>
          {action.label}
        </Button>
      )}
      {onDismiss && <IconButton symbol={CloseIcon} label="Dismiss" onClick={onDismiss} />}
    </div>
  )
}
