# create-lve

THE ULTRA-FAST FRONTEND STACK

```bash
pnpm create-lve
```

## Options

| Template | Description              |
| -------- | ------------------------ |
| React 19 | react-router + vite-plus |
| React 19 | TanStack Router + Vite 8 |
| Vue 3    | vue-router + vite-plus   |

All templates ship with **Tailwind CSS v4** out of the box.

## Quick Start

```bash
# Interactive mode
pnpm create-lve

# Default (React 19 + react-router + Tailwind)
pnpm create-lve my-app

# Skip all prompts
pnpm create-lve --default my-app
```

## What's Inside

- React 19 / Vue 3
- Tailwind CSS v4
- TypeScript
- [vite-plus](https://github.com/voidzero-dev/vite-plus) (React & Vue templates) or Vite 8 (TanStack Router template)
- React Compiler (via `babel-plugin-react-compiler`)
- oxfmt + oxlint
- pnpm
