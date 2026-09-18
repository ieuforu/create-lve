import { Match, Switch } from 'solid-js'
import { useQuery } from '@tanstack/solid-query'
import { Link, createFileRoute } from '@tanstack/solid-router'
import { userQuery } from '../lib/users'

export const Route = createFileRoute('/users/$id')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(userQuery(params.id)),
  head: ({ params }) => ({ meta: [{ title: `User ${params.id} · __APP_NAME__` }] }),
  component: UserPage,
})

function UserPage() {
  const params = Route.useParams()
  const query = useQuery(() => userQuery(params().id))

  return (
    <main class="mx-auto max-w-3xl px-6 py-20">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
        Router loader → Query cache
      </p>
      <Switch>
        <Match when={query.isPending}>
          <p class="mt-6 text-slate-300">Loading user…</p>
        </Match>
        <Match when={query.isError}>
          <section class="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-8">
            <h1 class="text-2xl font-semibold text-white">Unable to load this user</h1>
            <p class="mt-3 text-red-100">{query.error?.message ?? 'Unknown error'}</p>
          </section>
        </Match>
        <Match when={query.data}>
          {(user) => (
            <section class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/30">
              <h1 class="text-4xl font-semibold text-white">{user().name}</h1>
              <p class="mt-2 text-lg text-sky-300">{user().role}</p>
              <p class="mt-6 leading-7 text-slate-300">{user().note}</p>
              <div class="mt-8 flex gap-4 text-sm font-semibold">
                <Link
                  class="text-sky-300 hover:text-sky-200"
                  params={{ id: params().id === '1' ? '2' : '1' }}
                  to="/users/$id"
                >
                  Load another user
                </Link>
                <Link class="text-slate-300 hover:text-white" to="/">
                  Back home
                </Link>
              </div>
            </section>
          )}
        </Match>
      </Switch>
    </main>
  )
}
