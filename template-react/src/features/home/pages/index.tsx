import { Link } from 'react-router'
import { toast } from 'sonner'

const links = [{ to: '/settings', label: 'Settings' }]

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-stone-50 px-8">
      <div className="absolute right-8 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-stone-300 [writing-mode:vertical-rl]">
        VITE × REACT
      </div>

      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-8">
          <img
            src="/favicon.svg"
            alt="Vite"
            className="h-20 w-20 opacity-70 transition-opacity hover:opacity-100"
          />
          <span className="text-2xl font-extralight text-stone-300">+</span>
          <img
            src="/react.svg"
            alt="React"
            className="h-20 w-20 opacity-70 transition-opacity hover:opacity-100 animate-[spin_30s_linear_infinite]"
          />
        </div>

        <h1 className="text-lg font-light tracking-[0.5em] text-stone-500">Vite + React</h1>

        <div className="h-px w-12 bg-stone-200" />

        <p className="text-xs tracking-widest text-stone-400">TypeScript · Shadcn · Tailwind CSS</p>

        <nav className="flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm transition-all hover:border-stone-400 hover:text-stone-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => toast('Hello 👋', { id: 'home' })}
          className="mt-2 rounded-full bg-stone-800 px-6 py-2 text-sm text-white transition-colors hover:bg-stone-700"
        >
          Toast
        </button>
      </div>

      <div className="absolute bottom-8 left-8 font-mono text-[10px] text-stone-300">v0.0.1</div>
    </main>
  )
}
