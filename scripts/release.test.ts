import { spawnSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const script = join(import.meta.dirname, '../.github/workflows/scripts/release.sh')
let dir: string

// A `gh` that records each call to calls.log, one line per call. `gh api`
// answers as the tag lookup: found when TAG_EXISTS is set, else a 404.
function fakeGh() {
  mkdirSync(join(dir, 'bin'))
  writeFileSync(
    join(dir, 'bin/gh'),
    [
      '#!/usr/bin/env bash',
      'echo "$*" >> "$CALLS"',
      'if [[ "$1" == api ]]; then',
      '  if [[ -n "${TAG_EXISTS:-}" ]]; then echo "{}"; else echo "gh: Not Found (HTTP 404)" >&2; exit 1; fi',
      'fi',
      '',
    ].join('\n'),
  )
  chmodSync(join(dir, 'bin/gh'), 0o755)
}

function release(version: string, tagExists = false) {
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ version }))
  fakeGh()
  const run = spawnSync('bash', [script], {
    cwd: dir,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${join(dir, 'bin')}:${process.env.PATH}`,
      CALLS: join(dir, 'calls.log'),
      REPO: 'owner/repo',
      SHA: 'abc123',
      ...(tagExists ? { TAG_EXISTS: '1' } : {}),
    },
  })
  const calls = readFileSync(join(dir, 'calls.log'), 'utf8').trim().split('\n')
  return { run, calls }
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'release-'))
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('release.sh', () => {
  it('creates tag and release v<version> on the pushed commit', () => {
    const { run, calls } = release('1.2.3')
    expect(run.status).toBe(0)
    expect(calls).toEqual([
      'api repos/owner/repo/git/ref/tags/v1.2.3',
      'release create v1.2.3 --repo owner/repo --target abc123 --title v1.2.3 --generate-notes',
    ])
  })

  it('creates nothing and succeeds when the version already has a tag', () => {
    const { run, calls } = release('1.2.3', true)
    expect(run.status).toBe(0)
    expect(calls).toEqual(['api repos/owner/repo/git/ref/tags/v1.2.3'])
  })
})
