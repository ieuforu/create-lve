# Forma Studio

Solid 2 的交互组件陈列页，使用 ui-sdk 和 Tailwind CSS 4。可按中文或英文搜索组件、按类别筛选，或把常用示例收藏在当前浏览器。

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 查看首页。运行 `pnpm check` 检查格式、lint、类型和组件测试，`pnpm build` 生成静态产物 `dist/client`，`pnpm preview` 本地预览构建结果。

## Current project summary

模板基线为 2026-11-27 的 Forma Studio。首页含按钮、开关、标签页、滑块、复选框和折叠面板，可直接用鼠标和键盘操作。

- 在 [组件目录](src/components/ComponentDemos.tsx) 中添加示例及搜索信息。
- 在 [首页路由](src/routes/index.tsx) 中组合导航、搜索、筛选和收藏。
- 在 [全局样式](src/App.css) 中维护主题和 ui-sdk 状态样式。
- 文件路由由 `src/routes` 生成。`file-routes.d.ts` 随模板提供，以便首次启动前运行类型检查，Vite 会随路由变更重新生成它。
- [AGENTS.md](AGENTS.md) 记录 Solid 2 和 ui-sdk 的开发约定。`.agents/skills/ui-sdk` 包含项目级 skill。
