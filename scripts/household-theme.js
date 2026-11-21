#!/usr/bin/env node
// Writes an app's theme.css from its seed colour: `household-theme <#rrggbb> [out.css]`.
// colourRoles.ts is TypeScript and Node does not strip types under node_modules, so it is loaded
// through Vite, which the app has as a peer of unplugin-icons anyway.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const [seed, out = 'src/theme.css'] = process.argv.slice(2)
if (seed === undefined) {
  console.error('usage: household-theme <#rrggbb> [out.css]  (out defaults to src/theme.css)')
  process.exit(1)
}

const roles = fileURLToPath(new URL('../src/ui/colourRoles.ts', import.meta.url))
const server = await createServer({
  configFile: false,
  logLevel: 'silent',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
})
try {
  const { colourRolesCss, seedColour } = await server.ssrLoadModule(roles)
  const target = resolve(process.cwd(), out)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, colourRolesCss(seedColour(seed)))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await server.close()
}
