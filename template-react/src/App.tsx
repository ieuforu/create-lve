import { useState } from 'react'
import reactLogo from './assets/react.svg'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-7xl mx-auto p-8 text-center font-sans antialiased text-[#213547] dark:text-zinc-200 min-h-dvh flex flex-col justify-center items-center">
      <div className="flex justify-center gap-12 mb-12">
        <a
          href="https://viteplus.dev"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
        >
          <img src="/favicon.svg" className="h-24 p-6" alt="VitePlus logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]"
        >
          <img
            src={reactLogo}
            className="h-24 p-6 animate-[spin_20s_linear_infinite]"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-5xl font-bold leading-[1.1] mb-8">VitePlus + React</h1>

      <div className="p-8 space-y-4 flex flex-col items-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-[#f9f9f9] dark:bg-zinc-800 cursor-pointer transition-colors hover:border-[#646cff] outline-none"
        >
          count is {count}
        </button>
        <p className="text-zinc-500">
          Edit{' '}
          <code className="bg-[#f1f1f1] dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
            src/App.tsx
          </code>{' '}
          to test HMR
        </p>
      </div>

      <p className="text-[#888] mt-8">
        Check out{' '}
        <a
          href="https://github.com/voidzero-dev/vite-plus"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#646cff] hover:text-[#535bf2]"
        >
          VitePlus
        </a>
        , the unified toolchain for the web.
      </p>

      <p className="text-[#888] mt-4 text-sm">
        Click on the VitePlus and React logos to learn more
      </p>
    </div>
  )
}
