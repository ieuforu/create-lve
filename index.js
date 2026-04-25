#!/usr/bin/env node

import * as p from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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

async function main() {
  console.clear()
  const logo = `
    ${pc.cyan('█    █  █ █▀▀▀')}
    ${pc.cyan('█    █  █ █▀▀ ')} 
    ${pc.cyan('█▄▄▄  ▀▄▀ █▄▄▄')}  ${pc.gray('THE ULTRA-FAST FRONTEND STACK')}
  `
  console.log(logo)
  p.intro(`${pc.bgCyan(pc.black(' LVE-CLI '))}`)

  const project = await p.group({
    path: () => p.text({
      message: '项目名称',
      placeholder: 'my-app',
      defaultValue: 'my-app',
      validate: (value) => {
        if (!value || value.length === 0) return
        if (value.match(/[<>:"|?*]/)) return '路径包含非法字符'
      },
    }),
    shouldOverwrite: ({ results }) => {
      const targetDir = path.resolve(process.cwd(), results.path)
      if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
        return p.confirm({ message: `目录已存在，是否清空？`, initialValue: false })
      }
    },
    framework: () => p.select({
      message: '选择框架',
      options: [
        { value: 'next', label: 'Next.js 16', hint: 'React 19 + Tailwind v4 + Base UI' },
        { value: 'react', label: 'React 19', hint: 'VitePlus + Compiler' },
        { value: 'vue', label: 'Vue 3', hint: 'VitePlus + Optimized' },
      ],
    }),
    cssEngine: ({ results }) => {
      if (results.framework === 'next') return;
      return p.select({
        message: '选择 CSS',
        options: [
          { value: 'unocss', label: 'UnoCSS', hint: '⚡️ 战机级性能' },
          { value: 'tailwind', label: 'Tailwind v4', hint: '🛡️ 装甲级稳定' },
        ],
      })
    },
    install: () => p.confirm({ message: '是否现在自动安装依赖？', initialValue: true }),
  }, {
    onCancel: () => { p.cancel('操作取消'); process.exit(0) }
  })
  if (!project) process.exit(0)

  const targetDir = path.resolve(process.cwd(), project.path)
  const templateDir = path.resolve(__dirname, `template-${project.framework}`)
  const isNext = project.framework === 'next'
  const isUno = project.cssEngine === 'unocss'
  const s = p.spinner()

  if (!isNext) {
    try {
      execSync('vp --version', { stdio: 'ignore' })
    } catch {
      p.log.error(pc.red('未检测到 VitePlus (vp) 环境'))
      p.note(
        pc.white(
          `React/Vue 模板依赖 vp 工具链:\n${pc.cyan('https://viteplus.dev/guide')}`
        ),
        '环境缺失'
      )
      process.exit(1)
    }
  }

  s.start('🛠️  正在按需装配架构...')

  try {
    if (project.shouldOverwrite) await fs.emptyDir(targetDir)
    else await fs.ensureDir(targetDir)
    await fs.copy(templateDir, targetDir)

    await fs.remove(path.join(targetDir, 'pnpm-workspace.yaml'))

    try { execSync('git init', { cwd: targetDir, stdio: 'ignore' }) } catch { }

    const oldGit = path.join(targetDir, '_gitignore')
    if (fs.existsSync(oldGit)) await fs.move(oldGit, path.join(targetDir, '.gitignore'))

    const pkgPath = path.join(targetDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)
    pkg.name = path.basename(targetDir)

    if (isUno) {
      pkg.devDependencies['unocss'] = 'latest'
    } else {
      pkg.devDependencies['tailwindcss'] = 'latest'
      if (!isNext) pkg.devDependencies['@tailwindcss/vite'] = 'latest'
    }

    if (!isNext) {
      pkg.pnpm = {
        ...pkg.pnpm,
        overrides: {
          vite: 'npm:@voidzero-dev/vite-plus-core@latest',
          vitest: 'npm:@voidzero-dev/vite-plus-test@latest',
        },
      }
    }
    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    if (isNext) {
      s.message(pc.green('检测到 Next.js 架构，正在同步核心配置...'))
    } else {
      const mainFile = project.framework === 'vue' ? 'src/main.ts' : 'src/main.tsx'
      const mainPath = path.join(targetDir, mainFile)
      const viteConfigPath = path.join(targetDir, 'vite.config.ts')
      const stylePath = path.join(targetDir, 'src/style.css')
      const appFile = project.framework === 'vue' ? 'src/App.vue' : 'src/App.tsx'
      const appPath = path.join(targetDir, appFile)

      let mainContent = await fs.readFile(mainPath, 'utf-8')
      let viteContent = await fs.readFile(viteConfigPath, 'utf-8')

      if (project.framework === 'react') {
        await fs.writeFile(appPath, getReactAppTemplate(isUno))
      }

      const pluginCode = isUno ? 'UnoCSS()' : 'tailwindcss()'
      const pluginImport = isUno ? "import UnoCSS from 'unocss/vite'\n" : "import tailwindcss from '@tailwindcss/vite'\n"

      viteContent = pluginImport + viteContent
      viteContent = viteContent.replace('/* VITE_PLUS_PLUGINS */', `${pluginCode}, `)

      if (isUno) {
        const unoConfig = `import { defineConfig, presetWind3, transformerCompileClass } from 'unocss'

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
    transformerCompileClass({
      classPrefix: 'kfc-',
    }),
  ],
})\n`

        await fs.writeFile(path.join(targetDir, 'uno.config.ts'), unoConfig)

        mainContent = `import 'virtual:uno.css'\n` + mainContent
        if (fs.existsSync(stylePath)) await fs.remove(stylePath)
      } else {
        await fs.writeFile(stylePath, `@import "tailwindcss";`)
        mainContent = `import './style.css'\n` + mainContent
      }
      await fs.writeFile(mainPath, mainContent)
      await fs.writeFile(viteConfigPath, viteContent)
    }

    const toRemove = ['pnpm-lock.yaml', 'node_modules', 'dist']
    await Promise.all(toRemove.map((file) => fs.remove(path.join(targetDir, file))))

    const pkgManager = isNext ? 'pnpm' : 'vp'
    const devCmd = isNext ? 'pnpm dev' : 'vp dev'
    const fmtCmd = isNext ? 'pnpm fmt' : 'vp fmt'

    if (project.install) {
      s.message(pc.green(`正在执行 ${pkgManager} install`))
      try {
        await new Promise((resolve, reject) => {
          const child = spawn(pkgManager, ['install'], {
            cwd: targetDir,
            stdio: 'ignore',
            shell: process.platform === 'win32',
          })
          child.on('close', (code) => code === 0 ? resolve() : reject())
        })

        s.message(pc.green(`正在执行 ${fmtCmd} 优化代码结构`))
        await new Promise((r) => setTimeout(r, 500))
        try { execSync(fmtCmd, { cwd: targetDir, stdio: 'ignore' }) } catch { }
      } catch (err) {
        p.log.warn('自动安装失败，请手动执行安装')
      }
    }

    s.stop(pc.green('全套环境装配就绪'))

    const nextSteps = project.install ? `cd ${project.path}\n${devCmd}` : `cd ${project.path}\n${pkgManager} install\n${devCmd}`
    p.note(pc.cyan(nextSteps), '快速开始')
    p.outro(pc.magenta('✨ 已经为你准备好了极致的开发环境!'))

  } catch (err) {
    s.stop(pc.red('手术失败'))
    console.error(err)
    process.exit(1)
  }
}

main()