# Project Architecture

## Stack

- Vue 3, Vue Router and Pinia
- Vite 8, TypeScript and `vue-tsc`
- Reka UI, Tailwind CSS v4 and CVA
- Vitest, Vue Test Utils, Playwright, Oxlint and Oxfmt

## One-way flow

Keep application code moving in one direction:

```text
request → route → feature → ui + store
```

### `src/router`

The router is a flat integration map. A route may define its path, metadata,
guard and feature entry component. It must not own page markup, domain
components, business state or API details.

### `src/features/<feature>`

A feature owns its page, feature-only components, composables, queries,
mutations, stores, types and styles. Start with one file and split it only after
the feature has real internal boundaries. Keep same-feature imports relative.

Features must not import another feature. When a business model is needed by a
second feature, promote its framework-neutral rules to `src/domain/<name>` (or
`src/entities/<name>` if the application consistently uses that vocabulary).
Do not put shared business rules in `src/lib`.

### `src/components/ui`

This directory contains reusable visual or interactive primitives only. Use
Reka UI for accessible interactive behavior. Do not move feature-specific
components here merely because they render more than once inside one feature.

### `src/app` and `src/lib`

`src/app` composes the root application shell. `src/lib` contains shared
infrastructure and small utilities. Neither directory owns product UI.

## State hierarchy

1. Vue owns local interaction state.
2. Vue Router owns shareable URL state.
3. Pinia owns concrete cross-feature client state.
4. Add a server-state cache only when the application has a real caching need.

## Imports

- Use `@/*` imports across module boundaries.
- Keep imports within one feature relative.
- The router imports feature entries; a feature never imports the router.
- Oxlint enforces the main router, feature, UI and infrastructure boundaries.

## Verification

- `pnpm fmt` formats the project.
- `pnpm lint` runs Oxlint with warnings treated as failures.
- `pnpm type-check` checks Vue and TypeScript with `vue-tsc`.
- `pnpm test` runs unit tests.
- `pnpm check` runs the complete local verification set.
- `pnpm test:e2e` builds and tests the production application.
