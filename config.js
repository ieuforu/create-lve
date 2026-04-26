import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import pc from 'picocolors'
import * as p from '@clack/prompts'
import { execSync, spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getReactAppTemplate = (isUno) => {
  const logoClass = isUno
    ? 'animate-spin animate-duration-20s animate-linear animate-infinite'
    : 'animate-[spin_20s_linear_infinite]'

  return `
import { useState } from 'react'
import reactLogo from './assets/react.svg'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-7xl mx-auto p-8 text-center font-sans antialiased text-[#213547] dark:text-zinc-200 min-h-dvh flex flex-col justify-center items-center">
      <div className="flex justify-center gap-12 mb-12">
        <a href="https://viteplus.dev" target="_blank" rel="noreferrer" className="transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]">
          <img src="/favicon.svg" className="h-24 p-6" alt="VitePlus logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer" className="transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]">
          <img src={reactLogo} className="h-24 p-6 ${logoClass}" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold leading-[1.1] mb-8">VitePlus + React</h1>
      <div className="p-8 space-y-4 flex flex-col items-center">
        <button onClick={() => setCount((count) => count + 1)} className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-[#f9f9f9] dark:bg-zinc-800 cursor-pointer transition-colors hover:border-[#646cff] outline-none">
          count is {count}
        </button>
      </div>
    </div>
  )
}
`.trim()
}

const FRAMEWORK_CONFIG = {
  next: {
    deps: (isUno) => ({
      devDependencies: isUno ? { unocss: 'latest' } : { tailwindcss: 'latest' },
    }),
  },
  react: {
    deps: (isUno) => ({
      devDependencies: isUno
        ? { unocss: 'latest' }
        : { tailwindcss: 'latest', '@tailwindcss/vite': 'latest' },

      pnpm: {
        overrides: {
          vite: 'npm:@voidzero-dev/vite-plus-core@latest',
          vitest: 'npm:@voidzero-dev/vite-plus-test@latest',
        },
      },
    }),
  },
  vue: {
    deps: (isUno) => FRAMEWORK_CONFIG.react.deps(isUno),
  },
}

const CSS_STRATEGIES = {
  unocss: {
    pluginImport: "import UnoCSS from 'unocss/vite'\n",
    pluginCode: 'UnoCSS(), ',
    entryImport: "import 'virtual:uno.css'\n",
    async setup(ctx) {
      const unoConfig = `
import { defineConfig, presetWind3, transformerCompileClass } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [
    {
      name: 'auto-uno-injector',
      enforce: 'pre',
      idFilter(id) { return /\\.[tj]sx$|\\.vue$/.test(id) },
      async transform(code) {
        const classRegex = /(?:class|className)=["']([^"']+)["']/g
        let match
        while ((match = classRegex.exec(code.original))) {
          const content = match[1]
          if (content.trim() && !content.includes(':uno:')) {
            const insertPos = match.index + match[0].indexOf(content)
            code.appendLeft(insertPos, ':uno: ')
          }
        }
      },
    },
    transformerCompileClass({ classPrefix: 'kfc-' }),
  ],
})`.trim()
      await fs.writeFile(path.join(ctx.targetDir, 'uno.config.ts'), unoConfig + '\n')
      const stylePath = path.join(ctx.targetDir, 'src/style.css')
      if (fs.existsSync(stylePath)) await fs.remove(stylePath)
    },
  },
  tailwind: {
    pluginImport: "import tailwindcss from '@tailwindcss/vite'\n",
    pluginCode: 'tailwindcss(), ',
    entryImport: "import './style.css'\n",
    async setup(ctx) {
      const stylePath = path.join(ctx.targetDir, 'src/style.css')
      await fs.ensureDir(path.dirname(stylePath))
      await fs.writeFile(stylePath, `@import "tailwindcss";`)
    },
  },
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
  pkg.devDependencies = { ...pkg.devDependencies, ...extraConfig.devDependencies }
  if (extraConfig.pnpm) pkg.pnpm = { ...pkg.pnpm, ...extraConfig.pnpm }
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  if (isNext) return

  const strategy = CSS_STRATEGIES[css]
  const isVue = framework === 'vue'
  const paths = {
    main: path.join(targetDir, isVue ? 'src/main.ts' : 'src/main.tsx'),
    vite: path.join(targetDir, 'vite.config.ts'),
    app: path.join(targetDir, isVue ? 'src/App.vue' : 'src/App.tsx'),
  }

  if (framework === 'react') {
    await fs.writeFile(paths.app, getReactAppTemplate(isUno))
  }

  let viteContent = await fs.readFile(paths.vite, 'utf-8')
  viteContent = strategy.pluginImport + viteContent
  viteContent = viteContent.replace('/* VITE_PLUS_PLUGINS */', strategy.pluginCode)
  await fs.writeFile(paths.vite, viteContent)

  let mainContent = await fs.readFile(paths.main, 'utf-8')
  await fs.writeFile(paths.main, strategy.entryImport + mainContent)

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

async function installDependencies(ctx, s) {
  s.stop(pc.cyan(`准备安装依赖...`))
  try {
    await runTask(ctx.pkgManager, ['install'], ctx.targetDir)

    s.start(pc.green(`正在执行 ${ctx.fmtCmd} 优化代码结构...`))
    await new Promise((r) => setTimeout(r, 300))

    const [cmd, ...args] = ctx.fmtCmd.split(' ')
    await runTask(cmd, args, ctx.targetDir)
  } catch (err) {
    p.log.warn('自动安装或格式化失败，请稍后手动尝试', err)
    throw err
  }
}

export { __dirname, runTask, applyProjectTransform, cleanupTemplate, installDependencies }
