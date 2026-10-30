import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '#/features/users/components/UsersPage'
import { userQueries } from '#/features/users/queries'

export const Route = createFileRoute('/examples/users/')({
  loaderDeps: ({ search }) => ({ q: search.q ?? '' }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureInfiniteQueryData(userQueries.infinite(deps.q)),
  component: UsersRoute,
})

function UsersRoute() {
  const { q = '' } = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <UsersPage
      search={q}
      onSearchChange={(value) => {
        void navigate({ search: value.trim() ? { q: value } : {}, replace: true })
      }}
    />
  )
}
