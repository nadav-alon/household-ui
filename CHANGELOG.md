# Changelog

## 0.1.0

First release, extracted from home-catalogue's `src/ui/` and `src/shell/`.

- Components: Button, CentredCard, Chip, Dialog, DialogActions, Fab, Field and FieldError,
  FilterChip, Icon, IconButton, ListRow, SegmentedButton, Select, Snackbar, TextArea, TextField,
  and TopAppBar, with their CSS and tests; `base.css` and `tokens.css`.
- `colourRoles` and `colourRolesCss`, and the `household-theme` script that writes an app's
  `theme.css` from its seed colour. No `theme.css` ships.
- `CentredCard` takes an `appName` prop; it no longer says "Home Catalogue".
- Ships as source, installable as `github:nadav-alon/household-ui#v0.1.0`.
