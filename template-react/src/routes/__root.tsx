import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { AppErrorPage, NotFoundPage } from '#/features/system/SystemPages'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => <Outlet />,
  errorComponent: AppErrorPage,
  notFoundComponent: NotFoundPage,
})
