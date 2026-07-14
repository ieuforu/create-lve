import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import pc from 'picocolors'
import * as p from '@clack/prompts'
import { execSync, spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const vitePlusDeps = () => ({
  overrides: {
    vite: 'npm:@voidzero-dev/vite-plus-core@latest',
    vitest: 'npm:@voidzero-dev/vite-plus-test@latest',
  },
})

const FRAMEWORK_CONFIG = {
  react: { deps: vitePlusDeps },
  'react-tanstackrouter': { deps: () => ({}) },
  vue: { deps: vitePlusDeps },
}

async function resolveLatestVersions(pkgPath) {
  const pkg = await fs.readJson(pkgPath)
  const sections = ['dependencies', 'devDependencies']

  for (const section of sections) {
    if (!pkg[section]) continue
    for (const [name, version] of Object.entries(pkg[section])) {
      if (version === 'latest') {
        try {
          const resolved = execSync(`npm view ${name} version`, {
            encoding: 'utf-8',
            timeout: 10000,
          }).trim()
          pkg[section][name] = `^${resolved}`
        } catch {
          // resolution failed, keep latest
        }
      }
    }
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })
}

async function runTask(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'ignore',
      shell: process.platform === 'win32',
    })

    child.on('error', (err) => {
      console.error(pc.red(`无法启动命令: ${command}`), err)
      reject(err)
    })

    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)),
    )
  })
}

async function applyProjectTransform(ctx) {
  const { targetDir, framework } = ctx

  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)
  const config = FRAMEWORK_CONFIG[framework]
  pkg.name = ctx.name
  const extraConfig = config.deps()
  if (extraConfig.dependencies) pkg.dependencies = { ...pkg.dependencies, ...extraConfig.dependencies }
  if (extraConfig.devDependencies) pkg.devDependencies = { ...pkg.devDependencies, ...extraConfig.devDependencies }
  if (extraConfig.overrides) pkg.overrides = { ...pkg.overrides, ...extraConfig.overrides }
  try {
    const version = execSync('pnpm --version', { encoding: 'utf-8', timeout: 5000 }).trim()
    pkg.packageManager = `pnpm@${version}`
  } catch {}
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  await resolveLatestVersions(pkgPath)

  const indexPath = path.join(targetDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    let indexContent = await fs.readFile(indexPath, 'utf-8')
    indexContent = indexContent.replace(/<title>.*?<\/title>/, `<title>${ctx.name}</title>`)
    await fs.writeFile(indexPath, indexContent)
  }
}

async function cleanupTemplate(ctx) {
  const toRemove = ['pnpm-workspace.yaml', 'pnpm-lock.yaml', 'node_modules', 'dist']
  await Promise.all(toRemove.map((file) => fs.remove(path.join(ctx.targetDir, file))))

  try {
    execSync('git init', { cwd: ctx.targetDir, stdio: 'ignore' })
  } catch {}

  const oldGit = path.join(ctx.targetDir, '_gitignore')
  if (fs.existsSync(oldGit)) {
    await fs.move(oldGit, path.join(ctx.targetDir, '.gitignore'))
  }
}

async function installDependencies(ctx) {
  try {
    await runTask(ctx.pkgManager, ['install'], ctx.targetDir)
    const [cmd, ...args] = ctx.fmtCmd.split(' ')
    await runTask(cmd, args, ctx.targetDir)
  } catch (err) {
    p.log.warn('自动安装或格式化失败，请稍后手动尝试', err)
    throw err
  }
}

export { __dirname, runTask, applyProjectTransform, cleanupTemplate, installDependencies }
