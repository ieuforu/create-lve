import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cliPath = path.join(repoDir, 'index.js')
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const workspace = mkdtempSync(path.join(tmpdir(), 'create-lve-smoke-'))

function run(command, args, cwd = repoDir) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
    stdio: 'inherit',
  })

  if (result.error) throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
}

try {
  for (const framework of ['react', 'vue']) {
    const target = path.join(workspace, `${framework}-app`)

    run(process.execPath, [cliPath, target, '--template', framework])
    assert.equal(existsSync(path.join(target, '.gitignore')), true)
    assert.equal(existsSync(path.join(target, '_gitignore')), false)

    const pkg = JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8'))
    assert.match(pkg.packageManager, /^pnpm@\d+\.\d+\.\d+$/)

    run(pnpm, ['--dir', target, 'build'])
    run(pnpm, ['--dir', target, framework === 'react' ? 'test' : 'test:unit'])
  }
} finally {
  rmSync(workspace, { recursive: true, force: true })
}
