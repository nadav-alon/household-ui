/** A labelled button a component shows beside its message, for example Undo or Review. */
export interface ButtonAction {
  label: string
  onAction: () => void
}
