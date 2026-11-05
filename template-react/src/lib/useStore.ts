import { useSyncExternalStore } from 'react'
import type { Store } from './store'

// The selector must return a primitive or an existing reference, never a new object.
export function useStore<T, S>(store: Store<T>, select: (state: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => select(store.getState()))
}
