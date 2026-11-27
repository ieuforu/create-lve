# create-lve

[![CI](https://github.com/ieuforu/create-lve/actions/workflows/ci.yml/badge.svg)](https://github.com/ieuforu/create-lve/actions/workflows/ci.yml)

THE ULTRA-FAST FRONTEND STACK

```bash
pnpm create lve
```

## Options

| Template | Description                   |
| -------- | ----------------------------- |
| React 19 | TanStack Router + React Query |
| Vue 3    | Vue Router + Pinia + Reka UI  |
| Solid 2  | Solid Router + ui-sdk         |

All templates use **Vite `^8.4.0`** and **Tailwind CSS v4**.

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`
- The installer on `PATH`: pnpm by default, or Bun when creating a Solid project with Bun. Use `--no-install` to generate files only.

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

# Start with the Forma Studio Solid component gallery
pnpm create lve my-app --template solid

# Use Bun for a Solid project
bun create lve my-app --template solid

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

- React 19 / Vue 3 / Solid 2
- Tailwind CSS v4
- TypeScript
- Vite 8
- TanStack Router and Query in the React templates
- React Compiler (React template)
- oxfmt + oxlint
- Vitest
- pnpm, with Bun also supported for Solid

## Current project summary

The [v0.9.0 release](https://github.com/ieuforu/create-lve/releases/tag/v0.9.0) expands the Solid starter with a searchable gallery of 20 examples, four layout samples, a print portfolio, and a studio dashboard. The [design system](template-solid/src/design-system/index.ts) exports responsive navigation, form controls, menus, dialogs, and notifications. The portfolio and dashboard share a browser-local studio profile. On 2026-11-27 the Bun project passed its production build and nine tests. Desktop and mobile Chrome checks on the production preview covered navigation, filters, validation, and saved profile changes.

On 2026-11-27, the Vue template raised its `vue-tsc` minimum to 3.3.14. A fresh install resolved both `vue-tsc` and `@vue/language-core` to 3.3.14 and passed type checking, the production build, the unit test and three Chromium tests. Both packages include the fix for [CVE-2026-135398](https://github.com/vuejs/language-tools/security/advisories/GHSA-vgrw-xjpj-wh8r).

The Solid template now uses the React template’s pinned `tsrs` and TypeScript 7.1 beta versions for type checking. On 2026-11-27, generated Solid projects passed checks and production builds with pnpm on Node 22.18.0 and 26.13.1 and with Bun 1.4.5. An invalid Solid JSX prop produced a type error and stopped the build before Vite ran.

The [v0.8.1 release](https://github.com/ieuforu/create-lve/releases/tag/v0.8.1) sets the Vite dependency to `^8.4.0` in the React, Vue and Solid templates. On 2026-11-27, all three built and passed their checks with Vite 8.4.0 on Node 26.13.1. React and Vue also passed their Chromium end-to-end tests. The Solid template passed its checks and production build with Bun 1.4.5 as well.

The [v0.8.0 release](https://github.com/ieuforu/create-lve/releases/tag/v0.8.0) adds the Forma Studio Solid template with Bun support. Generated projects include six interactive examples, search, categories and browser-local bookmarks. See [the Solid template](template-solid/README.md) for its commands and structure.

Verified against the 0.7.3 CLI baseline (`c9a1fcc`) using a local npm tarball. The Solid project passed installation, type checking, lint, four component tests and production builds on Node 22.18.0 and 26.13.1. Chrome checks covered the generated gallery, keyboard interactions, filters, persistent bookmarks and responsive layouts.

Bun 1.4.5 and pnpm 12.4.2 each generated a Solid project with its own lockfile and passed checks and production builds. The Bun build was also served from `dist/client/` using a plain static HTTP server and verified in Chrome.

## License

[MIT](./LICENSE)
