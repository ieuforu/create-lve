#!/usr/bin/env node

import * as p from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { __dirname, applyProjectTransform, cleanupTemplate, installDependencies } from './config.js'

async function main() {
  console.clear()
  const logo = `
    ${pc.cyan('█    █  █ █▀▀▀')}
    ${pc.cyan('█    █  █ █▀▀ ')} 
    ${pc.cyan('█▄▄▄  ▀▄▀ █▄▄▄')}  ${pc.gray('THE ULTRA-FAST FRONTEND STACK')}
  `
  console.log(logo)
  p.intro(`${pc.bgCyan(pc.black(' LVE-CLI '))}`)

  const project = await p.group(
    {
      path: () =>
        p.text({
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
      framework: () =>
        p.select({
          message: '选择框架',
          options: [
            { value: 'next', label: 'Next.js 16', hint: 'React 19 + Tailwind v4 + Shadcn UI' },
            { value: 'react', label: 'React 19', hint: 'VitePlus + Compiler' },
            { value: 'vue', label: 'Vue 3', hint: 'VitePlus + Optimized' },
          ],
        }),
      cssEngine: ({ results }) => {
        if (results.framework === 'next') return
        return p.select({
          message: '选择 CSS',
          options: [
            { value: 'unocss', label: 'UnoCSS', hint: '⚡️ 战机级性能' },
            { value: 'tailwind', label: 'Tailwind v4', hint: '🛡️ 装甲级稳定' },
          ],
        })
      },
      install: () => p.confirm({ message: '是否现在自动安装依赖？', initialValue: true }),
    },
    {
      onCancel: () => {
        p.cancel('操作取消')
        process.exit(0)
      },
    },
  )

  const ctx = {
    name: project.path,
    framework: project.framework,
    css: project.cssEngine,
    shouldInstall: project.install,
    targetDir: path.resolve(process.cwd(), project.path),
    templateDir: path.resolve(__dirname, `template-${project.framework}`),
    isNext: project.framework === 'next',
    isUno: project.cssEngine === 'unocss',
    pkgManager: project.framework === 'next' ? 'pnpm' : 'vp',
    devCmd: project.framework === 'next' ? 'pnpm dev' : 'vp dev',
    fmtCmd: project.framework === 'next' ? 'pnpm fmt' : 'vp fmt',
  }

  const s = p.spinner()

  if (!ctx.isNext) {
    try {
      execSync('vp --version', { stdio: 'ignore' })
    } catch {
      p.log.error(pc.red('未检测到 VitePlus (vp) 环境'))
      p.note(
        pc.white(`React/Vue 模板依赖 vp 工具链:\n${pc.cyan('https://viteplus.dev/guide')}`),
        '环境缺失',
      )
      process.exit(1)
    }
  }

  s.start('🛠️  正在按需装配架构...')

  try {
    if (project.shouldOverwrite) await fs.emptyDir(ctx.targetDir)
    await fs.ensureDir(ctx.targetDir)
    await fs.copy(ctx.templateDir, ctx.targetDir)

    await cleanupTemplate(ctx)

    await applyProjectTransform(ctx)

    if (ctx.shouldInstall) {
      await installDependencies(ctx, s)
    }

    s.stop(pc.green('全套环境装配就绪'))

    const nextSteps = ctx.shouldInstall
      ? `cd ${ctx.name}\n${ctx.devCmd}`
      : `cd ${ctx.name}\n${ctx.pkgManager} install\n${ctx.devCmd}`

    p.note(pc.cyan(nextSteps), '下一步操作')
    p.outro(pc.magenta('✨ 已经为你准备好了极致的开发环境!'))
  } catch (err) {
    s.stop(pc.red('手术失败'))

    if (ctx && ctx.targetDir && fs.existsSync(ctx.targetDir)) {
      p.log.warn(pc.yellow(`正在清理残留文件: ${ctx.targetDir}...`))
      try {
        fs.removeSync(ctx.targetDir)
      } catch (cleanErr) {
        p.log.error(pc.red('清理残留文件失败，请手动删除', cleanErr))
      }
    }

    console.error(err)
    process.exit(1)
  }
}

main()
