#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.clear();
  const logo = `
    ${pc.cyan("█    █  █ █▀▀▀")}
    ${pc.cyan("█    █  █ █▀▀ ")} 
    ${pc.cyan("█▄▄▄  ▀▄▀ █▄▄▄")}  ${pc.gray("THE ULTRA-FAST FRONTEND STACK")}
  `;

  console.log(logo);
  p.intro(`${pc.bgCyan(pc.black(" LVE-CLI "))}`);

  const project = await p.group(
    {
      path: () => p.text({
        message: "项目名称",
        placeholder: "my-app",
        defaultValue: "my-app",
        validate: (value) => {
          if (!value || value.length === 0) return;
          if (value.match(/[<>:"|?*]/)) return "路径包含非法字符";
        },
      }),
      shouldOverwrite: ({ results }) => {
        const targetDir = path.resolve(process.cwd(), results.path);
        if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
          return p.confirm({ message: `目录已存在，是否清空？`, initialValue: false });
        }
      },
      framework: () => p.select({
        message: "选择框架",
        options: [
          { value: "react", label: "React 19", hint: "VitePlus + Compiler" },
          { value: "vue", label: "Vue 3", hint: "VitePlus + Optimized" },
        ],
      }),
      cssEngine: () => p.select({
        message: "选择 CSS 引擎",
        options: [
          { value: "unocss", label: "UnoCSS", hint: "⚡️ 战机级性能：动态代码注入，实现源码级‘无感’混淆" },
          { value: "tailwind", label: "Tailwind v4", hint: "🛡️ 装甲级稳定：v4 引擎重构，完美适配所有主流 UI 库" },
        ],
      }),
    },
    { onCancel: () => { p.cancel("操作取消"); process.exit(0); } }
  );

  const targetDir = path.resolve(process.cwd(), project.path);
  const templateDir = path.resolve(__dirname, `template-${project.framework}`);
  const isUno = project.cssEngine === "unocss";
  const s = p.spinner();

  s.start("🛠️  正在按需装配架构...");

  try {
    if (project.shouldOverwrite) await fs.emptyDir(targetDir);
    else await fs.ensureDir(targetDir);

    await fs.copy(templateDir, targetDir);

    const oldGit = path.join(targetDir, "_gitignore");
    if (fs.existsSync(oldGit)) await fs.move(oldGit, path.join(targetDir, ".gitignore"));

    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = path.basename(targetDir);

    if (isUno) {
      pkg.devDependencies["unocss"] = "latest";
    } else {
      pkg.devDependencies["tailwindcss"] = "latest";
      pkg.devDependencies["@tailwindcss/vite"] = "latest";
    }

    pkg.pnpm = {
      ...pkg.pnpm,
      overrides: {
        ...pkg.pnpm?.overrides,
        vite: "npm:@voidzero-dev/vite-plus-core@latest",
        vitest: "npm:@voidzero-dev/vite-plus-test@latest",
      }
    };
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    const mainFile = project.framework === "vue" ? "src/main.ts" : "src/main.tsx";
    const mainPath = path.join(targetDir, mainFile);
    const viteConfigPath = path.join(targetDir, "vite.config.ts");
    const stylePath = path.join(targetDir, "src/style.css");

    let mainContent = await fs.readFile(mainPath, "utf-8");
    let viteContent = await fs.readFile(viteConfigPath, "utf-8");

    if (isUno) {
      const unoConfig = `import { defineConfig, presetWind3, transformerCompileClass } from 'unocss'

      export default defineConfig({
        presets: [presetWind3()],
        transformers: [
          {
            name: 'auto-uno-injector',
            enforce: 'pre',
            idFilter(id) {
              return id.match(/\\.[tj]sx$|\\.vue$/)
            },
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
      })\n
      `;

      await fs.writeFile(path.join(targetDir, "uno.config.ts"), unoConfig);

      mainContent = `import 'virtual:uno.css'\n` + mainContent;
      viteContent = `import UnoCSS from 'unocss/vite'\n` + viteContent;
      viteContent = viteContent.replace(/plugins:\s*\[/, "plugins: [UnoCSS(), ");

      if (fs.existsSync(stylePath)) await fs.remove(stylePath);
    } else {
      await fs.writeFile(stylePath, `@import "tailwindcss";`);

      mainContent = `import './style.css'\n` + mainContent;
      viteContent = `import tailwindcss from '@tailwindcss/vite'\n` + viteContent;
      viteContent = viteContent.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");
    }

    await fs.writeFile(mainPath, mainContent);
    await fs.writeFile(viteConfigPath, viteContent);

    const toRemove = ["pnpm-lock.yaml", "node_modules", "dist"];
    await Promise.all(toRemove.map((file) => fs.remove(path.join(targetDir, file))));

    s.stop(pc.green("装配完成！"));

    p.note(pc.cyan(`cd ${project.path}\nvp install\nvp dev`), "快速开始");
    p.outro(`${pc.magenta("✨ 已经为你准备好了极致的开发环境!")}\n${pc.gray(`==== ${project.framework} + ${project.cssEngine} ====`)}`);

  } catch (err) {
    s.stop(pc.red("手术失败"));
    console.error(err);
    process.exit(1);
  }
}

main();