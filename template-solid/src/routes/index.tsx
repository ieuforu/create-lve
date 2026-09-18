import { createFileRoute, Link } from '@tanstack/solid-router'
import { Counter } from '../components/Counter'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: '__APP_NAME__ · lve' }] }),
  component: HomePage,
})

function HomePage() {
  return (
    <main class="mx-auto grid min-h-[calc(100vh-65px)] max-w-5xl place-items-center px-6 py-20">
      <section class="max-w-3xl text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          Solid 2 · Vite 8 · TanStack
        </p>
        <h1 class="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Solid, without the maze.
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A focused Solid 2 starter with typed routing, query caching, Tailwind CSS, and tests
          already connected.
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            class="rounded-full border border-white/15 px-5 py-2.5 font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            params={{ id: '1' }}
            to="/users/$id"
          >
            Open query example
          </Link>
          <Counter />
        </div>
      </section>
    </main>
  )
}
