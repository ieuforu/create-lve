import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '#/features/users/components/UsersPage'

export const Route = createFileRoute('/dashboard/users/')({
  component: UsersPage,
})
