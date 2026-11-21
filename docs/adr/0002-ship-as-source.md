# 0002. household-ui ships as source TSX and CSS, with no build step

## Status

Accepted.

## Context

Both consumers are Vite apps that already compile TSX, resolve CSS imports and resolve
`~icons/...` imports through `unplugin-icons`. A built package would have to bundle or
externalise all three, and would fix one JSX runtime and one icon pipeline for every app.

## Decision

The package is the files in `src/`, installed as `github:nadav-alon/household-ui#<tag>`.
`preact`, `vite`, `unplugin-icons` and `@iconify-json/material-symbols` are peer dependencies, so
the app's own copies are the ones used. There is no `dist/`, no build script and nothing to
publish beyond the tag.

The theme is the exception to "import it": no `theme.css` ships, because the seed colour is
the app's. The `household-theme` script writes the app's own from its seed. The script is
plain JavaScript that loads the TypeScript generator through Vite, because Node refuses to
strip types from files under `node_modules`.

## Consequences

- The app's Vite compiles this package's TSX, so its TypeScript config needs `jsxImportSource: "preact"`.
- `unplugin-icons`' JSX compiler needs `@svgr/core` and `@svgr/plugin-jsx` in the app.
- A breaking change to a component's props is a new tag the apps adopt deliberately.
