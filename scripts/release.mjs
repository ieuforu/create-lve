import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const bump = process.argv[2]

assert.match(bump ?? '', /^(patch|minor|major)$/, 'Specify patch, minor, or major.')

function run(command, args, { capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: repoDir,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  })

  if (result.error) throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
  return capture ? result.stdout.trim() : ''
}

const branch = run('git', ['branch', '--show-current'], { capture: true })
assert.equal(
  branch,
  'main',
  `Releases must be created from main, not ${branch || 'detached HEAD'}.`,
)

const status = run('git', ['status', '--porcelain'], { capture: true })
assert.equal(status, '', 'Commit or stash all changes before releasing.')

run('git', ['fetch', 'origin', 'main'])
const [behind] = run('git', ['rev-list', '--left-right', '--count', 'origin/main...HEAD'], {
  capture: true,
}).split(/\s+/)
assert.equal(
  Number(behind),
  0,
  'Local main is behind origin/main. Pull or rebase before releasing.',
)

run(pnpm, ['check'])
run(pnpm, ['test:smoke'])
run(pnpm, ['version', bump, '--message', 'chore(release): v%s'])

const { version } = JSON.parse(readFileSync(path.join(repoDir, 'package.json'), 'utf8'))
run('git', ['push', 'origin', 'main', `v${version}`])

console.log(`\nRelease v${version} pushed. GitHub Actions will publish it to npm.`)
