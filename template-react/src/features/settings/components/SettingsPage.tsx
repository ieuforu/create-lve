import { User, Bell, Shield, Palette } from 'lucide-react'
import { ProfileSection } from './ProfileSection'
import { AppearanceSection } from './AppearanceSection'
import { NotificationsSection } from './NotificationsSection'
import { SecuritySection } from './SecuritySection'
import type { SettingsSection } from '#/features/settings/search'

const navItems = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'security' as const, label: 'Security', icon: Shield },
]

export function SettingsPage({
  section,
  onSectionChange,
}: {
  section: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}) {
  return (
    <div>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Settings</h1>
        <p className="mt-0.5 text-[14px] text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-6 md:flex-row md:gap-8">
        <nav
          aria-label="Settings sections"
          className="grid grid-cols-2 gap-1 md:block md:w-48 md:shrink-0 md:space-y-0.5"
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSectionChange(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-all ${
                  isActive
                    ? 'bg-foreground/[0.05] font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="min-w-0 flex-1">
          {section === 'profile' && <ProfileSection />}
          {section === 'appearance' && <AppearanceSection />}
          {section === 'notifications' && <NotificationsSection />}
          {section === 'security' && <SecuritySection />}
        </div>
      </div>
    </div>
  )
}
