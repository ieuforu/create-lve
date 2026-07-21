import { Link } from '@tanstack/react-router'
import { ArrowRight, Zap, Shield, Layout, Sparkles, Globe, Lock } from 'lucide-react'

export function Home() {
  return (
    <div>
      {/* Hero — large, Apple-style */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-0 pt-36">
        {/* Gradient orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2"
          style={{
            width: 680,
            height: 400,
            background:
              'radial-gradient(ellipse at center, oklch(0.7 0.12 260 / 0.15) 0%, oklch(0.7 0.12 260 / 0.03) 50%, transparent 70%)',
          }}
        />

        <div className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-[13px] text-muted-foreground backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Now with React 19 & React Compiler
        </div>

        <h1 className="relative text-center text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
          Build products.
          <br />
          <span className="text-muted-foreground/50">Not boilerplate.</span>
        </h1>

        <p className="relative mt-6 max-w-lg text-center text-[17px] leading-relaxed text-muted-foreground">
          A modern starter template with type-safe routing, server-state management, and a clean
          architecture — so you can focus on what matters.
        </p>

        <div className="relative mt-9 flex items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-[14px] font-medium text-background shadow-lg shadow-foreground/10 transition-all hover:shadow-xl hover:shadow-foreground/15 active:scale-[0.98]"
          >
            Start building
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="rounded-xl border border-border/70 px-6 py-2.5 text-[14px] font-medium transition-all hover:bg-muted/50 active:scale-[0.98]"
          >
            Learn more
          </Link>
        </div>

        {/* Browser mockup */}
        <div className="relative mt-20 w-full max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl shadow-black/5">
            <div className="flex h-8 items-center gap-1.5 border-b border-border/40 bg-muted/30 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <div className="ml-4 flex h-5 w-48 items-center rounded-md bg-background/60 px-2 text-[10px] text-muted-foreground/50">
                localhost:5173
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="h-4 w-1/3 rounded bg-foreground/5" />
                <div className="h-3 w-2/3 rounded bg-foreground/3" />
                <div className="h-3 w-1/2 rounded bg-foreground/3" />
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg bg-foreground/3" />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-foreground/3" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Apple-style grid */}
      <section className="px-6 pb-28 pt-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-[28px] font-semibold tracking-tight">Everything you need</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Carefully chosen tools, thoughtfully integrated.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border/40 bg-card/50 p-7 transition-all hover:border-border/70 hover:shadow-lg hover:shadow-black/[0.03]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04] transition-colors group-hover:bg-foreground/[0.07]">
                  <item.icon className="h-5 w-5 text-foreground/70" />
                </div>
                <h3 className="text-[15px] font-medium">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof — Apple-style centered text */}
      <section className="border-t border-border/30 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-[13px] text-muted-foreground/50">Trusted by developers at</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-14 gap-y-4">
            {['Vercel', 'Stripe', 'Linear', 'Notion', 'Supabase'].map((name) => (
              <span key={name} className="text-[17px] font-semibold text-foreground/15">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28 pt-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-20 text-center text-background">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, oklch(1 0 0) 0%, transparent 70%)',
              }}
            />
            <h2 className="relative text-[32px] font-semibold tracking-tight">Ready to build?</h2>
            <p className="relative mt-2 text-[15px] text-background/60">
              Free and open source. Start in seconds.
            </p>
            <Link
              to="/register"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-6 py-2.5 text-[14px] font-medium text-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Instant feedback',
    desc: 'Vite 8 + Rolldown with React Compiler for sub-second HMR and optimized bundles.',
  },
  {
    icon: Shield,
    title: 'End-to-end type safety',
    desc: 'TanStack Router with file-based routing, Zod validation, and strict TypeScript.',
  },
  {
    icon: Layout,
    title: 'Clean architecture',
    desc: 'Feature-based structure that scales from prototype to production without refactoring.',
  },
  {
    icon: Globe,
    title: 'Edge ready',
    desc: 'Built for modern deployment targets — Vercel, Cloudflare, or your own infrastructure.',
  },
  {
    icon: Lock,
    title: 'Auth built in',
    desc: 'Login, registration, and protected routes — scaffolded and ready to customize.',
  },
  {
    icon: Sparkles,
    title: 'Delightful DX',
    desc: 'oxlint, oxfmt, and sensible defaults. Spend time building, not configuring.',
  },
]
