import { Outlet, createFileRoute } from '@tanstack/react-router'
import { validateUserSearch } from '#/features/users/search'

export const Route = createFileRoute('/examples/users')({
  validateSearch: validateUserSearch,
  component: () => <Outlet />,
})
