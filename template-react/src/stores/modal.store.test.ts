// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createModalStore, isAnyModalOpenAtom, modalStackAtom, topModalAtom } from './modal.store'

describe('modal store without React', () => {
  it('opens, subscribes, closes by ID, and clears entries without mounting a component', () => {
    const { store, actions } = createModalStore()
    const listener = vi.fn()
    const unsubscribe = store.sub(modalStackAtom, listener)
    expect(store.get(isAnyModalOpenAtom)).toBe(false)
    expect(store.get(topModalAtom)).toBeNull()
    const first = actions.open('confirm', { title: 'First' })
    const second = actions.open('confirm', { title: 'Second' })
    expect(first).not.toBe(second)
    actions.close(first)
    expect(store.get(topModalAtom)?.id).toBe(second)
    expect(listener).toHaveBeenCalledTimes(3)
    unsubscribe()
    actions.closeAll()
    expect(store.get(isAnyModalOpenAtom)).toBe(false)
    expect(listener).toHaveBeenCalledTimes(3)
  })

  it('returns to the previous entry when closing the top', () => {
    const { store, actions } = createModalStore()
    const first = actions.open('confirm', { title: 'First' })
    actions.open('confirm', { title: 'Second' })
    actions.close()
    expect(store.get(topModalAtom)?.id).toBe(first)
  })

  it('isolates separate store instances', () => {
    const first = createModalStore()
    const second = createModalStore()
    first.actions.open('confirm')
    expect(second.store.get(modalStackAtom)).toEqual([])
  })

  it('rejects an unknown type without hiding the current modal', () => {
    const { store, actions } = createModalStore()
    actions.open('confirm', { title: 'Keep me' })
    expect(() => {
      // @ts-expect-error A misspelled modal name must also fail type checking.
      actions.open('confrim')
    }).toThrow('Unknown modal type: confrim')
    expect(store.get(topModalAtom)).toMatchObject({ data: { title: 'Keep me' } })
  })

  it('owns pending state and prevents duplicate asynchronous confirmations without React', async () => {
    const { store, actions } = createModalStore()
    let finish!: () => void
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve
        }),
    )
    const id = actions.open('confirm', { onConfirm })
    const task = actions.confirm(id)
    expect(store.get(topModalAtom)?.pending).toBe(true)
    actions.dismiss(id)
    expect(store.get(topModalAtom)?.id).toBe(id)
    await actions.confirm(id)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    const followUp = actions.open('confirm', { title: 'Next' })
    finish()
    await task
    expect(store.get(topModalAtom)?.id).toBe(followUp)
    expect(store.get(modalStackAtom)).toHaveLength(1)
  })

  it('stores confirmation failures and permits retry', async () => {
    const { store, actions } = createModalStore()
    const onConfirm = vi
      .fn()
      .mockRejectedValueOnce(new Error('Try later'))
      .mockResolvedValueOnce(undefined)
    const id = actions.open('confirm', { onConfirm })
    await actions.confirm(id)
    expect(store.get(topModalAtom)).toMatchObject({ pending: false, error: 'Try later' })
    await actions.confirm(id)
    expect(store.get(topModalAtom)).toBeNull()
  })

  it('does not restore an entry closed while its confirmation was running', async () => {
    const { store, actions } = createModalStore()
    let fail!: (error: Error) => void
    const id = actions.open('confirm', {
      onConfirm: () =>
        new Promise<void>((_, reject) => {
          fail = reject
        }),
    })
    const task = actions.confirm(id)
    actions.closeAll()
    fail(new Error('Late failure'))
    await task
    expect(store.get(modalStackAtom)).toEqual([])
  })
})
