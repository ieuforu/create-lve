# Solid Starter

An opinionated Solid 2 application starter for static, client-rendered apps.

## Stack

- Solid 2 RC
- Vite 8
- TypeScript
- TanStack Router
- TanStack Query
- Tailwind CSS v4
- Vitest and Playwright
- oxlint and oxfmt

## Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
pnpm fmt
```

## Routing and data

Routes live in `src/routes`. TanStack Router generates `src/routeTree.gen.ts`
when development or production builds start. The dynamic `/users/$id` route
shows the recommended integration: its loader warms the TanStack Query cache,
then the component reads the same typed query.

## Deployment

`pnpm build` emits a static site in `dist/client`. Deploy that directory and
configure the host to rewrite unknown application paths to `index.html`, so
refreshing a client-side route such as `/users/1` still loads the app.

This template deliberately uses client rendering. Add SolidStart or TanStack
Start separately if the application later needs server rendering or API routes.
