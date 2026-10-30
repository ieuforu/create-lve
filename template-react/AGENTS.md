# Project Architecture & Coding Guidelines

## Tech Stack

- **Core**: React 19 (React Compiler enabled), TypeScript 7 (`tsrs`, with matching `tsc` for compatibility checks)
- **Build & Tooling**: Vite 8 (Rolldown), Oxlint (`pnpm lint`), Oxfmt (`pnpm fmt`), Vitest (`pnpm test`)
- **UI & Styling**: `@base-ui/react`, Tailwind CSS v4, CVA (`class-variance-authority`), `tw-animate-css`, Lucide Icons (`lucide-react`)
- **Routing**: `@tanstack/react-router` (File-based routing)
- **State & Data Fetching**: `@tanstack/react-query`, `ky` (HTTP client), `jotai` (Client atomic state)

## Strict Coding Rules

### 1. Imports & Paths

- **MUST** use Node subpath imports `#/*` mapped to `./src/*` (e.g., `import { http } from '#/lib/http'`).
- **NEVER** use deep relative paths (`../../`) across feature or module boundaries.

### 2. Directory Boundaries (`routes/` vs `features/`)

- `src/routes/`: Keep route files thin. Only define route configurations, `loader`, `validateSearch`, and layout wrappers. Do not write heavy business logic or complex sub-components here.
- `src/features/<domain>/`: Co-locate all domain logic, UI components (`components/`), API query options (`queries.ts`), and domain types (`types.ts`).
- `src/components/ui/`: Pure headless/styled primitives built strictly on `@base-ui/react` and Tailwind CSS v4.

### 3. UI & Styling (`@base-ui/react` + Tailwind v4)

- **MUST** use `@base-ui/react` for interactive primitives (Dialog, Popover, Menu, etc.). **NEVER** import `@radix-ui/*`.
- Style component states using Base UI `data-*` attributes (e.g., `data-[open]:...`, `data-[disabled]:...`, `data-[highlighted]:...`).
- Use Base UI's documented positioning, focus, and dismissal APIs rather than reimplementing interactions.

### 4. State Management Hierarchy

1. **Server State**: Use `@tanstack/react-query` + `#/lib/http` (`ky`) for real APIs. Local examples use cancellable mock adapters. Define reusable query options in `src/features/<domain>/queries.ts`; reuse them in route loaders and components. Query owns retries; Ky retries are disabled by default. Forward the query's `signal` to the adapter.
2. **URL State**: Use `@tanstack/react-router` typed Search Params for pagination, filters, sorting, and active tabs.
3. **Client UI State**: Use `jotai` atoms (`src/stores/`) strictly for ephemeral cross-component client state (e.g., global modals).
4. **React Compiler**: Let the Compiler handle new memoization. Preserve intentional existing memoization until validated. Document exceptions: `UsersPage` uses `"use no memo"` for TanStack Virtual's mutable instance and caches its flattened pages; modal action callbacks stay stable for uncompiled consumers. Keep any lint suppression local and explain it.
5. **Sessions**: `lib/session.ts` owns mock token storage. `lib/auth.ts` owns routing guards. The HTTP client must not import routing guards.

### 5. Commands & Verification

- Format code: `pnpm fmt` (`oxfmt`)
- Lint code: `pnpm lint` (`oxlint`)
- Typecheck: `pnpm typecheck` (generate routes, then `tsrs -b --noEmit`)
- Compiler compatibility: `pnpm typecheck:ts` (matching TypeScript baseline)
- Run tests: `pnpm test` (`vitest run`)
- Full checks: `pnpm check`
- Production browser checks: `pnpm exec playwright install chromium`, then `pnpm test:e2e`
- Never edit or commit `src/routeTree.gen.ts`. Route generation runs explicitly before type checking; Vite also regenerates it during development.
- Keep the exact TypeScript/tsrs baseline and Router plugin/generator pair coordinated when upgrading. Stable application dependencies retain normal semver ranges.
