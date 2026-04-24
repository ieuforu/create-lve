# ⚡️ ox-next-blank

这是一个为 **2026 前端标准**打造的极致极简 Next.js 模板。拒绝冗余，拒绝手动优化，追求工具链的瞬时反馈。

## 🚀 核心技术栈

- **Framework:** [Next.js 16.2](https://nextjs.org/) (App Router)
- **Runtime:** [React 19.2](https://react.dev/) + **React Compiler** (自动 Memoization)
- **Toolchain:** [Oxc](https://oxc.rs/) (Oxlint & Oxfmt) - **比 Prettier/ESLint 快 50~100 倍**
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + **OKLCH** 颜色系统
- **UI Components:** [Base UI](https://base-ui.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Hugeicons](https://hugeicons.com/) (Free Version) & Lucide

## ✨ 特性

- **Zero-Manual-Memo:** 依靠 React Compiler，彻底告别 `useMemo` 和 `useCallback`，代码回归纯粹逻辑。
- **Instant DX:** 依托 Rust 驱动的 Oxc，保存即格式化，检查即瞬间，再无等待感。
- **Hybrid Dashboard:** 预设 RSC 示例，内置开发环境专用的 `DevBoundary` 高亮（生产环境自动剔除）。
- **Modern Aesthetic:** 极致的“陶瓷白”视觉风格，基于 CSS 变量的动态主题切换。

## 🛠 常用命令

| 命令         | 说明                          | 性能表现 (参考) |
| :----------- | :---------------------------- | :-------------- |
| `pnpm dev`   | 启动 Next.js 开发服务器       | -               |
| `pnpm fmt`   | 使用 **oxfmt** 格式化全量代码 | **~80ms**       |
| `pnpm lint`  | 使用 **oxlint** 执行静态检查  | **~4ms**        |
| `pnpm build` | 生产环境构建                  | -               |

## 📁 目录结构

```text
.
├── app/               # Next.js App Router 核心
├── components/        # UI 组件 (Shadcn + Base UI)
├── lib/
│   └── utils.ts       # 核心工具函数 (cn, twMerge)
├── next.config.ts     # 开启 React Compiler 配置
└── package.json       # 基于 Oxc 的极致脚本定义
```

## 📝 开发备忘录

RSC 可视化: 开发模式下会自动显示 rsc-boundary 高亮，通过 components/DevBoundary 逻辑在 build 时自动安全剥离。

## License: MIT

## Created by: ieuforu (2026)
