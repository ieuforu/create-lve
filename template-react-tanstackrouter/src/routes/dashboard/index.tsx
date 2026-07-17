import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-500">Overview of your workspace.</p>
    </div>
  )
}
