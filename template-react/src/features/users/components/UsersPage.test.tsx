import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { UsersPage } from './UsersPage'

const { fetchNextPage, refetch, queryState } = vi.hoisted(() => ({
  fetchNextPage: vi.fn(),
  refetch: vi.fn(),
  queryState: { error: null as Error | null, isFetchNextPageError: false },
}))
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useInfiniteQuery: () => ({
    data: {
      pages: [
        {
          total: 100,
          data: Array.from({ length: 50 }, (_, id) => ({
            id,
            avatar: '',
            name: 'Ada',
            email: 'ada@example.test',
            department: 'Dev',
            status: 'active',
            role: 'viewer',
          })),
        },
      ],
    },
    fetchNextPage,
    refetch,
    ...queryState,
    hasNextPage: true,
    isFetchingNextPage: false,
    isLoading: false,
  }),
}))
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [{ index: 40, key: 40, start: 2880 }],
    getTotalSize: () => 3600,
    measureElement: () => {},
  }),
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="/examples/users/1">{children}</a>,
}))

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
  queryState.error = null
  queryState.isFetchNextPageError = false
})

it('requests the next page after committing instead of during render', () => {
  renderToString(<UsersPage search="" onSearchChange={() => {}} />)
  expect(fetchNextPage).not.toHaveBeenCalled()
  render(<UsersPage search="" onSearchChange={() => {}} />)
  expect(fetchNextPage).toHaveBeenCalledTimes(1)
})

it.each([true, false])('retries the failed operation (next page: %s)', (nextPage) => {
  queryState.error = new Error('Request failed')
  queryState.isFetchNextPageError = nextPage
  render(<UsersPage search="" onSearchChange={() => {}} />)
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load people')
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(fetchNextPage).toHaveBeenCalledTimes(nextPage ? 1 : 0)
  expect(refetch).toHaveBeenCalledTimes(nextPage ? 0 : 1)
})

it('cancels a pending search update on unmount', () => {
  vi.useFakeTimers()
  const updateSearch = vi.fn()
  const { unmount } = render(<UsersPage search="" onSearchChange={updateSearch} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Search people' }), {
    target: { value: 'emma' },
  })
  unmount()
  vi.advanceTimersByTime(300)
  expect(updateSearch).not.toHaveBeenCalled()
})

it('restores the input from URL navigation and drops the obsolete draft', () => {
  vi.useFakeTimers()
  const updateSearch = vi.fn()
  const { rerender } = render(<UsersPage search="emma" onSearchChange={updateSearch} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Search people' }), {
    target: { value: 'liam' },
  })
  rerender(<UsersPage search="olivia" onSearchChange={updateSearch} />)
  expect(screen.getByRole('textbox', { name: 'Search people' })).toHaveValue('olivia')
  vi.advanceTimersByTime(300)
  expect(updateSearch).not.toHaveBeenCalled()
})
