import { Link, Outlet } from '@tanstack/react-router'

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav — frosted glass */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-5xl px-6">
          <nav className="mt-4 flex items-center justify-between rounded-2xl border border-border/50 bg-background/70 px-5 py-3 shadow-sm backdrop-blur-xl">
            <Link to="/" className="text-[15px] font-semibold tracking-tight">
              Starter
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-foreground/5 [&.active]:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all hover:opacity-80 active:scale-[0.98]"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 text-xs text-muted-foreground/60">
          <span>© 2026 Starter</span>
          <div className="flex gap-5">
            <span className="cursor-pointer transition-colors hover:text-foreground">Privacy</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
