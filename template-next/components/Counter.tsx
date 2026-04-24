'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Counter() {
  const [count, setCount] = useState(0)

  const onIncrement = () => setCount((prev) => prev + 1)
  const onDecrement = () => setCount((prev) => prev - 1)
  const onReset = () => setCount(0)

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-3xl">
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-6xl font-black tracking-tighter text-slate-900">{count}</h3>

        <div className="flex gap-3">
          <Button disabled={count === 0} onClick={onDecrement} variant="outline" size="lg">
            Decrement
          </Button>

          <Button onClick={onIncrement} size="lg">
            Increment
          </Button>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
