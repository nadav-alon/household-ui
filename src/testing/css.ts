import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { colourRoleNames, colourRoleProperty } from '../ui/colourRoles.ts'

const repoRoot = join(import.meta.dirname, '../..')

/** Test-only: reads a file by its repo-relative path. Nothing in the app may import this module. */
export const read = (path: string) => readFileSync(join(repoRoot, path), 'utf8')

/** The custom properties `tokens.css` and the generated `theme.css` define; the roles are known from `colourRoleNames` as no `theme.css` ships. */
export const defined = new Set([
  ...colourRoleNames.map(colourRoleProperty),
  ...[...read('src/ui/tokens.css').matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]),
])

/** The custom properties a stylesheet, given by repo-relative path, reads, split by whether `defined` has them. */
export function tokenUsage(stylesheet: string): { used: string[]; undefinedTokens: string[] } {
  const used = [...new Set([...read(stylesheet).matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))]
  return { used, undefinedTokens: used.filter((property) => !defined.has(property)) }
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const mediaPattern = (query: string) =>
  new RegExp(`@media ${escape(query)}\\s*{((?:[^{}]*{[^}]*})*)\\s*}`)

/** The rules inside a stylesheet's `@media <query>` block, e.g. `(hover: hover)`; empty when it has none. */
export const mediaBlock = (stylesheet: string, query: string) => read(stylesheet).match(mediaPattern(query))?.[1] ?? ''

/** A stylesheet with its `@media <query>` block removed. */
export const outsideMediaBlock = (stylesheet: string, query: string) => read(stylesheet).replace(mediaPattern(query), '')

/** The value a stylesheet's last `selector { … }` rule gives `property`, or undefined when no rule sets it. */
export function declaration(stylesheet: string, selector: string, property: string): string | undefined {
  const rule = new RegExp(`${escape(selector)}\\s*{([^}]*)}`, 'g')
  const values = [...read(stylesheet).matchAll(rule)].flatMap(([, body]) =>
    [...body!.matchAll(new RegExp(`(?:^|[;\\s])${escape(property)}\\s*:\\s*([^;]+)`, 'g'))].map((m) => m[1]!.trim()),
  )
  return values.at(-1)
}

/** The four longhands a type role sets, in the order a stylesheet declares them. */
const typeProperties = ['font-size', 'line-height', 'font-weight', 'letter-spacing'] as const
const typeTokenSuffixes = ['size', 'line-height', 'weight', 'tracking'] as const

/** What a rule must declare to set its text in an M3 type-scale role, e.g. `label-large`. */
export const typeRoleDeclarations = (role: string) =>
  Object.fromEntries(typeProperties.map((property, i) => [property, `var(--md-sys-typescale-${role}-${typeTokenSuffixes[i]})`]))

/** The type-role longhands a stylesheet's `selector { … }` rule declares; compare with `typeRoleDeclarations`. */
export const typeDeclarations = (stylesheet: string, selector: string) =>
  Object.fromEntries(typeProperties.map((property) => [property, declaration(stylesheet, selector, property)]))
