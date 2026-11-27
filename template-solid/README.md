# Forma Studio

使用 Solid 2、ui-sdk、CSS Modules 和 Tailwind CSS 4 构建的工作室模板。

- `/` 展示组件和布局，支持搜索、分类和浏览器本地收藏。
- `/portfolio` 展示印刷作品，支持类别筛选和详情弹窗。
- `/dashboard` 展示工作台。文件页支持搜索、状态筛选和行距切换。资料页保存的名称和简介会同步显示在同一浏览器的作品集。

## 快速开始

使用生成项目时选定的包管理器（见 `package.json` 的 `packageManager`）。Bun 项目可执行：

```bash
bun install
bun run dev
```

打开 http://localhost:3000 查看首页。运行 `bun run check` 检查格式、lint、类型和组件测试，`bun run build` 构建，`bun run preview` 本地预览。pnpm 项目对应使用 `pnpm install`、`pnpm dev`、`pnpm check`、`pnpm build` 和 `pnpm preview`。

单独检查类型可运行 `bun run typecheck` 或 `pnpm typecheck`。`typecheck`、`check` 和 `build` 都使用 `tsrs --noEmit`。类型检查通过后，`build` 才会调用 Vite。

## Forma DS

首页直接使用项目内的 Forma 组件。新页面可从 [组件入口](src/design-system/index.ts) 导入，颜色、字阶、间距、圆角和焦点环在[主题文件](src/design-system/theme.css)中统一定义。

```tsx
import { Button, Switch } from '../design-system'

export function NotificationActions(props: { onSave: () => void }) {
  return (
    <div class="flex items-center gap-3">
      <Switch aria-label="消息通知" defaultChecked />
      <Button onClick={() => props.onSave()}>保存设置</Button>
    </div>
  )
}
```

- `Button` 提供 `primary`、`secondary`、`chip`、`link` 四种外观。用 `IconToggle` 表达可切换的图标操作，并提供可访问名称。
- `SearchField`、`Switch` 和 `Checkbox` 可以直接使用。`SegmentedList` 放在 ui-sdk 的 `Tabs` 内，`SliderRail` 用于水平单滑块，`DisclosureItem` 放在 `Accordion` 内。[首页示例](src/components/ComponentDemos.tsx)展示了完整组合。
- 改主题时调整 `--forma-*` 变量。单个组件的外观和状态写在对应的 `.module.css`，用 ui-sdk 提供的 `data-checked`、`data-open` 等属性读取状态。页面用 Tailwind 排列组件、设置网格和断点间距。

## 静态部署

将 `dist/client/` 的内容上传到站点根目录。托管端只需提供 HTML、CSS、JavaScript 和图片等静态文件。配置托管平台将 `/portfolio` 和 `/dashboard` 等客户端路由回退到 `index.html`，以支持直接访问与刷新。需要在 CI 重新构建时，提交对应的锁文件（Bun 使用 `bun.lock`，pnpm 使用 `pnpm-lock.yaml`）。

## Current project summary

2026-11-27 更新。首页提供二十个组件示例和四套布局样板。完整的[作品集](src/routes/portfolio.tsx)和[工作台](src/routes/dashboard.tsx)共用页头、主导航和页脚；工作台侧栏在窄屏使用抽屉。导航骨架、表单字段、文本框、多行输入、选择框、图标按钮、Tooltip、Popover 与 Toast 均从[设计系统入口](src/design-system/index.ts)导出。

桌面 Bun 项目通过生产构建与九个测试。Chrome 在生产预览验证了作品筛选、详情居中、文件搜索和状态筛选、行距切换、表单错误焦点、保存提示及刷新后的资料恢复，360px 触屏视口验证了两级导航和文件筛选。二级操作菜单保留 ui-sdk 的斜向安全区与逐级键盘导航。 资料页的未保存草稿会更新名片预览，三个纸样支持鼠标和方向键选择。Chrome 已在 1440px 与 360px 宽度验证名片排版、存储恢复和必填错误焦点。

项目锁定 `tsrs@0.20.1-ts7.1.0-beta` 和 `typescript@7.1.0-beta`，使命令行类型检查和编辑器使用相同的 TypeScript 版本。

测试环境采用兼容 Node 22.18.0 的 jsdom 29。生成项目已在 Node 22.18.0 和 26.13.1 通过 `pnpm check` 与 `pnpm build`。
使用 Bun 1.4.5 生成的项目已通过锁文件安装、`bun run check` 和 `bun run build`，并已通过静态 HTTP 服务验证首页交互。

- 在 [组件目录](src/components/ComponentDemos.tsx) 中添加示例及搜索信息。
- 在 [首页路由](src/routes/index.tsx) 中组合导航、搜索、筛选和收藏。
- [全局样式](src/App.css) 加载主题、字体和 Tailwind。[控件样式](src/design-system/Controls.module.css) 定义可复用的交互外观。
- 文件路由由 `src/routes` 生成。`file-routes.d.ts` 随模板提供，以便首次启动前运行类型检查，Vite 会随路由变更重新生成它。
- [AGENTS.md](AGENTS.md) 记录 Solid 2 和 ui-sdk 的开发约定。`.agents/skills/ui-sdk` 包含项目级 skill。
