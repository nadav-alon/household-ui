# Changelog

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
