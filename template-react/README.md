# React Starter

A deliberately small React starter with one architectural path and no demo
application hidden inside it.

## Flow

```text
request → route → feature → ui + query
```

- `src/routes` maps URLs to features and may define loaders or guards.
- `src/features` owns pages, domain UI, data access, types and feature styles.
- `src/components/ui` contains reusable primitives.
- `src/app` wires application-wide providers and routing.
- `src/lib` contains shared infrastructure.

Start a feature with the smallest useful file set. Add internal `components`,
`queries`, `mutations`, `schema` or `types` only when those boundaries become
real. Features do not import one another. When a business model gains a second
feature consumer, promote its framework-neutral rules to `src/domain/<name>`;
`src/lib` remains infrastructure rather than a domain catch-all. Oxlint enforces
the primary dependency boundaries.

The starter does not install a global client-state library by default. Use
TanStack Query for server state, TanStack Router for URL state and React for local
state. Add a store only when the application develops a real cross-feature need.

## Stack

- React 19 and React Compiler
- Vite 8
- TypeScript with `tsrs` for type checking
- TanStack Router and Query
- Base UI, Tailwind CSS v4 and CVA
- Vitest, Testing Library, Oxlint and Oxfmt

## Commands

```bash
pnpm dev
pnpm check
pnpm typecheck
pnpm build
pnpm test:e2e
```

Route generation runs as part of the typecheck, test and build commands. Do not
edit or commit `src/routeTree.gen.ts`.

The default landing page lives entirely in `src/features/landing`. The `/` route
only maps the URL to that feature, making it a compact reference for the intended
project structure.

`src/lib/http.ts` provides a typed Ky client for future APIs. TanStack Query owns
retry policy; Ky retries are disabled by default to prevent multiplied attempts.
Set the public API base URL in `.env.example`.

`pnpm typecheck` uses `tsrs` against the pinned TypeScript 7.1 baseline. Both
`pnpm check` and `pnpm build` call it.

UI component source is owned by the project. The Tailwind additions used by the
component layer are vendored in `src/styles/shadcn.css`, so the full shadcn CLI is
not installed with every application. To add a component using the matching CLI:

```bash
pnpm dlx shadcn@4.23.0 add dialog
```
