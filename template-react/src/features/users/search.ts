export interface UserSearch {
  q?: string
}

export function validateUserSearch(search: Record<string, unknown>): UserSearch {
  const q = typeof search.q === 'string' ? search.q.trim().slice(0, 100) : ''
  return q ? { q } : {}
}
