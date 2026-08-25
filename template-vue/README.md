# Vue Reka UI App

基于 Vue 3 + Reka UI + Pinia + Tailwind CSS 的模板。

## 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 8 |
| 路由 | Vue Router 5 |
| 状态 | Pinia |
| UI | Reka UI |
| 样式 | Tailwind CSS 4 |
| 图标 | Iconify |
| Lint | OxLint + OxFmt |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
src/
├── components/          # 通用组件
├── layouts/             # 布局组件
├── pages/               # 页面组件
├── composables/         # 组合式函数
├── stores/              # Pinia 状态
├── router/              # 路由配置
├── assets/              # 静态资源
├── App.vue
└── main.ts
```

## 常用命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建
pnpm lint         # 代码检查
pnpm fmt          # 代码格式化
pnpm check        # 检查 + 格式化验证
```
