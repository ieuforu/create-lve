import { createSignal } from 'solid-js'

export function Counter() {
  const [count, setCount] = createSignal(0)

  return (
    <button
      class="rounded-full bg-sky-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      onClick={() => setCount((current) => current + 1)}
      type="button"
    >
      Count: {count()}
    </button>
  )
}
