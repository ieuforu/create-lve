# Project Architecture & Coding Guidelines

## Tech Stack

- **Core**: React 19 (React Compiler enabled), TypeScript 7 (`tsc-ts` / `tsrs`)
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
- Rely on native browser capabilities (`Popover` API, `<dialog>`, CSS Anchor Positioning) exposed by Base UI rather than JS positioning hacks.

### 4. State Management Hierarchy

1. **Server State**: Always use `@tanstack/react-query` + `#/lib/http` (`ky`). Define reusable `queryOptions` in `src/features/<domain>/queries.ts`.
2. **URL State**: Use `@tanstack/react-router` typed Search Params for pagination, filters, sorting, and active tabs.
3. **Client UI State**: Use `jotai` atoms (`src/stores/`) strictly for ephemeral cross-component client state (e.g., global modals).
4. **React Compiler**: Do **NOT** manually wrap components or hooks with `useMemo`, `useCallback`, or `React.memo` unless explicitly debugging a reference equality edge case. `babel-plugin-react-compiler` handles memoization automatically.

### 5. Commands & Verification

- Format code: `pnpm fmt` (`oxfmt`)
- Lint code: `pnpm lint` (`oxlint`)
- Typecheck: `pnpm typecheck` (`tsc-ts -b --noEmit`)
- Run tests: `pnpm test` (`vitest run`)
