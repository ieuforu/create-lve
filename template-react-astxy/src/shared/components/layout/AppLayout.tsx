import type { ReactNode } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { AppShell } from '@astryxdesign/core/AppShell'
import { TopNav } from '@astryxdesign/core/TopNav'
import { TopNavHeading } from '@astryxdesign/core/TopNav'
import { TopNavItem } from '@astryxdesign/core/TopNav'
import { SideNav } from '@astryxdesign/core/SideNav'
import { SideNavHeading } from '@astryxdesign/core/SideNav'
import { SideNavSection } from '@astryxdesign/core/SideNav'
import { SideNavItem } from '@astryxdesign/core/SideNav'
import { Stack } from '@astryxdesign/core/Stack'
import { Avatar } from '@astryxdesign/core/Avatar'

interface AppLayoutProps {
  children: ReactNode
}

const navItems = [
  { to: '/dashboard', label: '仪表盘', icon: GridIcon },
  { to: '/orders', label: '订单管理', icon: ListIcon },
  { to: '/settings', label: '设置', icon: SettingsIcon },
] as const

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AppShell
      height="fill"
      variant="section"
      contentPadding={0}
      topNav={
        <TopNav
          label="主导航"
          heading={
            <TopNavHeading
              heading="Astryx"
              headingHref="/dashboard"
              logo={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="6" fill="var(--color-accent)" />
                  <path
                    d="M8 20L14 8L20 20"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          }
          startContent={
            <>
              <TopNavItem
                label="概览"
                href="/dashboard"
                isSelected={location.pathname === '/dashboard'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate({ to: '/dashboard' })
                }}
              />
              <TopNavItem
                label="订单"
                href="/orders"
                isSelected={location.pathname === '/orders'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate({ to: '/orders' })
                }}
              />
              <TopNavItem
                label="设置"
                href="/settings"
                isSelected={location.pathname === '/settings'}
                onClick={(e) => {
                  e.preventDefault()
                  navigate({ to: '/settings' })
                }}
              />
            </>
          }
          endContent={
            <Stack direction="horizontal" gap={3} align="center">
              <Avatar name="Admin" size="sm" />
            </Stack>
          }
        />
      }
      sideNav={
        <SideNav header={<SideNavHeading heading="工作台" />}>
          <SideNavSection title="概览">
            {navItems.map((item) => (
              <SideNavItem
                key={item.to}
                label={item.label}
                href={item.to}
                isSelected={location.pathname === item.to}
                onClick={(e) => {
                  e.preventDefault()
                  navigate({ to: item.to })
                }}
                icon={<item.icon />}
              />
            ))}
          </SideNavSection>
        </SideNav>
      }
    >
      {children}
    </AppShell>
  )
}

// ─── Icons ───

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 4h12M3 9h12M3 14h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
