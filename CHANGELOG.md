# Changelog

## 0.10.0

- New `Checkbox` (`ui/Checkbox.tsx`, `ui/Checkbox.css`): a native `<input type="checkbox">` with an 18dp box (on-surface-variant outline; primary fill with an on-primary check when selected), a 40dp state layer on hover (inside `(hover: hover)`) and focus-visible, and a 48dp hit area. `checked`, `onChange` and the other input props pass through. An optional `label` renders a tappable label beside the box in a row at least 48dp tall; without one, give it an `aria-label`.
- **Breaking:** `ListRow.css` no longer styles `input[type=checkbox]` in the trailing slot, so a bare native checkbox there is unstyled. Pass `<Checkbox />` as the list row `control`; the row still toggles it from a tap anywhere on it.

## 0.9.0

- `SegmentedButton` segments stay 2.5rem tall at every width: `ListRow` no longer raises them to 3rem inside a stacked row below 600px. A transparent `::after` extends each segment's hit area to at least 3rem tall without changing its layout height; `.ui-segmented__option` is now `position: relative` and `display: inline-flex`.
- The selected `SegmentedButton` segment shows a leading 18dp check icon, hidden from assistive tech.

## 0.8.0

- `FilterChip` is a 2rem container with the small (8dp) corner; a transparent `::after` extends its hit area to at least 3rem tall without changing the layout height. `.ui-filter-chip` is now `position: relative`, `box-sizing: border-box`, and `display: inline-flex` with `align-items: center` (it was the button's default inline-block), which can shift baseline alignment in a row of chips.
- A selected `FilterChip` shows a leading 18dp check icon, hidden from assistive tech; padding is 8dp before the icon, 16dp without it, 16dp trailing.
- `TextField`, `TextArea` and `Select` are outlined fields: the control is at least 3.5rem tall with a transparent background and 4dp corners, so it no longer reads as a hole in a dialog. The label sits inside in body-large and floats into a notch in the top outline, in body-small, when the control is focused or holds a value (a `Select` is always floated). The outline is outline-coloured at rest, primary when focused and error when invalid.
- Markup: each field is now `.ui-field__container` holding the control, its `<label>`, a decorative `.ui-field__outline` and the error beneath; the control's own border is transparent and the outline draws it. `TextField` and `TextArea` default `placeholder` to a space, which the floating label relies on.
- The error message under a field is inset 16dp from each side, in line with M3's supporting text.
- `Select` hides the native arrow and shows a trailing 24dp arrow-drop-down icon in on-surface-variant that ignores pointer events.

## 0.7.0

- `ListRow` is 56dp with one line of text and 72dp with two, in every kind of row: plain, link, control and `onActivate`. Padding no longer adds to the minimum height, and a row with supporting text carries `ui-list-row--two-line`.
- `ListRow` is transparent on its container rather than painting `surface`.
- A `muted` `ListRow` headline is no longer italic; it stays on-surface-variant.
- An SVG in a `ListRow`'s trailing slot is 1.5rem square, as a block.

## 0.6.1

- `Button`: every `.ui-button`, in each variant and in its anchor form, has a touch target of at least 48dp
  tall, and 48dp wide when narrower, centred on the 40dp container. A transparent `::after` supplies it,
  so the container's size and the layout are unchanged. `.ui-button` is now `position: relative`.
  The `::after` extends 4px past a button's top and bottom, and sideways on buttons narrower than 48px, which counts
  as scrollable overflow: check that no `overflow: auto` or `scroll` ancestor has an edge flush with a button.

## 0.6.0

- **Breaking:** the type scale is the M3 scale's 15 styles. `tokens.css` defines
  `--md-sys-typescale-<role>-<size>-size`, `-line-height`, `-weight` and `-tracking` for each of
  display, headline, title, body and label in large, medium and small, at M3's baseline values. These tokens
  are removed; read the role that fits the text instead:
  - `--md-sys-typescale-display-size` → `--md-sys-typescale-display-medium-size` (and its line height, weight, tracking)
  - `--md-sys-typescale-headline-size` → `--md-sys-typescale-headline-small-size` (a dialog title) or `-headline-medium-size` (a page heading)
  - `--md-sys-typescale-title-size` → `--md-sys-typescale-title-large-size`
  - `--md-sys-typescale-body-size` → `--md-sys-typescale-body-large-size`
  - `--md-sys-typescale-label-size` → `--md-sys-typescale-label-large-size` (buttons, chips), or `-label-medium-size` for smaller labels
  - `--md-sys-typescale-line-height` → the `-line-height` token of the same role, e.g. `--md-sys-typescale-body-large-line-height`
- The kit sets its text in roles: `TopAppBar` title in title-large; `Dialog` title in headline-small;
  `Button`, `Chip`, `FilterChip` and `SegmentedButton` labels in label-large; `ListRow` headline in
  body-large and supporting text in body-medium; field labels and errors in body-small; `AlertBanner` and
  `Snackbar` text in body-medium; `CentredCard` name in title-large and its `h1` in headline-medium. The body
  is set in body-large. Line heights now sit on the 4dp grid and weights and letter spacing follow M3.

## 0.5.2

- `CentredCard`: the card surface is a filled card, `surface-container-highest` with the level-0 elevation
  (no shadow), instead of `surface-container` with a level-1 shadow.

## 0.5.1

- `IconButton`: `title` defaults to `label`, so every icon-only button gets a hover tooltip; a caller's own
  `title` still wins. `aria-label` is unchanged.

## 0.5.0

- `AlertBanner`: `action` can be a link. Given `{ label, href }` instead of `{ label, onAction }`, it renders a
  native `<a href>` with the text-button look, so modified clicks open it in another tab.

## 0.4.0

- `AlertBanner`: a `role="alert"` banner taking a message, an optional `action` and `onDismiss`, in an
  `urgent` (default) or `advisory` tone, themed only through colour-role tokens.

## 0.3.0

- The household theme emits a `warning` (amber) role family: `--md-sys-color-warning`, `-on-warning`,
  `-warning-container` and `-on-warning-container`, in light and dark. The hue is fixed amber, like
  `error`, whatever the seed; text contrast is at least 4.5:1. Regenerate `theme.css` to get them.

## 0.2.0

- `SnackbarMessage` takes an optional `onDismiss`, called once when the message times out, is
  dismissed, or is replaced by another message, and never when its action is pressed.

## 0.1.0

First release, extracted from home-catalogue's `src/ui/` and `src/shell/`.

- Components: Button, CentredCard, Chip, Dialog, DialogActions, Fab, Field and FieldError,
  FilterChip, Icon, IconButton, ListRow, SegmentedButton, Select, Snackbar, TextArea, TextField,
  and TopAppBar, with their CSS and tests; `base.css` and `tokens.css`.
- `colourRoles` and `colourRolesCss`, and the `household-theme` script that writes an app's
  `theme.css` from its seed colour. No `theme.css` ships.
- `CentredCard` takes an `appName` prop; it no longer says "Home Catalogue".
- Ships as source, installable as `github:nadav-alon/household-ui#v0.1.0`.
