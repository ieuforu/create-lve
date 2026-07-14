import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

import viteLogo from '@/assets/vite.svg'

export const Route = createRootRoute({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={viteLogo} className="h-8 w-8" />
          <span className="font-semibold">React Starter</span>
        </Link>

        <nav className="flex gap-5 text-sm text-slate-500">
          <Link to="/" className="[&.active]:text-slate-900">
            Home
          </Link>
          <Link to="/about" className="[&.active]:text-slate-900">
            About
          </Link>
          <Link to="/dashboard" className="[&.active]:text-slate-900">
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
