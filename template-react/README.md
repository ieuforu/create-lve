# React Starter

A modern React application starter.

## Stack

- React 19
- Vite 8
- TypeScript
- TanStack Router
- Tailwind CSS
- oxlint
- oxfmt

## Build

Run `pnpm build` after installing dependencies. It generates the ignored
`src/routeTree.gen.ts`, checks types with `tsrs`, and then builds with Vite.
`pnpm typecheck`, `pnpm typecheck:ts`, and the unit-test commands also generate
routes first. A fresh clone needs no preliminary dev-server run. Type errors
stop the build before bundling.

The exact TypeScript and `tsrs` versions share the same compiler baseline.
Upgrade them together and run `pnpm typecheck:ts` to check compatibility.
The Router plugin and standalone generator are also a tested pair. Commit the
generated project's lockfile after installation to retain its resolved versions.

Production JavaScript targets Chrome/Edge 111, Firefox 114, Safari/iOS 16.4 or
newer. This is separate from the TypeScript `target`. Router automatic route
splitting is enabled; Rolldown manages shared chunks without manual vendor groups.

## Architecture

Keep routes thin and domain code in `src/features/<domain>`. The root route
declares a typed `QueryClient` context. User routes preload the same query
options that their components consume, so routing and rendering share one cache.
User search (`q`) and settings sections (`section`) live in validated URL search
parameters; form drafts stay local. Jotai owns transient global modal state.

The users example exposes 100,000 deterministic fixtures without generating all
user objects at startup. It creates requested rows on demand, builds a lightweight
search index only when needed, and yields during searches. Queries forward their
abort signals through the mock adapter. Replace that adapter with `http` calls
when connecting your backend, retaining the query options and cancellation.

`UsersPage` explicitly uses `"use no memo"` because TanStack Virtual exposes a
mutable instance; its flattened pages have intentional manual memoization. Other
components use React Compiler normally. Lint warnings fail `pnpm lint`.

## Verification

- `pnpm check`: formatting, lint, route generation, types, and unit tests.
- `pnpm typecheck:ts`: compatibility with the matching TypeScript compiler.
- `pnpm test:coverage`: unit-test coverage.
- `pnpm exec playwright install chromium`, then `pnpm test:e2e`: Chromium checks
  against a production build, including virtual scrolling, search/detail URLs,
  confirmation dialogs, and narrow-screen settings with keyboard-operated switches.

Repository smoke tests generate projects, remove generated routes and build
caches, run their checks, and verify that adding a second modal payload type
still compiles. CI exercises generated projects on the minimum supported Node
version and Node 26; Node 26 also runs the production browser checks.

## HTTP client

`src/lib/http.ts` provides a shared Ky instance and typed JSON helpers. The helpers
return `Promise<T | undefined>`: an empty successful response (including HTTP 204)
returns `undefined`, while a JSON `null` remains `null`. Invalid non-empty JSON
throws its original parsing error. A custom `parseJson` option overrides the
default parser and is responsible for its own empty-body handling.
Ky 2.1 or newer is required so the custom parser receives empty response bodies.

Query owns retries (`retry: 1`); Ky retries are disabled by default so the layers
do not multiply transport attempts. Standalone callers can opt into retries
through request options. Final HTTP failures become `ApiError` with
`status`, `body`, and the original Ky error in `cause`. `NetworkError` and
`TimeoutError` are re-exported from Ky; abort reasons and application errors pass
through unchanged. Callers should distinguish cancellation from a failed request.
Pass the query function's `signal` through the helper options. `lib/session.ts`
owns mock token storage and `lib/auth.ts` owns route guards; the HTTP client only
depends on session storage. Set the public API base URL in `.env.example`.

## Global modals

`src/components/ui/dialog.tsx` wraps Base UI Dialog for portals, accessible labels,
focus management, and Escape/outside dismissal. `ModalRenderer` renders the top
entry in the Jotai modal stack; covered modal components remain mounted with a
closed dialog so local pending/error state survives. `useModalActions()` provides
typed `open`, `close(id?)`, and `closeAll` actions without subscribing the caller
to the top entry. `useModal()` additionally exposes the reactive `topModal`.
Closing by ID leaves other entries intact.

```tsx
const { open } = useModalActions()

open('confirm', {
  title: 'Delete project?',
  description: 'All project files will be removed.',
  confirmLabel: 'Delete',
  onConfirm: async () => {
    await deleteProject(projectId)
  },
})
```

Confirmation initially focuses Cancel. While `onConfirm` runs, buttons and user
dismissal are disabled to prevent duplicate submissions or premature closing.
Success closes that entry; a thrown error keeps it open, displays an error message,
and allows retry. This protection survives covering and uncovering the entry;
completion closes its own ID and leaves any follow-up modal intact. Add new modal
types to `ModalPayloadMap`, the store's accepted types, and the mapped registry
in `ModalRenderer`. Components receive `ModalProps<YourPayload>` and must honor
its controlled `open` prop. Payloads with required fields are required by `open()`.

## Homepage and examples

The default `/` page is lve's personal starting point: bold typography, a blue
bracket, and a small interactive project preview. Edit the headline in
`src/features/marketing/components/HomePage.tsx`, the shared header and footer in
`MarketingLayout.tsx`, and the project example in `ProjectPlayground.tsx`.
Visual styling is scoped in `src/features/marketing/styles/landing.css`.
The example uses the shared Input, Label, Button and global confirmation dialog.
Naming a project updates only this visit's preview; it does not create files.

Public examples live at `/examples` (Dashboard), `/examples/users` (virtual list
and user details), and `/examples/settings`. They reuse the existing feature modules
with local mock data. Dashboard fixtures are shared with its homepage preview.
Login and registration remain separate mock examples; the public examples do not
require a session. Apply `requireAuth` to routes that need protection in your app.
