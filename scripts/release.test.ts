import { spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const script = join(import.meta.dirname, '../.github/workflows/scripts/release.sh')
let dir: string

// A `gh` that records each call to calls.log, one line per call.
function fakeGh() {
  mkdirSyncBin()
  writeFileSync(join(dir, 'bin/gh'), '#!/usr/bin/env bash\necho "$*" >> "$CALLS"\n')
  chmodSync(join(dir, 'bin/gh'), 0o755)
}

function mkdirSyncBin() {
  spawnSync('mkdir', ['-p', join(dir, 'bin')])
}

function release(version: string) {
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
    },
  })
  let calls: string[] = []
  try {
    calls = readFileSync(join(dir, 'calls.log'), 'utf8').trim().split('\n')
  } catch {
    // gh was never called
  }
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
    expect(calls).toEqual(['release create v1.2.3 --repo owner/repo --target abc123 --title v1.2.3 --generate-notes'])
  })
})
