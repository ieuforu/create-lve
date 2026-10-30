import { Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { userQueries } from '#/features/users/queries'
import type { User } from '#/features/users/types'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'

const ROW_HEIGHT = 72

export function UsersPage({
  search,
  onSearchChange,
}: {
  search: string
  onSearchChange: (value: string) => void
}) {
  'use no memo'
  // TanStack Virtual exposes a mutable instance. Keep this component outside Compiler memoization.
  const parentRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState({ source: search, value: search })
  // Synchronize URL navigation before scheduling a new debounce, including back/forward.
  if (draft.source !== search) setDraft({ source: search, value: search })

  useEffect(() => {
    if (draft.value.trim() === search) return
    const timer = setTimeout(() => onSearchChange(draft.value), 250)
    return () => clearTimeout(timer)
  }, [draft.value, search, onSearchChange])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery(userQueries.infinite(search))

  // This component opts out of Compiler optimization; cache the flattened loaded pages explicitly.
  const rows = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])

  const totalFetched = rows.length
  const totalCount = data?.pages[0]?.total ?? 0

  // oxlint-disable-next-line react/incompatible-library -- This component explicitly opts out with "use no memo".
  const virtualizer = useVirtualizer({
    count: hasNextPage ? totalFetched + 1 : totalFetched,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const lastItem = virtualItems[virtualItems.length - 1]
  const lastVisibleIndex = lastItem?.index ?? -1

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0
  }, [search])

  useEffect(() => {
    if (lastVisibleIndex >= totalFetched - 10 && hasNextPage && !isFetchingNextPage && !error) {
      void fetchNextPage()
    }
  }, [lastVisibleIndex, totalFetched, hasNextPage, isFetchingNextPage, error, fetchNextPage])

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {/* Top bar */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Users</h1>
          <p className="mt-0.5 text-[14px] text-muted-foreground">
            {isLoading ? 'Loading…' : `${totalCount.toLocaleString()} people`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        <Input
          type="text"
          aria-label="Search people"
          placeholder="Search people…"
          maxLength={100}
          value={draft.value}
          onChange={(e) => setDraft({ source: search, value: e.target.value })}
          className="h-10 w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-9 text-[14px] outline-none transition-all placeholder:text-muted-foreground/40 focus:bg-background focus:border-foreground/20 focus:ring-2 focus:ring-foreground/[0.05]"
        />
        {draft.value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setDraft({ source: search, value: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-center justify-between gap-3 text-sm">
          <p>Unable to load people. Please try again.</p>
          <Button
            variant="outline"
            onClick={() => void (isFetchNextPageError ? fetchNextPage() : refetch())}
          >
            Retry
          </Button>
        </div>
      )}
      {!isLoading && !error && rows.length === 0 && (
        <p role="status" className="py-8 text-center text-sm text-muted-foreground">
          No people match your search.
        </p>
      )}

      {/* List */}
      <div
        ref={parentRef}
        role="region"
        aria-label="People"
        className="flex-1 overflow-auto rounded-2xl border border-border/40"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= totalFetched
            const user = rows[virtualRow.index] as User | undefined
            const isLast = virtualRow.index === totalFetched - 1

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className="flex h-[72px] items-center justify-center text-[13px] text-muted-foreground/40">
                    {hasNextPage ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground/40" />
                        Loading…
                      </div>
                    ) : (
                      'No more users'
                    )}
                  </div>
                ) : user ? (
                  <Link
                    to="/examples/users/$userId"
                    params={{ userId: String(user.id) }}
                    search={true}
                    className={`flex items-center gap-4 px-5 transition-colors hover:bg-muted/40 ${
                      !isLast ? 'border-b border-border/20' : ''
                    }`}
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    {/* Avatar */}
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full bg-muted ring-1 ring-border/30"
                    />

                    {/* Name + email */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium leading-tight">{user.name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-muted-foreground/50">
                        {user.email}
                      </p>
                    </div>

                    {/* Department — hidden on small */}
                    <div className="hidden w-32 shrink-0 text-[13px] text-muted-foreground md:block">
                      {user.department}
                    </div>

                    {/* Status pill */}
                    <StatusPill status={user.status} />

                    {/* Role — subtle */}
                    <div className="hidden w-20 text-right text-[12px] text-muted-foreground/40 capitalize sm:block">
                      {user.role}
                    </div>
                  </Link>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: User['status'] }) {
  const config: Record<User['status'], { dot: string; bg: string; text: string }> = {
    active: {
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-500/8',
      text: 'text-emerald-600',
    },
    inactive: {
      dot: 'bg-muted-foreground/30',
      bg: 'bg-muted',
      text: 'text-muted-foreground/60',
    },
    suspended: {
      dot: 'bg-red-400',
      bg: 'bg-red-500/8',
      text: 'text-red-500',
    },
  }
  const c = config[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${c.bg} ${c.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}
