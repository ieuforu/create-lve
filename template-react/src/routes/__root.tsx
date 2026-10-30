import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { ErrorFallback } from '#/components/ErrorBoundary'
import { ModalRenderer } from '#/components/modals/ModalRenderer'
import '../styles.css'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  errorComponent: ({ error, reset }) => <ErrorFallback error={error} reset={reset} />,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <ModalRenderer />
    </>
  )
}
