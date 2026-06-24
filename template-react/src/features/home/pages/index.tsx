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

        <p className="text-[11px] text-stone-300">Edit src/features/home/pages/index.tsx</p>
      </div>

      <div className="absolute bottom-8 left-8 font-mono text-[10px] text-stone-300">v0.0.1</div>
    </main>
  )
}
