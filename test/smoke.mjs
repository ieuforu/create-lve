import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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

function checkModalExtension(target) {
  const storePath = path.join(target, 'src/stores/modal.store.ts')
  const rendererPath = path.join(target, 'src/components/modals/ModalRenderer.tsx')
  const fixturePath = path.join(target, 'src/test/modal-extension.types.ts')
  const store = readFileSync(storePath, 'utf8')
  const renderer = readFileSync(rendererPath, 'utf8')
  const extendedStore = store
    .replace(
      '  confirm: ConfirmModalData\n',
      '  confirm: ConfirmModalData\n  notice: { message: string }\n',
    )
    .replace(
      'const modalTypes: Record<ModalType, true> = { confirm: true }',
      'const modalTypes: Record<ModalType, true> = { confirm: true, notice: true }',
    )
  const extendedRenderer = renderer.replace(
    '  confirm: ConfirmModal,\n',
    '  confirm: ConfirmModal,\n  notice: NoticeModal,\n',
  )
  assert.notEqual(extendedStore, store)
  assert.notEqual(extendedRenderer, renderer)
  try {
    writeFileSync(storePath, extendedStore)
    writeFileSync(
      rendererPath,
      extendedRenderer +
        `
function NoticeModal({ data, open, onClose }: ModalProps<{ message: string }>) {
  return open ? <button onClick={onClose}>{data.message}</button> : null
}
`,
    )
    writeFileSync(
      fixturePath,
      `import type { useModalActions } from '#/stores/modal.store'
export function checkPayloads(open: ReturnType<typeof useModalActions>['open']) {
  open('confirm')
  open('notice', { message: 'Ready' })
  // @ts-expect-error Notice payloads are required.
  open('notice')
  // @ts-expect-error Payloads must match their modal type.
  open('notice', { title: 'Wrong payload' })
  // @ts-expect-error Confirm cannot accept notice data.
  open('confirm', { message: 'Wrong payload' })
}
`,
    )
    run(pnpm, ['--dir', target, 'typecheck'])
    run(pnpm, ['--dir', target, 'typecheck:ts'])
  } finally {
    writeFileSync(storePath, store)
    writeFileSync(rendererPath, renderer)
    rmSync(fixturePath, { force: true })
  }
}

try {
  for (const framework of ['react', 'vue']) {
    const target = path.join(workspace, `${framework}-app`)

    run(process.execPath, [cliPath, target, '--template', framework])
    assert.equal(existsSync(path.join(target, '.gitignore')), true)
    assert.equal(existsSync(path.join(target, '_gitignore')), false)

    const pkg = JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8'))
    assert.match(pkg.packageManager, /^pnpm@\d+\.\d+\.\d+$/)

    if (framework === 'react') {
      // Simulate a new clone with no generated routes or incremental artifacts.
      rmSync(path.join(target, 'src/routeTree.gen.ts'), { force: true })
      rmSync(path.join(target, 'node_modules/.tmp'), { recursive: true, force: true })
      rmSync(path.join(target, '.tanstack'), { recursive: true, force: true })
      run(pnpm, ['--dir', target, 'build'])
      assert.equal(existsSync(path.join(target, 'src/routeTree.gen.ts')), true)
      run(pnpm, ['--dir', target, 'check'])
      checkModalExtension(target)
      if (process.env.LVE_BROWSER_TESTS === '1') {
        run(pnpm, ['exec', 'playwright', 'install', '--with-deps', 'chromium'], target)
        run(pnpm, ['test:e2e'], target)
      }
    } else {
      run(pnpm, ['--dir', target, 'build'])
      run(pnpm, ['--dir', target, 'test:unit'])
    }
  }
} finally {
  rmSync(workspace, { recursive: true, force: true })
}
