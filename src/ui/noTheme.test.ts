import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('the package', () => {
  it('ships no theme.css: each app generates its own from its seed colour', () => {
    expect(existsSync('src/ui/theme.css')).toBe(false)
    expect(existsSync('src/theme.css')).toBe(false)
  })
})
