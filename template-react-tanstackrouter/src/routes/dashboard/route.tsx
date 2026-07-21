import { DashboardLayout } from '#/components/layout/DashboardLayout.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})
