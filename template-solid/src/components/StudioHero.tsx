import Icon from './Icon'

export default function StudioHero(props: { onExplore: () => void }) {
  return (
    <section
      aria-labelledby="hero-title"
      class="studio-hero relative isolate mt-6 overflow-hidden rounded-3xl sm:mt-8"
    >
      <div class="hero-art" aria-hidden="true" />
      <div class="hero-copy relative z-1">
        <div class="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#594886]">
          <span class="size-2 rounded-full bg-[#7652be]" />
          Solid 2 × ui-sdk
        </div>
        <h1 lang="en" id="hero-title" class="hero-title font-display font-bold">
          Component
          <br />
          Playground<span class="text-violet">.</span>
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-[#50495b] sm:text-base">
          动手试用界面组件，收藏你的常用交互。
        </p>
        <a
          href="#catalog"
          class="hero-link mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-dark"
          onClick={() => props.onExplore()}
        >
          探索组件
          <Icon name="arrowDown" />
        </a>
      </div>
    </section>
  )
}
