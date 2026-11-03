# Vue Starter

A deliberately small Vue starter with one architectural path and no demo
application hidden inside it.

## Flow

```text
request → route → feature → ui + store
```

- `src/router` maps URLs to feature entries and may define guards.
- `src/features` owns pages, domain UI, data access, types and feature styles.
- `src/components/ui` contains reusable Reka UI primitives.
- `src/app` composes the root application shell.
- `src/lib` contains shared infrastructure.

Start a feature with the smallest useful file set. Add internal `components`,
`queries`, `mutations`, `schema`, `stores` or `types` only when those boundaries
become real. Features do not import one another. When a business model gains a
second feature consumer, promote its framework-neutral rules to
`src/domain/<name>`; `src/lib` remains infrastructure rather than a domain
catch-all. Oxlint enforces the primary dependency boundaries.

Keep state local to a component or composable first. Use the URL for shareable
navigation state and add a Pinia store only for concrete cross-feature client
state. The starter installs Pinia but does not invent a default store.

## Stack

- Vue 3 and Vue Router
- Vite 8 and TypeScript
- Pinia and Reka UI
- Tailwind CSS v4 and CVA
- Vitest, Vue Test Utils, Playwright, Oxlint and Oxfmt

## Commands

```bash
pnpm dev
pnpm check
pnpm build
pnpm test:e2e
```

The default landing page lives entirely in `src/features/landing`. The `/` route
only maps the URL to that feature, making it a compact reference for the intended
project structure.

UI component source is owned by the project. Add another component with the
shadcn-vue CLI only when the product needs it:

```bash
pnpm dlx shadcn-vue@latest add dialog
```
