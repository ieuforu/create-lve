import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { AppLayout } from '../shared/components/layout/AppLayout'

export const Route = createRootRoute({
  component: () => (
    <Theme theme={neutralTheme}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </Theme>
  ),
})
