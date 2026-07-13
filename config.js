import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import pc from 'picocolors'
import * as p from '@clack/prompts'
import { execSync, spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BASE_STYLE = `@layer base {
  /* Scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  .dark * {
    scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
  }

  /* 文本渲染 */
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* 选中色 */
  ::selection {
    background: rgba(59, 130, 246, 0.2);
  }

  /* 触摸优化 */
  body {
    -webkit-tap-highlight-color: transparent;
  }
}

/* 链接和图片禁止拖拽 + 长按菜单 + 点击高亮 */
a,
img {
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* input number 去掉上下箭头 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* textarea 禁止拖拽调整大小 */
textarea {
  resize: none;
}

/* details/summary 去掉默认三角 */
summary {
  list-style: none;
}
summary::marker {
  display: none;
  content: '';
}

/* focus 焦点环 */
a:focus-visible {
  outline: 2px solid var(--color-primary, #3b82f6);
  outline-offset: 2px;
  border-radius: 2px;
}
`

const vitePlusDeps = (isUno) => ({
  dependencies: isUno ? { '@unocss/reset': 'latest' } : undefined,
  devDependencies: isUno ? { unocss: 'latest' } : undefined,
  overrides: {
    vite: 'npm:@voidzero-dev/vite-plus-core@latest',
    vitest: 'npm:@voidzero-dev/vite-plus-test@latest',
  },
})

const FRAMEWORK_CONFIG = {
  react: { deps: vitePlusDeps },
  vue: { deps: vitePlusDeps },
}

const CSS_STRATEGIES = {
  unocss: {
    pluginImport: "import UnoCSS from 'unocss/vite'\n",
    pluginCode: 'UnoCSS(), ',
    entryImport: "import '@unocss/reset/tailwind.css'\nimport 'virtual:uno.css'\n",
    async setup(ctx) {
      const unoConfig = `
import {
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
            // return createHash('md5').update(str).digest('hex').slice(0, 8)
            const hash = createHash('md5').update(str).digest('hex').slice(0, 8)
            return /^\\d/.test(hash) ? 'v' + hash.slice(1, 8) : hash.slice(0, 8)
          },
          keepUnknown: true,
        }),
      ]
    : []) as SourceCodeTransformer[],
})

`.trim()
      await fs.writeFile(path.join(ctx.targetDir, 'uno.config.ts'), unoConfig + '\n')

      const tsconfigPath = path.join(ctx.targetDir, 'tsconfig.node.json')
      if (fs.existsSync(tsconfigPath)) {
        try {
          let content = await fs.readFile(tsconfigPath, 'utf-8')

          if (content.includes('/* UNO_CONFIG */')) {
            content = content.replace('/* UNO_CONFIG */', ', "uno.config.ts"')
            await fs.writeFile(tsconfigPath, content)
          }
        } catch {}
      }

      const stylePath = path.join(ctx.targetDir, 'src/style.css')
      if (fs.existsSync(stylePath)) await fs.remove(stylePath)
    },
  },
  tailwind: {
    pluginImport: "import tailwindcss from '@tailwindcss/vite'\n",
    pluginCode: 'tailwindcss(), ',
    entryImport: "import './style.css'\n",
    async setup(ctx) {
      // style.css 已由 applyProjectTransform 写入，此处仅兜底
      const stylePath = path.join(ctx.targetDir, 'src/style.css')
      if (!fs.existsSync(stylePath)) {
        await fs.ensureDir(path.dirname(stylePath))
        await fs.writeFile(stylePath, `@import "tailwindcss";`)
      }
    },
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

    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)),
    )
  })
}

async function applyProjectTransform(ctx) {
  const { targetDir, framework, css, isUno } = ctx

  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)
  const config = FRAMEWORK_CONFIG[framework]
  pkg.name = ctx.name
  const extraConfig = config.deps(isUno)
  pkg.dependencies = { ...pkg.dependencies, ...extraConfig.dependencies }
  pkg.devDependencies = { ...pkg.devDependencies, ...extraConfig.devDependencies }
  if (isUno) {
    delete pkg.devDependencies?.['tailwindcss']
    delete pkg.devDependencies?.['@tailwindcss/vite']
  }
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

  const strategy = CSS_STRATEGIES[css]
  const isVue = framework === 'vue'
  const paths = {
    main: path.join(targetDir, isVue ? 'src/main.ts' : 'src/main.tsx'),
    vite: path.join(targetDir, 'vite.config.ts'),
  }

  let viteContent = await fs.readFile(paths.vite, 'utf-8')
  if (!viteContent.includes(strategy.pluginImport.trim())) {
    viteContent = strategy.pluginImport + viteContent
  }
  viteContent = viteContent.replace('/* VITE_PLUS_PLUGINS */', strategy.pluginCode)
  await fs.writeFile(paths.vite, viteContent)

  let mainContent = await fs.readFile(paths.main, 'utf-8')
  if (!mainContent.includes(strategy.entryImport.trim())) {
    mainContent = strategy.entryImport + mainContent
  }
  await fs.writeFile(paths.main, mainContent)

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
