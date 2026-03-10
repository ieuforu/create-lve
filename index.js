#!/usr/bin/env node

import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.clear();
  
  p.intro(`${pc.bgCyan(pc.black(' LVE-CLI '))}`);

  // 1. 交互收集信息
  const project = await p.group(
    {
      path: () => 
        p.text({
          message: '项目名称（或路径）?',
          placeholder: './lve-app',
          validate: (value) => {
            if (value.length === 0) return '路径不能为空';
          }
        }),
    },
    {
      onCancel: () => {
        p.cancel('已取消操作');
        process.exit(0);
      },
    }
  );

  const targetDir = path.resolve(process.cwd(), project.path);
  const templateDir = path.resolve(__dirname, 'template');

  const s = p.spinner();
  s.start('🚀 正在初始化项目模板...');

  try {
    if (!fs.existsSync(targetDir)) {
      await fs.ensureDir(targetDir);
    }

    await fs.copy(templateDir, targetDir);

    const renameList = [
      ['_package.json', 'package.json'],
      ['_gitignore', '.gitignore']
    ];

    for (const [oldName, newName] of renameList) {
      const oldPath = path.join(targetDir, oldName);
      const newPath = path.join(targetDir, newName);
      if (fs.existsSync(oldPath)) {
        await fs.move(oldPath, newPath, { overwrite: true });
      }
    }

    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = path.basename(targetDir);
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    const lockFile = path.join(targetDir, 'pnpm-lock.yaml');
    if (fs.existsSync(lockFile)) {
      await fs.remove(lockFile);
    }

    s.stop('项目初始化成功！');

    const cdPath = path.relative(process.cwd(), targetDir);
    
    p.note(
      pc.cyan(`cd ${cdPath}\npnpm install\npnpm dev`),
      '快速开始'
    );

    p.outro(`✨ 祝你开发愉快！如有问题请反馈。`);

  } catch (err) {
    s.stop('初始化失败');
    console.error(pc.red(err));
    process.exit(1);
  }
}

main();