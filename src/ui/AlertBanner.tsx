import CloseIcon from '~icons/material-symbols/close'
import { Button } from './Button.tsx'
import type { ButtonAction } from './ButtonAction.ts'
import { IconButton } from './IconButton.tsx'
import './AlertBanner.css'

/** A navigation action: a native link, so modified clicks and the status-bar URL behave as for any `<a>`. */
export interface LinkAction {
  label: string
  href: string
}

export interface AlertBannerProps {
  /** What the household needs to know, for example `2 urgent Items`. */
  message: string
  /** `urgent` (the default) is error-coloured; `advisory` is the calmer secondary look. Both are announced as an alert. */
  tone?: 'urgent' | 'advisory'
  /** An optional button, or link when it has an `href`, beside the message, for example Review. */
  action?: ButtonAction | LinkAction
  /** When given, the banner shows a dismiss button that calls it; hiding the banner is the caller's to do. */
  onDismiss?: () => void
}

/** A full-width banner announced to assistive tech as an alert. */
export function AlertBanner({ message, tone = 'urgent', action, onDismiss }: AlertBannerProps) {
  return (
    <div role="alert" class={`ui-alert-banner ui-alert-banner--${tone}`}>
      <p class="ui-alert-banner__text">{message}</p>
      {action &&
        ('href' in action ? (
          <a class="ui-button ui-button--text" href={action.href}>
            {action.label}
          </a>
        ) : (
          <Button variant="text" onClick={action.onAction}>
            {action.label}
          </Button>
        ))}
      {onDismiss && <IconButton symbol={CloseIcon} label="Dismiss" onClick={onDismiss} />}
    </div>
  )
}
