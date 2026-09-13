#!/usr/bin/env node

import * as p from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'node:path'
import {
  __dirname,
  applyProjectTransform,
  cleanupTemplate,
  getPnpmVersion,
  installDependencies,
} from './config.js'

const { version } = fs.readJsonSync(new URL('./package.json', import.meta.url))
const templates = [
  { value: 'react', label: 'React', hint: 'TanStack Router · React Query · Tailwind CSS' },
  { value: 'vue', label: 'Vue', hint: 'Vue Router · Pinia · Reka UI · Tailwind CSS' },
]
const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY)

class Cancelled extends Error {}

function parseArgs(args) {
  const flags = { install: true }
  const positional = []
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--') {
      positional.push(...args.slice(i + 1))
      break
    }
    if (arg === '--default') flags.default = true
    else if (arg === '--no-install') flags.install = false
    else if (arg === '--help' || arg === '-h') flags.help = true
    else if (arg === '--version' || arg === '-v') flags.version = true
    else if (arg === '--template' || arg === '-t') flags.template = args[++i] ?? ''
    else if (arg.startsWith('--template=')) flags.template = arg.slice('--template='.length)
    else if (arg.startsWith('-'))
      throw new Error(`未知选项：${arg}。运行 create-lve --help 查看用法。`)
    else positional.push(arg)
  }
  if (positional.length > 1) throw new Error('一次只能创建一个项目，请只提供一个项目目录。')
  if (flags.template !== undefined && !templates.some((t) => t.value === flags.template)) {
    throw new Error('--template 需要指定 react 或 vue。')
  }
  return { flags, directory: positional[0] }
}

function printHelp() {
  console.log(`create-lve v${version}

用法：create-lve [项目目录] [选项]

  --default           使用默认目录和 React，已提供的目录或模板优先
  -t, --template <名>  指定 react 或 vue，跳过模板选择
  --no-install        只生成项目，稍后手动安装依赖
  -h, --help          查看帮助
  -v, --version       查看版本

示例：
  pnpm create lve
  pnpm create lve my-app
  pnpm create lve my-app --template vue
  pnpm create lve my-app --default --no-install

非空目录始终需要确认；选择保留或取消会直接结束。`)
}

function printIntro() {
  const mark = [
    pc.bgCyan(pc.black(' L ')),
    pc.bgMagenta(pc.black(' V ')),
    pc.bgYellow(pc.black(' E ')),
  ].join(' ')
  const width = process.stdout.columns ?? 80
  console.log()
  if (width < 40) {
    console.log(`  ${pc.bold(mark)}`)
    console.log(`  ${pc.dim(`create-lve v${version}`)}`)
  } else {
    console.log(`  ${pc.bold(mark)}  ${pc.dim(`create-lve v${version}`)}`)
  }
  if (width >= 48) {
    console.log(`  ${pc.dim('A fresh start for your next frontend.')}`)
  }
  console.log()
  p.intro('创建你的下一个项目')
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child)
  return (
    !relative ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  )
}

