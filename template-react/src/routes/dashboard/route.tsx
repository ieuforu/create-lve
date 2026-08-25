import { DashboardLayout } from '#/components/layout/DashboardLayout.tsx'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => requireAuth(),
  component: DashboardLayout,
})
