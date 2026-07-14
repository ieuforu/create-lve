import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: DashboardSettings,
})

function DashboardSettings() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-slate-500">Manage your account settings.</p>
    </div>
  )
}
