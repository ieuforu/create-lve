# create-lve 项目入口

当前进展见 [README.md 的维护摘要](README.md#current-project-summary)。本仓库使用 pnpm 维护脚手架，Solid 模板可用 Bun 或 pnpm 生成。模板注册和命令行参数在 `index.js`，生成项目时的文件适配在 `config.js`。

- 模板目录为 `template-react`、`template-vue` 和 `template-solid`，修改时读取对应目录的 `AGENTS.md`。
- `pnpm check` 执行格式、lint 和 CLI 测试。`test/smoke.mjs` 验证生成项目的安装、构建与检查。
- 模板使用 `_gitignore`，生成时改名。npm 发布清单在根 `package.json` 的 `files` 中。
- 其他维护约定见 [CLAUDE.md](CLAUDE.md)，发布流程见 [RELEASING.md](RELEASING.md)。
