import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { clearAuthToken } from '#/lib/auth'

const menus = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { title: 'Users', href: '/dashboard/users', icon: Users, exact: false },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings, exact: false },
]

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border/40 bg-background">
      <div className="flex h-14 items-center border-b border-border/30 px-5">
        <Link to="/" className="text-[14px] font-semibold tracking-tight">
          Starter
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {menus.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              activeOptions={{ exact: item.exact }}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
              activeProps={{
                className: 'bg-foreground/[0.05] text-foreground font-medium',
              }}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/30 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-background">
            U
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">User</p>
            <p className="truncate text-[11px] text-muted-foreground/60">user@example.com</p>
          </div>
          <button
            onClick={() => {
              clearAuthToken()
              navigate({ to: '/login' })
            }}
            className="ml-auto shrink-0 rounded p-1 text-muted-foreground/40 transition-colors hover:bg-muted/60 hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
