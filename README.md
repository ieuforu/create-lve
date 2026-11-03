# create-lve

[![CI](https://github.com/ieuforu/create-lve/actions/workflows/ci.yml/badge.svg)](https://github.com/ieuforu/create-lve/actions/workflows/ci.yml)

THE ULTRA-FAST FRONTEND STACK

```bash
pnpm create lve
```

## Options

| Template | Description                            |
| -------- | -------------------------------------- |
| React 19 | TanStack Router + React Query + Vite 8 |
| Vue 3    | Vue Router + Pinia + Reka UI + Vite 8  |

All templates ship with **Tailwind CSS v4** out of the box.

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`
- pnpm available on `PATH` unless using `--no-install`

## Quick Start

```bash
# Interactive mode
pnpm create lve

# Use this directory, then choose a template
pnpm create lve my-app

# React defaults (non-empty directories still require confirmation)
pnpm create lve my-app --yes

# Choose a template directly
pnpm create lve my-app --template vue

# Generate files and install dependencies later
pnpm create lve my-app --template react --no-install

# Keep the generated project inside the current Git repository
pnpm create lve apps/web --template react --no-git

# Help and version
pnpm create lve --help
pnpm create lve --version
```

Use `.` as the project directory to scaffold into the current directory. Existing
non-empty directories always require confirmation; declining or cancelling exits
without changing their contents. In non-interactive terminals, provide a directory
and `--template`, or use `--yes`. `--default` remains available as a compatibility
alias. Existing non-empty directories are never cleared without an interactive
confirmation.

Creation shows separate progress for files and installation. Generated projects
initialize Git unless `--no-git` is passed or the target is already inside a Git
repository. If a command fails, the project is kept and the CLI prints the command
output and a copyable command to continue manually.

## What's Inside

- React 19 / Vue 3
- Tailwind CSS v4
- TypeScript
- Vite 8
- TanStack Router and Query in the React templates
- React Compiler (React template)
- oxfmt + oxlint
- Vitest
- pnpm

## License

[MIT](./LICENSE)
