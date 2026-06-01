import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import pc from 'picocolors'
import * as p from '@clack/prompts'
import { execSync, spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FRAMEWORK_CONFIG = {
  next: {
    deps: (isUno) => ({
      devDependencies: isUno ? { unocss: 'latest' } : { tailwindcss: 'latest' },
    }),
  },
  react: {
    deps: (isUno) => ({
      dependencies: isUno ? { '@unocss/reset': 'latest' } : {},
      devDependencies: isUno ? { unocss: 'latest' } : {},
    }),
  },
  vue: {
    deps: (isUno) => FRAMEWORK_CONFIG.react.deps(isUno),
  },
}

const CSS_STRATEGIES = {
  unocss: {
    pluginImport: '',
    pluginCode: '',
    entryImport: '',
    async setup(ctx) {
      // Replace tailwindcss with UnoCSS in vite.config.ts
      const vitePath = path.join(ctx.targetDir, 'vite.config.ts')
      let viteContent = await fs.readFile(vitePath, 'utf-8')
      viteContent = viteContent.replace(
        "import tailwindcss from '@tailwindcss/vite'",
        "import UnoCSS from 'unocss/vite'",
      )
      viteContent = viteContent.replace('tailwindcss(),', 'UnoCSS(),')
      await fs.writeFile(vitePath, viteContent)

      // Replace style.css import with UnoCSS imports in main.tsx
      const mainPath = path.join(ctx.targetDir, 'src/app/main.tsx')
      let mainContent = await fs.readFile(mainPath, 'utf-8')
      mainContent = mainContent.replace(
        "import '@/style.css'",
        "import '@unocss/reset/tailwind.css'\nimport 'virtual:uno.css'",
      )
      await fs.writeFile(mainPath, mainContent)

      // Write UnoCSS config
      const unoConfig = `import {
  defineConfig,
  presetWind3,
  transformerCompileClass,
  type SourceCodeTransformer,
} from 'unocss'
import { createHash } from 'node:crypto'

declare const process: { env: { NODE_ENV: string } }
const isBuild = process.env.NODE_ENV === 'production'

export default defineConfig({
  presets: [presetWind3()],
  transformers: (isBuild
    ? [
        {
          name: 'auto-uno-injector',
          enforce: 'pre',
          idFilter(id) {
            return /\\.[tj]sx$|\\.vue$/.test(id)
          },
          async transform(code) {
            const s = code as any
            const classRegex = /(?:class|className)=["']([^"']+)["']/g
            let match
            while ((match = classRegex.exec(s.original))) {
              const content = match[1]
              if (content.trim() && !content.includes(':uno:')) {
                const insertPos = match.index + match[0].indexOf(content)
                s.appendLeft(insertPos, ':uno: ')
              }
            }
          },
        },
        transformerCompileClass({
          classPrefix: '',
          hashFn: (str) => {
            const hash = createHash('md5').update(str).digest('hex').slice(0, 8)
            return /^\\d/.test(hash) ? 'v' + hash.slice(1, 8) : hash.slice(0, 8)
          },
          keepUnknown: true,
        }),
      ]
    : []) as SourceCodeTransformer[],
})
`
      await fs.writeFile(path.join(ctx.targetDir, 'uno.config.ts'), unoConfig)

      // Remove Tailwind style.css
      const stylePath = path.join(ctx.targetDir, 'src/style.css')
      if (fs.existsSync(stylePath)) await fs.remove(stylePath)
    },
  },
  tailwind: {
    pluginImport: '',
    pluginCode: '',
    entryImport: '',
    async setup() {},
  },
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

    child.on('close', (code) => (code === 0 ? resolve() : reject()))
  })
}

async function applyProjectTransform(ctx) {
  const { targetDir, framework, css, isUno, isNext } = ctx

  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)
  const config = FRAMEWORK_CONFIG[framework]
  pkg.name = ctx.name
  const extraConfig = config.deps(isUno)
  pkg.dependencies = { ...pkg.dependencies, ...extraConfig.dependencies }
  pkg.devDependencies = { ...pkg.devDependencies, ...extraConfig.devDependencies }
  if (extraConfig.pnpm) pkg.pnpm = { ...pkg.pnpm, ...extraConfig.pnpm }
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  await resolveLatestVersions(pkgPath)

  if (isNext) return

  const strategy = CSS_STRATEGIES[css]
  await strategy.setup(ctx)
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
