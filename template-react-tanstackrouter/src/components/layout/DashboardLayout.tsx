import { Header } from '#/components/layout/Header.tsx'
import { Sidebar } from '#/components/layout/Sidebar.tsx'
import { Outlet } from '@tanstack/react-router'

export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
