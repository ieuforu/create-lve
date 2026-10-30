import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { fetchUsers, fetchUserById } from './mock'

export const userQueries = {
  all: () => ['users'] as const,

  infinite: (search: string) =>
    infiniteQueryOptions({
      queryKey: [...userQueries.all(), 'infinite', search],
      queryFn: ({ pageParam, signal }) =>
        fetchUsers({ page: pageParam, pageSize: 50, search, signal }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      staleTime: 30_000,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: [...userQueries.all(), 'detail', id],
      queryFn: ({ signal }) => fetchUserById(id, signal),
      staleTime: 60_000,
    }),
}
