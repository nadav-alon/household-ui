import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { colourRoleProperty } from './colourRoles.ts'
import { defined, read, tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'

describe('design tokens', () => {
  it('define type, spacing, shape and elevation scales', () => {
    for (const prefix of ['typescale', 'spacing', 'shape', 'elevation']) {
      expect([...defined].some((p) => p.startsWith(`--md-sys-${prefix}`))).toBe(true)
    }
  })

  it('defines size, line height, weight and tracking for all 15 type-scale styles', () => {
    for (const role of ['display', 'headline', 'title', 'body', 'label']) {
      for (const size of ['large', 'medium', 'small']) {
        for (const part of ['size', 'line-height', 'weight', 'tracking']) {
          expect(defined, `${role}-${size}-${part}`).toContain(`--md-sys-typescale-${role}-${size}-${part}`)
        }
      }
    }
  })

  it.each([
    ['title-large', '1.375rem', '1.75rem', '400', '0'],
    ['headline-small', '1.5rem', '2rem', '400', '0'],
    ['label-large', '0.875rem', '1.25rem', '500', '0.1px'],
    ['body-medium', '0.875rem', '1.25rem', '400', '0.25px'],
    ['label-medium', '0.75rem', '1rem', '500', '0.5px'],
  ])('pins %s to the M3 values', (role, size, lineHeight, weight, tracking) => {
    const tokens = read('src/ui/tokens.css')
    const value = (part: string) => tokens.match(new RegExp(`--md-sys-typescale-${role}-${part}:\\s*([^;]+);`))?.[1]
    expect([value('size'), value('line-height'), value('weight'), value('tracking')]).toEqual([size, lineHeight, weight, tracking])
  })

  it('base styles paint the body and the focus ring from defined tokens', () => {
    const base = read('src/ui/base.css')
    expect(base).toMatch(/body\s*{[^}]*background: var\(--md-sys-color-background\)/)
    expect(base).toMatch(/:focus-visible\s*{[^}]*outline:/)
    for (const [, property] of base.matchAll(/var\((--[\w-]+)\)/g)) {
      expect(defined, property).toContain(property)
    }
  })

  it('sets the body in body-large', () => {
    expect(typeDeclarations('src/ui/base.css', 'body')).toEqual(typeRoleDeclarations('body-large'))
  })

  it('drops the one-size-per-family tokens and the global line height, and no kit stylesheet reads an undefined token', () => {
    for (const removed of ['display', 'headline', 'title', 'body', 'label'].map((family) => `--md-sys-typescale-${family}-size`).concat('--md-sys-typescale-line-height')) {
      expect(defined).not.toContain(removed)
    }
    const stylesheets = execSync('git ls-files "*.css"', { encoding: 'utf8' }).trim().split('\n')
    expect(stylesheets.length).toBeGreaterThan(10)
    for (const stylesheet of stylesheets) expect(tokenUsage(stylesheet).undefinedTokens, stylesheet).toEqual([])
  })

  it('elevation shadows use a defined colour role', () => {
    expect(defined).toContain(colourRoleProperty('shadow'))
  })
})
