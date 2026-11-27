# Forma Studio

Solid 2 的交互组件陈列页，使用 ui-sdk 和 Tailwind CSS 4。可按中文或英文搜索组件、按类别筛选，或把常用示例收藏在当前浏览器。

## 快速开始

使用生成项目时选定的包管理器（见 `package.json` 的 `packageManager`）。Bun 项目可执行：

```bash
bun install
bun run dev
```

打开 http://localhost:3000 查看首页。运行 `bun run check` 检查格式、lint、类型和组件测试，`bun run build` 构建，`bun run preview` 本地预览。pnpm 项目对应使用 `pnpm install`、`pnpm dev`、`pnpm check`、`pnpm build` 和 `pnpm preview`。

## 静态部署

将 `dist/client/` 的内容上传到站点根目录。托管端只需提供 HTML、CSS、JavaScript 和图片等静态文件。新增客户端路由后，配置托管平台将直接访问的页面路径回退到 `index.html`。需要在 CI 重新构建时，提交对应的锁文件（Bun 使用 `bun.lock`，pnpm 使用 `pnpm-lock.yaml`）。

## Current project summary

模板基线为 2026-11-27 的 Forma Studio。首页含按钮、开关、标签页、滑块、复选框和折叠面板，可直接用鼠标和键盘操作。

测试环境采用兼容 Node 22.18.0 的 jsdom 29。生成项目已在 Node 22.18.0 和 26.13.1 通过 `pnpm check` 与 `pnpm build`。
使用 Bun 1.4.5 生成的项目已通过锁文件安装、`bun run check` 和 `bun run build`，并已通过静态 HTTP 服务验证首页交互。

- 在 [组件目录](src/components/ComponentDemos.tsx) 中添加示例及搜索信息。
- 在 [首页路由](src/routes/index.tsx) 中组合导航、搜索、筛选和收藏。
- 在 [全局样式](src/App.css) 中维护主题和 ui-sdk 状态样式。
- 文件路由由 `src/routes` 生成。`file-routes.d.ts` 随模板提供，以便首次启动前运行类型检查，Vite 会随路由变更重新生成它。
- [AGENTS.md](AGENTS.md) 记录 Solid 2 和 ui-sdk 的开发约定。`.agents/skills/ui-sdk` 包含项目级 skill。
