import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stripVTControlCharacters } from 'node:util'
import fs from 'fs-extra'
import { execSync, spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runTask(command, args, cwd, { signal } = {}) {
  return new Promise((resolve, reject) => {
    let output = ''
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      signal,
    })
    const capture = (chunk) => {
      output = (output + chunk).slice(-8000)
    }
    child.stdout.setEncoding('utf8').on('data', capture)
    child.stderr.setEncoding('utf8').on('data', capture)
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) return resolve()
      const error = new Error(
        `${command} ${args.join(' ')} 执行失败${code === null ? '' : `（退出码 ${code}）`}。`,
      )
      error.output = stripVTControlCharacters(output).trim().split('\n').slice(-12).join('\n')
      reject(error)
    })
  })
}

function getPnpmVersion() {
  try {
    return execSync('pnpm --version', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch {
    throw new Error('未找到可用的 pnpm。请先安装 pnpm，或添加 --no-install 仅生成项目文件。')
  }
}

async function applyProjectTransform(ctx) {
  const { targetDir } = ctx

  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)
  pkg.name = ctx.name
  if (ctx.pnpmVersion) pkg.packageManager = `pnpm@${ctx.pnpmVersion}`
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  const indexPath = path.join(targetDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    let indexContent = await fs.readFile(indexPath, 'utf-8')
    indexContent = indexContent.replace(/<title>.*?<\/title>/, `<title>${ctx.name}</title>`)
    await fs.writeFile(indexPath, indexContent)
  }
}

async function cleanupTemplate(ctx) {
  const toRemove = ['pnpm-lock.yaml', 'node_modules', 'dist']
  await Promise.all(toRemove.map((file) => fs.remove(path.join(ctx.targetDir, file))))

  try {
    execSync('git init', { cwd: ctx.targetDir, stdio: 'ignore' })
  } catch {}

  const oldGit = path.join(ctx.targetDir, '_gitignore')
  if (fs.existsSync(oldGit)) {
    await fs.move(oldGit, path.join(ctx.targetDir, '.gitignore'))
  }
}

async function installDependencies(
  ctx,
  { signal, onStep = (_title, _completed, task) => task() } = {},
) {
  await onStep('安装依赖', '依赖已安装', () =>
    runTask(ctx.pkgManager, ['install'], ctx.targetDir, { signal }),
  )
  await onStep('格式化代码', '代码已格式化', async () => {
    const [cmd, ...args] = ctx.fmtCmd.split(' ')
    await runTask(cmd, args, ctx.targetDir, { signal })
  })
}

export {
  __dirname,
  runTask,
  getPnpmVersion,
  applyProjectTransform,
  cleanupTemplate,
  installDependencies,
}
