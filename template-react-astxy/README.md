# React Astryx App

基于 React 19 + Astryx Design + TanStack Router 的后台管理模板。

## 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 (Rolldown) |
| 路由 | TanStack Router (文件路由 + 自动代码分割) |
| 数据 | TanStack Query |
| UI | Astryx Design (156 组件) |
| 样式 | StyleX |
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
├── routes/                       # TanStack Router 文件路由（自动发现）
├── features/                     # 业务模块（Feature 驱动）
│   ├── dashboard/
│   ├── orders/
│   └── settings/
├── shared/                       # 跨 Feature 共享
│   ├── components/layout/
│   └── data/
├── app/                          # 应用配置
│   ├── router.tsx
│   └── query-client.ts
├── App.tsx
└── main.tsx
```

## Astryx CLI

```bash
# 查找组件
pnpm exec astryx search "button"

# 查看组件文档
pnpm exec astryx component Card

# 诊断项目配置
pnpm exec astryx doctor
```

## 添加新页面

```bash
# 1. 创建 feature
mkdir -p src/features/analytics/{components,pages,data}

# 2. 创建页面组件和 index.ts

# 3. 创建路由文件 src/routes/analytics.tsx
```

路由自动发现，无需手动注册。
