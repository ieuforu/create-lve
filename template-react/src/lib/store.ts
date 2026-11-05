export interface Store<T> {
  getState: () => T
  setState: (next: T | ((previous: T) => T)) => void
  subscribe: (listener: () => void) => () => void
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState(next) {
      const value = typeof next === 'function' ? (next as (previous: T) => T)(state) : next
      if (Object.is(state, value)) return
      state = value
      for (const listener of listeners) listener()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
