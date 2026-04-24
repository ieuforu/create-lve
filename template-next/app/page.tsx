import { DevBoundary } from '@/components/DevBoundary'
import Counter from '../components/Counter'

export default function Home() {
  const isDev = process.env.NODE_ENV === 'development'

  const content = (
    <div className="relative group max-w-lg w-full p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_12px_40px_rgb(0,0,0,0.03)]">
      <div className="relative z-10">
        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium bg-slate-100 text-slate-500 rounded-full border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Server Side Rendered
          </span>
          <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur in inventore
            veniam voluptatem repellat quisquam nisi quasi sequi hic officia, soluta quibusdam aut,
            molestias unde recusandae, consectetur impedit doloremque aspernatur?
          </p>
        </header>

        <Counter />
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6 antialiased">
      {isDev ? <DevBoundary label="Server Boundary Demo">{content}</DevBoundary> : content}
    </main>
  )
}
