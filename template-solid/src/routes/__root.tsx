import type { QueryClient } from '@tanstack/solid-query'
import { HeadContent, Link, Outlet, createRootRouteWithContext } from '@tanstack/solid-router'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({ meta: [{ title: '__APP_NAME__' }] }),
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <>
      <HeadContent />
      <header class="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link class="font-semibold tracking-tight text-white" to="/">
            lve / solid
          </Link>
          <div class="flex items-center gap-5 text-sm text-slate-300">
            <Link class="transition hover:text-white" to="/">
              Home
            </Link>
            <Link class="transition hover:text-white" params={{ id: '1' }} to="/users/$id">
              Query example
            </Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  )
}

function NotFound() {
  return (
    <main class="mx-auto max-w-3xl px-6 py-24 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">404</p>
      <h1 class="mt-4 text-4xl font-semibold text-white">Page not found</h1>
      <Link class="mt-8 inline-block text-sky-300 hover:text-sky-200" to="/">
        Return home
      </Link>
    </main>
  )
}
