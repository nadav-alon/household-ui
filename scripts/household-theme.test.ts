import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { colourRolesCss, seedColour } from '../src/ui/colourRoles.ts'

const script = join(process.cwd(), 'scripts/household-theme.js')
let dir: string

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'household-theme-'))
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('household-theme', () => {
  it('writes the app’s theme.css for the seed colour it is given', () => {
    execFileSync('node', [script, '#16a34a', 'styles/theme.css'], { cwd: dir })
    expect(readFileSync(join(dir, 'styles/theme.css'), 'utf8')).toBe(colourRolesCss(seedColour('#16a34a')))
  })

  it('defaults to src/theme.css in the app', () => {
    execFileSync('node', [script, '#e8590c'], { cwd: dir })
    expect(readFileSync(join(dir, 'src/theme.css'), 'utf8')).toBe(colourRolesCss(seedColour('#e8590c')))
  })

  it('fails naming a seed that is not #rrggbb, and writes nothing', () => {
    const run = spawnSync('node', [script, 'blue'], { cwd: dir, encoding: 'utf8' })
    expect(run.status).not.toBe(0)
    expect(run.stderr).toContain('blue')
    expect(() => readFileSync(join(dir, 'src/theme.css'))).toThrow()
  })

  it('fails with usage when given no seed', () => {
    const run = spawnSync('node', [script], { cwd: dir, encoding: 'utf8' })
    expect(run.status).not.toBe(0)
    expect(run.stderr).toContain('usage')
  })
})
