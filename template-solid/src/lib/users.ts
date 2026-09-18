import { queryOptions } from '@tanstack/solid-query'

export interface User {
  name: string
  role: string
  note: string
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch('/users.json')
  if (!response.ok) throw new Error(`Unable to load users (${response.status})`)

  const users = (await response.json()) as Record<string, User>
  const user = users[id]
  if (!user) throw new Error(`User ${id} was not found`)
  return user
}

export function userQuery(id: string) {
  return queryOptions({
    queryKey: ['users', id] as const,
    queryFn: () => fetchUser(id),
  })
}
