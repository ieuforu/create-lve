import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const menus = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-6 font-semibold">
        <Link to="/">My App</Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menus.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              activeOptions={{
                exact: item.exact,
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              activeProps={{
                className: 'bg-muted font-medium',
              }}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
