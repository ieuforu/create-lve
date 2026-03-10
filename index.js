#!/usr/bin/env node

import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.clear();

  p.intro(`${pc.bgCyan(pc.black(' LVE-CLI '))}${pc.gray(' - 快速构建 React + Tailwind 项目')}`);

  const project = await p.group(
    {
      path: () =>
        p.text({
          message: '项目存储路径?',
          placeholder: './lve-project',
          defaultValue: 'lve-project',
        }),
      shouldOverwrite: ({ results }) => {
        const targetDir = path.resolve(process.cwd(), results.path);
        if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
          return p.confirm({
            message: `⚠️  目录 ${pc.yellow(results.path)} 已存在且不为空，是否清空？`,
            initialValue: false,
          });
        }
      },
    },
    {
      onCancel: () => {
        p.cancel('已取消操作');
        process.exit(0);
      },
    }
  );

  if (project.shouldOverwrite === false) {
    p.cancel('操作终止：请更换目录名后再试');
    process.exit(0);
  }

  const targetDir = path.resolve(process.cwd(), project.path);
  const templateDir = path.resolve(__dirname, 'template');

  const s = p.spinner();
  s.start('🚀 正在搬运模板...');

  try {
    if (project.shouldOverwrite) {
      await fs.emptyDir(targetDir);
    } else {
      await fs.ensureDir(targetDir);
    }

    await fs.copy(templateDir, targetDir);

    const renameMap = {
      '_package.json': 'package.json',
      '_gitignore': '.gitignore',
    };

    for (const [oldFile, newFile] of Object.entries(renameMap)) {
      const oldPath = path.join(targetDir, oldFile);
      if (fs.existsSync(oldPath)) {
        await fs.move(oldPath, path.join(targetDir, newFile), { overwrite: true });
      }
    }

    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = path.basename(targetDir);
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    await fs.remove(path.join(targetDir, 'pnpm-lock.yaml'));

    s.stop(pc.green('项目准备就绪！'));

    const relativePath = path.relative(process.cwd(), targetDir);
    const cdCmd = relativePath === '' ? '' : `cd ${relativePath}\n`;

    p.note(
      pc.cyan(`${cdCmd}pnpm install\npnpm dev`),
      '快速开始指南'
    );

    p.outro(pc.magenta('✨ Happy Coding with LVE + Tailwind!'));

  } catch (err) {
    s.stop('失败');
    console.error(pc.red(err));
    process.exit(1);
  }
}

main();