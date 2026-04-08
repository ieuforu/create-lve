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
 ${pc.cyan("█▄▄▄  ▀▄▀ █▄▄▄")}  ${pc.gray("THE ULTRA-FAST STACK")}
  `;

  console.log(logo);
  p.intro(
    `${pc.bgCyan(pc.black(" LVE-CLI "))} ` +
      pc.gray("The Ultra-Fast Frontend Stack (") +
      pc.blue("Vite") +
      pc.gray(" + ") +
      pc.yellow("Oxc") +
      pc.gray(" + ") +
      pc.cyan("Tailwind") +
      pc.gray(")"),
  );

  const project = await p.group(
    {
      path: () =>
        p.text({
          message: "你的项目叫什么名字？",
          placeholder: "react-app",
          defaultValue: "react-app",
          validate: (value) => {
            if (!value || value.length === 0) return;
            if (value.match(/[<>:"|?*]/)) return "路径包含非法字符";
          },
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
      framework: () =>
        p.select({
          message: "选择一个你喜欢的工具",
          options: [
            { value: "react", label: "React 19", hint: "VitePlus + Compiler" },
            { value: "vue", label: "Vue 3", hint: "VitePlus + Optimized" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("已取消操作");
        process.exit(0);
      },
    },
  );

  if (project.shouldOverwrite === false) {
    p.cancel("操作终止：请更换目录名后再试");
    process.exit(0);
  }

  const targetDir = path.resolve(process.cwd(), project.path);
  const templateDir = path.resolve(__dirname, `template-${project.framework}`);
  const frameworkName = project.framework === "react" ? "React" : "Vue 3";
  const s = p.spinner();
  s.start("🚀 正在搬运模板...");

  try {
    if (project.shouldOverwrite) {
      await fs.emptyDir(targetDir);
    } else {
      await fs.ensureDir(targetDir);
    }

    await fs.copy(templateDir, targetDir);

    const renameMap = {
      _gitignore: ".gitignore",
    };

    for (const [oldFile, newFile] of Object.entries(renameMap)) {
      const oldPath = path.join(targetDir, oldFile);
      if (fs.existsSync(oldPath)) {
        await fs.move(oldPath, path.join(targetDir, newFile), { overwrite: true });
      }
    }

    const pkgPath = path.join(targetDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = path.basename(targetDir);
      if (project.framework === "react") {
        pkg.dependencies = {
          ...pkg.dependencies,
          react: "latest",
          "react-dom": "latest",
        };

        pkg.devDependencies = {
          ...pkg.devDependencies,
          "vite-plus": "latest",
          tailwindcss: "latest",
          "@tailwindcss/vite": "latest",
          "babel-plugin-react-compiler": "latest",
        };
      } else {
        pkg.dependencies = {
          ...pkg.dependencies,
          vue: "latest",
        };

        pkg.devDependencies = {
          ...pkg.devDependencies,
          "vite-plus": "latest",
          tailwindcss: "latest",
          "@tailwindcss/vite": "latest",
        };
      }
      pkg.pnpm = pkg.pnpm || {};
      pkg.pnpm.overrides = {
        ...pkg.pnpm.overrides,
        vite: "npm:@voidzero-dev/vite-plus-core@latest",
        vitest: "npm:@voidzero-dev/vite-plus-test@latest",
      };
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    const toRemove = ["pnpm-lock.yaml", "node_modules", "dist"];
    await Promise.all(toRemove.map((file) => fs.remove(path.join(targetDir, file))));

    s.stop(pc.green("项目准备就绪！"));

    const relativePath = path.relative(process.cwd(), targetDir);
    const cdCmd = relativePath === "" ? "" : `cd ${relativePath}\n`;

    p.note(pc.cyan(`${cdCmd}vp install\nvp dev`), "快速开始指南");

    p.outro(
      `${pc.magenta("✨ Happy Coding!")}\n` +
        `${pc.gray(` ==== VitePlus + OXC + ${frameworkName} ====`)}`,
    );
  } catch (err) {
    s.stop("失败");
    console.error(pc.red(err));
    process.exit(1);
  }
}

main();
