import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  console.log(`%cApp Comp re-render`, 'background-color:blue;color:white;padding:20px;')
  return (
    <div className="min-h-screen flex flex-col gap-6 justify-center items-center">
      <p className="text-6xl">{count}</p>
      <button
        className="px-6 py-2 text-white bg-zinc-900 hover:bg-zinc-900/60 rounded-3xl"
        disabled={count < 0}
        onClick={() => setCount((pre) => pre + 1)}
      >
        increment
      </button>
    </div>
  )
}

export default App
