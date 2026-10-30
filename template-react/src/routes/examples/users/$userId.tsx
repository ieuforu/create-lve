import { createFileRoute } from '@tanstack/react-router'
import { UserDetailPage } from '#/features/users/components/UserDetailPage'
import { userQueries } from '#/features/users/queries'

export const Route = createFileRoute('/examples/users/$userId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQueries.detail(Number(params.userId))),
  component: UserDetailRoute,
})

function UserDetailRoute() {
  const { userId } = Route.useParams()
  return <UserDetailPage userId={userId} />
}
