import { createFileRoute } from '@tanstack/react-router'

import reactLogo from '#/assets/react.svg'

export const Route = createFileRoute('/_marketing-layout/')({
  component: Home,
})

function Home() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <img src={reactLogo} className="h-20 w-20" />
      </div>

      <h1 className="text-5xl font-bold tracking-tight">Build with React</h1>

      <p className="max-w-md text-slate-500">
        A modern frontend starter powered by Vite, TanStack Router and TypeScript.
      </p>

      <div className="flex gap-3">
        <button className="rounded-full bg-slate-900 px-6 py-2 text-sm text-white hover:bg-slate-700">
          Get Started
        </button>

        <button className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm hover:bg-slate-100">
          Learn More
        </button>
      </div>
    </section>
  )
}
