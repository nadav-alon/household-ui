# household-ui

Shared Preact UI components and Material 3 theme for the Household apps. Ships as source; see
[docs/adr](docs/adr).

## Use

```
npm i github:nadav-alon/household-ui#v0.1.0
```

The app provides `preact`, `unplugin-icons` (with `compiler: 'jsx', jsx: 'preact'`),
`@iconify-json/material-symbols`, and the `@svgr/core` and `@svgr/plugin-jsx` that
`unplugin-icons`' JSX compiler loads.

Generate the app's colours from its own seed, then import the stylesheets and components:

```
npx household-theme '#e8590c' src/theme.css
```

```ts
import 'household-ui/ui/tokens.css'
import 'household-ui/ui/base.css'
import './theme.css'
import { Button } from 'household-ui/ui/Button.tsx'
import { TopAppBar } from 'household-ui/shell/TopAppBar.tsx'
```
