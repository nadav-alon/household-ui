import './AlertBanner.css'

export interface AlertBannerProps {
  /** What the household needs to know, for example `2 urgent Items`. */
  message: string
}

/** A full-width banner announced to assistive tech as an alert. */
export function AlertBanner({ message }: AlertBannerProps) {
  return (
    <div role="alert" class="ui-alert-banner">
      <p class="ui-alert-banner__text">{message}</p>
    </div>
  )
}
