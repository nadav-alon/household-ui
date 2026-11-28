# Changelog

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
