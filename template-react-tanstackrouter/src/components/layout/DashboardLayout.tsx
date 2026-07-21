import { Header } from '#/components/layout/Header.tsx'
import { Sidebar } from '#/components/layout/Sidebar.tsx'
import { Outlet } from '@tanstack/react-router'

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
