export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div>Dashboard</div>

      <div className="flex items-center gap-4">
        <button className="text-sm text-muted-foreground">Notification</button>

        <button className="text-sm font-medium">Avatar</button>
      </div>
    </header>
  )
}
