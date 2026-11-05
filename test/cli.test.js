import assert from 'node:assert/strict'
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const repoDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cliPath = path.join(repoDir, 'index.js')
const { version } = JSON.parse(readFileSync(path.join(repoDir, 'package.json'), 'utf8'))
const expectedPackageManager = 'pnpm@12.4.2'

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoDir,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', ...options.env },
  })
}

function output(result) {
  return `${result.stdout}\n${result.stderr}`
}

function temporaryDirectory(t) {
  const directory = mkdtempSync(path.join(tmpdir(), 'create-lve-test-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  return directory
}

test('prints help and version without entering the creation flow', () => {
  const help = runCli(['--help'])
  assert.equal(help.status, 0, help.stderr)
  assert.match(help.stdout, /用法：create-lve/)
  assert.match(help.stdout, /--template/)
  assert.match(help.stdout, /--yes/)
  assert.match(help.stdout, /--no-git/)

  const versionResult = runCli(['--version'])
  assert.equal(versionResult.status, 0, versionResult.stderr)
  assert.equal(versionResult.stdout.trim(), version)
})

for (const framework of ['react', 'vue']) {
  test(`creates the ${framework} template without installing dependencies`, (t) => {
    const parent = temporaryDirectory(t)
    const target = path.join(parent, `${framework}-starter`)
    const result = runCli([target, '--template', framework, '--no-install'])

    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /lve v\d+\.\d+\.\d+/)
    assert.match(result.stdout, /Ready in \d+\.\d+s/)
    assert.doesNotMatch(result.stdout, /代码已格式化/)
    assert.doesNotMatch(result.stdout, /你的起点/)
    assert.equal(existsSync(path.join(target, '.gitignore')), true)
    assert.equal(existsSync(path.join(target, '_gitignore')), false)
    assert.equal(existsSync(path.join(target, 'node_modules')), false)
    assert.equal(existsSync(path.join(target, '.tanstack')), false)
    assert.equal(existsSync(path.join(target, 'playwright-report')), false)
    assert.equal(existsSync(path.join(target, 'test-results')), false)
    assert.equal(existsSync(path.join(target, 'src/routeTree.gen.ts')), false)

    const pkg = JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8'))
    assert.equal(pkg.name, `${framework}-starter`)
    assert.equal(pkg.packageManager, expectedPackageManager)
    assert.equal(pkg.engines.node, '^22.18.0 || >=24.12.0')
    assert.match(
      readFileSync(path.join(target, 'index.html'), 'utf8'),
      new RegExp(`<title>${framework}-starter</title>`),
    )
  })
}

test('--yes uses the React defaults without another selection', (t) => {
  const parent = temporaryDirectory(t)
  const target = path.join(parent, 'yes-starter')
  const result = runCli([target, '--yes', '--no-install'])

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /项目目录/)
  assert.match(result.stdout, /技术栈  React/)
  assert.equal(existsSync(path.join(target, 'src/features/landing/LandingPage.tsx')), true)
})

test('--no-git skips repository initialization', (t) => {
  const parent = temporaryDirectory(t)
  const target = path.join(parent, 'no-git-starter')
  const result = runCli([target, '--template', 'react', '--no-install', '--no-git'])

  assert.equal(result.status, 0, result.stderr)
  assert.equal(existsSync(path.join(target, '.git')), false)
})

test('does not create a nested repository below an existing Git root', (t) => {
  const parent = temporaryDirectory(t)
  mkdirSync(path.join(parent, '.git'))
  const target = path.join(parent, 'apps', 'web')
  const result = runCli([target, '--template', 'react', '--no-install'])

  assert.equal(result.status, 0, result.stderr)
  assert.equal(existsSync(path.join(target, '.git')), false)
})

test('refuses a non-empty directory without modifying it in a non-interactive terminal', (t) => {
  const parent = temporaryDirectory(t)
  const target = path.join(parent, 'existing-project')
  const sentinel = path.join(target, 'keep-me.txt')
  mkdirSync(target)
  writeFileSync(sentinel, 'untouched')

  const result = runCli([target, '--template', 'react', '--no-install'])

  assert.equal(result.status, 1)
  assert.match(output(result), /目录非空/)
  assert.equal(readFileSync(sentinel, 'utf8'), 'untouched')
  assert.equal(existsSync(path.join(target, 'package.json')), false)
})

test(
  'rejects a path that reaches the CLI installation through a symlinked parent',
  { skip: process.platform === 'win32' },
  (t) => {
    const parent = temporaryDirectory(t)
    const alias = path.join(parent, 'cli-alias')
    symlinkSync(repoDir, alias, 'dir')

    const result = runCli([path.join(alias, 'node_modules'), '--template', 'react', '--no-install'])

    assert.equal(result.status, 1)
    assert.match(output(result), /不能覆盖 create-lve 自身的安装目录/)
  },
)

test('rejects unknown options', () => {
  const result = runCli(['--unknown'])
  assert.equal(result.status, 1)
  assert.match(output(result), /未知选项/)
})

test('the npm package contains required files without generated artifacts', () => {
  const result = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: repoDir,
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr)
  const [{ files }] = JSON.parse(result.stdout)
  const paths = new Set(files.map((file) => file.path))
  assert.equal(paths.has('LICENSE'), true)
  assert.equal(paths.has('template-react/_gitignore'), true)
  assert.equal(paths.has('template-vue/_gitignore'), true)
  assert.equal(paths.has('template-react/src/routeTree.gen.ts'), false)
  assert.equal(paths.has('template-vue/TODO.md'), false)
  assert.equal(
    [...paths].some((file) => file.endsWith('pnpm-lock.yaml')),
    false,
  )
  assert.equal(
    [...paths].some((file) => file.includes('/dist/')),
    false,
  )
  assert.equal(
    [...paths].some((file) => file.includes('/.tanstack/')),
    false,
  )
  assert.equal(
    [...paths].some((file) => file.includes('playwright-report') || file.includes('test-results')),
    false,
  )
  assert.equal(
    [...paths].some((file) => file.includes('node_modules')),
    false,
  )
})
