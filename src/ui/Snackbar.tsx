import { useEffect, useRef, useState } from 'preact/hooks'
import { Button } from './Button.tsx'
import type { ButtonAction } from './ButtonAction.ts'
import { milliseconds } from './milliseconds.ts'
import './Snackbar.css'

export interface SnackbarMessage {
  /** What happened, for example `Deleted Bandages`. */
  text: string
  /** An optional button beside the text, for example Undo. Pressing it runs `onAction` and dismisses the snackbar. */
  action?: ButtonAction
  /** Called once when the message ends without its action pressed: timed out, dismissed, or replaced by another message. */
  onDismiss?: () => void
}

/** How long a snackbar stays before it disappears on its own. */
const snackbarDurationMs = milliseconds(6000)

type Listener = (current: SnackbarMessage | null) => void

let current: SnackbarMessage | null = null
let timer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<Listener>()
/** What is keeping the snackbar up. While any hold is active the timeout does not run. */
type Hold = 'pointer' | 'focus'
const holds = new Set<Hold>()

/** Makes `next` the current message and returns the one it ended, if any. The caller runs that message's `onDismiss` once its own state is settled. */
function publish(next: SnackbarMessage | null): SnackbarMessage | null {
  clearTimeout(timer)
  if (next === null) holds.clear()
  const outgoing = current
  current = next
  for (const listener of listeners) listener(current)
  return outgoing === next ? null : outgoing
}

/** Shows `message` in the app's one snackbar, from any screen. */
export function showSnackbar(message: SnackbarMessage): void {
  const outgoing = publish(message)
  restartTimeout(message)
  outgoing?.onDismiss?.()
}

/** Gives `message` a fresh full timeout, unless a hold keeps it up. */
function restartTimeout(message: SnackbarMessage): void {
  clearTimeout(timer)
  if (holds.size === 0) timer = setTimeout(() => dismiss(message), snackbarDurationMs)
}

/** Keeps the snackbar up until `reason` is released. */
function hold(reason: Hold): void {
  if (!current) return
  holds.add(reason)
  clearTimeout(timer)
}

/** Releases the focus hold if focus is no longer inside `region`: removing the focused element moves focus to the body without a `focusout`. */
function releaseStaleFocusHold(region: HTMLElement): void {
  if (holds.has('focus') && !region.contains(document.activeElement)) release('focus')
}

/** Releases `reason`; once every hold is released the message gets a fresh full timeout. */
function release(reason: Hold): void {
  if (!current) return
  holds.delete(reason)
  restartTimeout(current)
}

/** Dismisses the snackbar if `message` is still the one showing, then runs its `onDismiss`. */
function dismiss(message: SnackbarMessage): void {
  if (current !== message) return
  publish(null)
  message.onDismiss?.()
}

/** Clears the snackbar if `message` is still the one showing, without running its `onDismiss`: its action was pressed. */
function consume(message: SnackbarMessage): void {
  if (current === message) publish(null)
}

/** Notifies `listener` immediately, then on every change, with the current message or `null`. Returns the unsubscribe function. */
function watchSnackbar(listener: Listener): () => void {
  listeners.add(listener)
  listener(current)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Renders the current snackbar, if any. Mount it once, app-wide: the `role="status"` region stays
 * in the document while empty so that screen readers announce a message when it appears.
 *
 * A message shown from a screen rendered outside the host's subtree is not displayed.
 */
export function SnackbarHost() {
  const [message, setMessage] = useState<SnackbarMessage | null>(null)

  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => watchSnackbar(setMessage), [])
  useEffect(() => {
    if (regionRef.current) releaseStaleFocusHold(regionRef.current)
  }, [message])

  return (
    <div
      ref={regionRef}
      class="ui-snackbar"
      role="status"
      onPointerEnter={() => hold('pointer')}
      onPointerLeave={() => release('pointer')}
      onFocusIn={() => hold('focus')}
      onFocusOut={() => release('focus')}
    >
      {message && <p class="ui-snackbar__text">{message.text}</p>}
      {message?.action && (
        <Button
          variant="text"
          onClick={() => {
            consume(message)
            message.action?.onAction()
          }}
        >
          {message.action.label}
        </Button>
      )}
    </div>
  )
}

/** Clears the snackbar and its timer; for tests, which share this module-level state. Runs the current message's `onDismiss`, so a callback left over from one test fires here. */
export function resetSnackbar(): void {
  publish(null)?.onDismiss?.()
}
