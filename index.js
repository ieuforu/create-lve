#!/usr/bin/env node

import * as p from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'node:path'
import { __dirname, applyProjectTransform, cleanupTemplate, installDependencies } from './config.js'

const version = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
).version

function parseArgs() {
  const args = process.argv.slice(2)
  const flags = {}
  const positional = []
  for (const arg of args) {
    if (arg === '--default') flags.default = true
    else if (!arg.startsWith('-')) positional.push(arg)
  }
  return { flags, positional }
}

function randomName() {
  const hash = Math.random().toString(36).slice(2, 6)
  return `lve-app-${hash}`
}

function onCancel() {
  p.cancel('操作取消')
  process.exit(0)
}

async function main() {
  const { flags, positional } = parseArgs()
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1J')
  console.clear()
  const W = 30
  const __s = (s) => s.replace(/\x1b\[[0-9;]*m/g, '')
  const __p = (s, w) => s + ' '.repeat(Math.max(0, w - __s(s).length))
  const __b = (c, t) => pc.bold(pc['bg' + c](pc.black(t)))
  const _l1 = '  ' + __b('Cyan', ' L ') + '  ' + __b('Magenta', ' V ') + '  ' + __b('Yellow', ' E ') + '   ' + pc.dim('ULTRA-FAST')
  const _l2 = '  ' + pc.dim('FRONTEND STACK')
  const _border = pc.cyan('─'.repeat(W))
  const logo = `
  ${pc.cyan('╭')}${_border}${pc.cyan('╮')}
  ${pc.cyan('│')}${__p(_l1, W)}${pc.cyan('│')}
  ${pc.cyan('│')}${__p(_l2, W)}${pc.cyan('│')}
  ${pc.cyan('╰')}${_border}${pc.cyan('╯')}
  `

  console.log(logo)
  p.intro(`${pc.bgCyan(pc.black(` LVE-CLI v${version} `))}`)

  let project

  if (flags.default) {
    // --default: React + Tailwind，跳过所有 prompt
    const name = positional[0] || randomName()
    const targetDir = path.resolve(process.cwd(), name)
    let shouldOverwrite = false
    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      shouldOverwrite = await p.confirm({ message: `目录已存在，是否清空？`, initialValue: false })
      if (p.isCancel(shouldOverwrite)) onCancel()
    }
    project = { path: name, framework: 'react-tanstackrouter', shouldOverwrite }
  } else {
    // 交互模式
    project = await p.group(
      {
        path: () =>
          p.text({
            message: '项目名称',
            placeholder: 'your-project-name',
            defaultValue: randomName(),
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
            message: '选择模板',
            options: [
              {
                value: 'react-tanstackrouter',
                label: 'React · TanStack Router',
                hint: '文件路由 + 类型安全 + React Query',
              },
              {
                value: 'react',
                label: 'React · React Router',
                hint: '经典方案，社区生态最丰富',
              },
              {
                value: 'vue',
                label: 'Vue 3',
                hint: '轻量渐进式框架',
              },
            ],
          }),
      },
      { onCancel },
    )
  }

  const ctx = {
    name: project.path,
    framework: project.framework,
    targetDir: path.resolve(process.cwd(), project.path),
    templateDir: path.resolve(__dirname, `template-${project.framework}`),
    pkgManager: 'pnpm',
    devCmd: 'pnpm dev',
    fmtCmd: project.framework === 'react-tanstackrouter' ? 'pnpm fmt' : 'vp fmt',
  }

  const s = p.spinner()

  try {
    if (project.shouldOverwrite) await fs.emptyDir(ctx.targetDir)
    await fs.ensureDir(ctx.targetDir)
    await fs.copy(ctx.templateDir, ctx.targetDir)
    await cleanupTemplate(ctx)
    await applyProjectTransform(ctx)

    s.start('Installing dependencies')
    await installDependencies(ctx)
    s.stop()
    console.log(pc.green(`→ Next: cd ${ctx.name} && ${ctx.devCmd}`))
  } catch (err) {
    s.stop(pc.red('Failed'))

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
