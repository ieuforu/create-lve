import { describe, expect, it } from 'vitest'
import { fetchUserById, fetchUsers } from './mock'

describe('user fixtures', () => {
  it('generates a page on demand and returns the same user from the detail endpoint', async () => {
    const page = await fetchUsers({ page: 2, pageSize: 50 })
    expect(page.total).toBe(100_000)
    expect(page.data).toHaveLength(50)
    expect(page.data[0]?.id).toBe(51)
    expect(await fetchUserById(51)).toEqual(page.data[0])
  })

  it('searches the full dataset and respects pagination', async () => {
    const result = await fetchUsers({ search: 'emma', pageSize: 5 })
    expect(result.total).toBeGreaterThan(5)
    expect(result.data).toHaveLength(5)
    expect(
      result.data.every((user) =>
        `${user.name} ${user.email} ${user.department}`.toLowerCase().includes('emma'),
      ),
    ).toBe(true)
    const empty = await fetchUsers({ search: 'no-such-user-unique-value' })
    expect(empty.data).toEqual([])
    expect(empty.totalPages).toBe(0)
  })

  it('preserves cancellation for list and detail requests', async () => {
    const controller = new AbortController()
    const reason = new Error('Navigation cancelled')
    const list = fetchUsers({ signal: controller.signal })
    const detail = fetchUserById(1, controller.signal)
    const assertions = [expect(list).rejects.toBe(reason), expect(detail).rejects.toBe(reason)]
    controller.abort(reason)
    await Promise.all(assertions)
  })

  it.each([0, -1, 1.5, 100_001, NaN])('rejects an invalid user ID: %s', async (id) => {
    await expect(fetchUserById(id)).rejects.toThrow('not found')
  })
})
