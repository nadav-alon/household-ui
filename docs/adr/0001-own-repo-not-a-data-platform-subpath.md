# 0001. household-ui is its own repository, not a `data-platform` subpath

## Status

Accepted.

## Context

The Household apps (home-catalogue, recipes) share a look: Material 3 components, a theme
generator and a top app bar. The `data-platform` repository already ships code both apps
consume, so a `data-platform/ui` subpath was the obvious home.

data-platform ADR 0002 extracted the client helpers "without any UI": the platform is a data
layer, and a component library would give it a second reason to change and a second kind of
consumer (Preact, Vite, CSS) that its data-only clients do not have.

## Decision

The UI lives in `nadav-alon/household-ui`, installed by tag like `data-platform` is. The
platform stays UI-free; this repository depends on no data code.

## Consequences

- A UI change is released and adopted on its own cadence, not coupled to a platform release.
- The apps pin two tags (`data-platform`, `household-ui`) instead of one.
