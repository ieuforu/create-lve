import { NavLink, Outlet } from 'react-router'

const tabs = [
  { to: '/settings', label: 'Overview', end: true },
  { to: '/settings/profile', label: 'Profile' },
  { to: '/settings/account', label: 'Account' },
]

export default function SettingsLayout() {
  return (
    <main className="min-h-dvh bg-stone-50">
      <div className="mx-auto max-w-2xl px-8 py-16">
        <h1 className="text-lg font-light tracking-[0.3em] text-stone-500">
          Settings
        </h1>

        <nav className="mt-8 flex gap-1 border-b border-stone-200">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-stone-900 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-stone-900'
                    : 'text-stone-400 hover:text-stone-600'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-8">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
