# Project Architecture

## Stack

- React 19 with React Compiler
- Vite 8, TypeScript and `tsrs`
- TanStack Router and TanStack Query
- Base UI, Tailwind CSS v4 and CVA
- Vitest, Testing Library, Oxlint and Oxfmt

## One-way flow

Keep application code moving in one direction:

```text
request → route → feature → ui + query
```

### `src/routes`

Routes are flat integration maps. A route may define its path, search schema,
loader, guard and feature entry component. It must not own page markup, domain
components, business state or API details.

### `src/features/<feature>`

A feature owns its page, feature-only components, queries, mutations, types and
styles. Start with one file and split it only after the feature has real internal
boundaries. Features may import shared UI and library code; shared code must not
import a feature.

When a feature becomes complex, split only the boundaries it actually has, such
as `components`, `queries`, `mutations`, `schema` or `types`. Do not pre-create
these folders. Keep imports within the same feature relative so the linter can
distinguish them from cross-feature dependencies.

Features must not import another feature. When a business model is needed by a
second feature, promote that model and its framework-neutral rules to
`src/domain/<name>` (or `src/entities/<name>` if the application consistently
uses that vocabulary). Do not put shared business rules in `src/lib`.

### `src/components/ui`

This directory contains reusable visual or interactive primitives only. Use Base
UI for accessible interactive behavior. Do not move feature-specific components
here merely because they are rendered more than once inside one feature.

### `src/app` and `src/lib`

`src/app` composes application-wide providers and the router. `src/lib` contains
framework-neutral infrastructure such as the query client, HTTP client and small
utilities. Neither directory owns product UI.

## State hierarchy

1. TanStack Query owns remote/server state.
2. TanStack Router owns shareable URL state.
3. React owns local interaction state.
4. Use a small store only when a concrete client-state requirement cannot fit the
   first three owners.

Build stores with `createStore` from `#/lib/store` and read them in React with
`useStore` from `#/lib/useStore`. Keep a store in the feature that owns it, or in
`src/domain/<name>` when a second feature needs it. Do not add Zustand, Jotai or
another store library unless a project has a concrete need these helpers cannot
meet, and record that reason in the change that adds it.

Selectors must return primitives or existing references. Update state immutably;
`setState` skips subscribers when the next state is the same reference.

## Imports

- Use `#/*` imports across module boundaries.
- Avoid deep relative imports between features.
- A route imports its feature entry; a feature never imports a route.
- Oxlint enforces the main route, feature, UI and infrastructure boundaries.

## Verification

- `pnpm fmt` formats the project.
- `pnpm lint` runs Oxlint with warnings treated as failures.
- `pnpm typecheck` generates routes and checks with the official TypeScript compiler.
- `pnpm typecheck:tsrs` checks the same pinned TypeScript baseline with `tsrs`.
- `pnpm test` runs unit tests.
- `pnpm check` runs the complete local verification set.
- `pnpm test:e2e` runs the production Playwright checks.

Do not edit `src/routeTree.gen.ts`; it is generated and ignored.