function validateDirectory(value) {
  if (!value?.trim()) return
  // Reject control characters as well as characters invalid in portable folder names.
  const folder = process.platform === 'win32' ? value.replace(/^[a-z]:[\\/]/i, '') : value
  const hasControl = [...value].some(
    (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
  )
  if (/[<>:"|?*]/.test(folder) || hasControl) return '目录包含非法字符，请换一个名称。'
  const target = path.resolve(value.trim())
  if (target === path.parse(target).root) return '请选择一个项目目录，不能使用磁盘根目录。'
  if (isWithin(__dirname, target) || isWithin(target, __dirname)) {
    return '请选择独立的项目目录，不能覆盖 create-lve 自身的安装目录。'
  }
  if (fs.existsSync(target) && !fs.lstatSync(target).isDirectory()) {
    return '该路径已被文件或符号链接占用，请换一个目录。'
  }
}

function answer(value) {
  if (p.isCancel(value)) throw new Cancelled('已取消创建。')
  return value
}

async function confirmOverwrite(targetDir) {
  if (!fs.existsSync(targetDir) || fs.readdirSync(targetDir).length === 0) return false
  if (!interactive)
    throw new Error(`目录非空：${targetDir}。请在交互终端确认清空，或换一个空目录。`)
  p.log.warn(`目录非空，清空会删除其中的所有内容：\n${targetDir}`)
  const overwrite = answer(
    await p.confirm({
      message: '是否清空这个目录？',
      active: '清空并继续',
      inactive: '保留并退出',
      initialValue: false,
    }),
  )
  if (!overwrite) throw new Cancelled('已保留原目录，创建结束。')
  return true
}

function packageName(targetDir) {
  const name = path
    .basename(targetDir)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[._-]+/, '')
    .slice(0, 214)
  return !name || ['node_modules', 'favicon.ico'].includes(name) ? 'lve-app' : name
}

function directoryCommand(targetDir) {
  const relative = path.relative(process.cwd(), targetDir)
  if (!relative) return []
  const directory = relative.startsWith('-') ? `.${path.sep}${relative}` : relative
  if (process.platform === 'win32')
    return [`Set-Location -LiteralPath '${directory.replaceAll("'", "''")}'`]
  const quoted = /^[a-zA-Z0-9_./-]+$/.test(directory)
    ? directory
    : `'${directory.replaceAll("'", "'\\''")}'`
  return [`cd ${quoted}`]
}

async function runStep(title, completed, task) {
  const spinner = interactive ? p.spinner({ indicator: 'timer' }) : undefined
  if (spinner) spinner.start(title)
  else p.log.step(title)
  try {
    const result = await task()
    if (spinner) spinner.stop(completed)
    return result
  } catch (error) {
    if (spinner && !spinner.isCancelled) spinner.error(`${title}失败`)
    throw error
  }
}

async function main() {
  const { flags, directory } = parseArgs(process.argv.slice(2))
  if (flags.help) return printHelp()
  if (flags.version) return console.log(version)
  if (!interactive && ((!directory && !flags.default) || (!flags.template && !flags.default))) {
    throw new Error('当前终端无法交互。请提供项目目录，并使用 --template react|vue 或 --default。')
  }

  printIntro()
  const defaultDirectory = `lve-app-${Math.random().toString(36).slice(2, 6)}`
  const projectPath =
    directory ??
    (flags.default
      ? defaultDirectory
      : answer(
          await p.text({
            message: '项目目录',
            placeholder: defaultDirectory,
            defaultValue: defaultDirectory,
            validate: validateDirectory,
          }),
        ))
  const invalid = validateDirectory(projectPath)
  if (invalid) throw new Error(invalid)
  if (!projectPath.trim()) throw new Error('项目目录不能为空。')
  const targetDir = path.resolve(projectPath.trim())
  if (directory || flags.default) p.log.step(`项目目录：${projectPath.trim()}`)
  const shouldOverwrite = await confirmOverwrite(targetDir)
  const framework =
    flags.template ??
    (flags.default
      ? 'react'
      : answer(
          await p.select({
            message: '选择模板',
            initialValue: 'react',
            options: templates,
          }),
        ))
  const ctx = {
    name: packageName(targetDir),
    framework,
    targetDir,
    templateDir: path.join(__dirname, `template-${framework}`),
    pkgManager: 'pnpm',
    fmtCmd: 'pnpm fmt',
  }
  if (!fs.existsSync(ctx.templateDir))
    throw new Error(`未找到 ${framework} 模板，请重新安装 create-lve。`)
  // Check the installer before making any changes to the target directory.
  if (flags.install) ctx.pnpmVersion = getPnpmVersion()

  p.note(
    [
      `模板  ${templates.find((t) => t.value === framework).label}`,
      `目录  ${targetDir}`,
      `包名  ${ctx.name}`,
      `依赖  ${flags.install ? '使用 pnpm 自动安装' : '稍后手动安装'}`,
    ].join('\n'),
    '项目配置',
  )

  const controller = new AbortController()
  const interrupt = () => controller.abort()
  process.once('SIGINT', interrupt)
  process.once('SIGTERM', interrupt)
  let ready = false
  let installed = false
  try {
    await runStep('生成项目文件', '项目文件已就绪', async () => {
      controller.signal.throwIfAborted()
      if (shouldOverwrite) await fs.emptyDir(targetDir)
      controller.signal.throwIfAborted()
      await fs.ensureDir(targetDir)
      await fs.copy(ctx.templateDir, targetDir, {
        filter: (source) =>
          !['node_modules', 'dist', '.git', 'pnpm-lock.yaml'].includes(
            path.relative(ctx.templateDir, source).split(path.sep)[0],
          ),
      })
      controller.signal.throwIfAborted()
      await cleanupTemplate(ctx)
      await applyProjectTransform(ctx)
      ready = true
    })
    if (flags.install) {
      await installDependencies(ctx, {
        signal: controller.signal,
        onStep: async (title, completed, task) => {
          await runStep(title, completed, task)
          installed = true
        },
      })
    }
    controller.signal.throwIfAborted()
    p.note(
      [
        ...directoryCommand(targetDir),
        ...(!flags.install ? ['pnpm install', 'pnpm fmt'] : []),
        'pnpm dev',
      ].join('\n'),
      process.platform === 'win32' ? '开始开发（PowerShell）' : '开始开发',
    )
    p.outro(
      pc.green(
        flags.install ? '项目创建完成，开始构建吧。' : '项目文件已生成，安装依赖后即可启动。',
      ),
    )
  } catch (error) {
    if (controller.signal.aborted) p.cancel('已停止创建。')
    else p.log.error(error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.output && !controller.signal.aborted)
      p.note(error.output, '命令输出（末尾）')
    if (fs.existsSync(targetDir)) p.log.warn(`已保留项目目录：${targetDir}`)
    if (ready) {
      p.note(
        [
          ...directoryCommand(targetDir),
          ...(!installed ? ['pnpm install'] : []),
          'pnpm fmt',
          'pnpm dev',
        ].join('\n'),
        process.platform === 'win32' ? '手动继续（PowerShell）' : '手动继续',
      )
    }
    process.exitCode = controller.signal.aborted ? 130 : 1
  } finally {
    process.removeListener('SIGINT', interrupt)
    process.removeListener('SIGTERM', interrupt)
  }
}

main().catch((error) => {
  if (error instanceof Cancelled) p.cancel(error.message)
  else {
    p.log.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
})
