import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-slate-900 p-4 text-slate-300">
        <div className="mb-6 text-sm font-semibold text-white">Dashboard</div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link
            to="/dashboard"
            className="rounded px-3 py-1.5 hover:bg-slate-800 [&.active]:text-white [&.active]:bg-slate-800"
          >
            Overview
          </Link>
          <Link
            to="/dashboard/settings"
            className="rounded px-3 py-1.5 hover:bg-slate-800 [&.active]:text-white [&.active]:bg-slate-800"
          >
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
