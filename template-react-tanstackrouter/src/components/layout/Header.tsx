import { Bell, Search } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border/30 px-6">
      <button className="flex h-7 w-52 items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-2.5 text-[12px] text-muted-foreground/50 transition-colors hover:bg-muted/50 hover:text-muted-foreground/70">
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-auto rounded bg-background/60 px-1 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5">
        <button className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-muted/60">
          <Bell className="h-4 w-4 text-muted-foreground/60" />
        </button>
        <div className="ml-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-background">
          U
        </div>
      </div>
    </header>
  )
}
