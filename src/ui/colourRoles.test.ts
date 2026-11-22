import { describe, expect, it } from 'vitest'
import { type ColourRoleName, type HexColour, colourRoleHex, colourRoleNames, colourRoleProperty, colourRolesCss, seedColour } from './colourRoles.ts'

const seed = seedColour('#e8590c')

function block(css: string, opener: string): string {
  const start = css.indexOf(opener)
  if (start < 0) throw new Error(`No ${opener} block in the generated CSS`)
  return css.slice(start, css.indexOf('\n}', start))
}

describe('colourRolesCss', () => {
  const css = colourRolesCss(seed)
  const light = block(css, ':root {')
  const dark = block(css, '@media (prefers-color-scheme: dark)')

  it('declares every role for light and for dark', () => {
    for (const role of colourRoleNames) {
      const property = colourRoleProperty(role)
      expect(light).toContain(`${property}: #`)
      expect(dark).toContain(`${property}: #`)
    }
    expect(colourRoleNames).toHaveLength(53)
  })

  it('gives dark a different surface from light', () => {
    expect(dark).not.toContain(light.split('\n').find((l) => l.includes('--md-sys-color-surface:'))!)
  })

  it('regenerates every seed-derived role from a different seed', () => {
    const other = colourRolesCss(seedColour('#16a34a'))
    const fixed = (role: string) => role === 'shadow' || role === 'scrim' || /^(on)?[eE]rror|^(on)?[wW]arning/.test(role)
    const value = (source: string, role: ColourRoleName) =>
      new RegExp(`${colourRoleProperty(role)}: (#[0-9a-f]{6});`).exec(source)![1]
    const neutral = (role: ColourRoleName) => ['#ffffff', '#000000'].includes(value(css, role))
    for (const role of colourRoleNames.filter((r) => !fixed(r) && !neutral(r))) {
      expect(value(other, role), role).not.toBe(value(css, role))
    }
  })

  it('derives the roles with SchemeFidelity, keeping the seed hue in the containers', () => {
    expect(light).toContain('--md-sys-color-primary-container: #cb4a00;')
    expect(dark).toContain('--md-sys-color-primary-container: #f56218;')
  })

  it('rejects a seed that is not #rrggbb', () => {
    expect(() => seedColour('blue')).toThrow('blue')
  })
})

describe('warning roles', () => {
  const seeds = ['#2f9e44', '#e8590c', '#16a34a', '#1971c2'].map(seedColour)
  const pairs = [['warning', 'onWarning'], ['warningContainer', 'onWarningContainer']] as const
  const modes = ['light', 'dark'] as const

  function channels(hex: HexColour): number[] {
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  }
  function luminance(hex: HexColour): number {
    const [r, g, b] = channels(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  function contrast(a: HexColour, b: HexColour): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  function hue(hex: HexColour): number {
    const [r, g, b] = channels(hex)
    const max = Math.max(r, g, b)
    const d = max - Math.min(r, g, b)
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    return (h * 60 + 360) % 360
  }
  function hueDistance(a: HexColour, b: HexColour): number {
    const d = Math.abs(hue(a) - hue(b))
    return Math.min(d, 360 - d)
  }

  it('declares the four warning roles in the light and dark blocks', () => {
    const css = colourRolesCss(seeds[0])
    for (const opener of [':root {', '@media (prefers-color-scheme: dark)']) {
      const scope = block(css, opener)
      for (const role of ['warning', 'onWarning', 'warningContainer', 'onWarningContainer'] as const) {
        expect(scope).toMatch(new RegExp(`${colourRoleProperty(role)}: #[0-9a-f]{6};`))
      }
    }
  })

  it('is amber for any seed, apart from error', () => {
    for (const seed of seeds) {
      for (const mode of modes) {
        for (const role of ['warning', 'warningContainer'] as const) {
          const amber = colourRoleHex(seed, role, mode)
          expect(hue(amber), `${seed} ${mode} ${role}`).toBeGreaterThanOrEqual(33)
          expect(hue(amber), `${seed} ${mode} ${role}`).toBeLessThanOrEqual(55)
          const error = colourRoleHex(seed, role === 'warning' ? 'error' : 'errorContainer', mode)
          expect(hueDistance(amber, error), `${seed} ${mode} ${role}`).toBeGreaterThan(20)
        }
      }
    }
  })

  it('has text contrast of at least 4.5:1 in both modes', () => {
    for (const seed of seeds) {
      for (const mode of modes) {
        for (const [surface, on] of pairs) {
          expect(contrast(colourRoleHex(seed, surface, mode), colourRoleHex(seed, on, mode)), `${seed} ${mode} ${on}`)
            .toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })
})
