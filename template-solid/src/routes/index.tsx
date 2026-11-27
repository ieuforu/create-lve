import { Title } from '@solidjs/meta'
import { Button } from '@ui-sdk/solid/button'
import DemoCard from '../components/DemoCard'
import { createMemo, createSignal, For, onSettled } from 'solid-js'
import { categories, demos, type Category } from '../components/ComponentDemos'
import Icon from '../components/Icon'
import SearchField from '../components/SearchField'
import StudioHero from '../components/StudioHero'
import StudioHeader from '../components/StudioHeader'

const storageKey = 'forma:bookmarks'

export default function Home() {
  const [query, setQuery] = createSignal('')
  const [category, setCategory] = createSignal<Category>('全部')
  const [savedOnly, setSavedOnly] = createSignal(false)
  const [bookmarks, setBookmarks] = createSignal<string[]>([])

  onSettled(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
      if (Array.isArray(saved))
        setBookmarks(demos.filter((demo) => saved.includes(demo.id)).map((demo) => demo.id))
    } catch {
      // Storage can be unavailable in private browsing.
    }
  })

  const visible = createMemo(() => {
    const term = query().trim().toLowerCase()
    return demos.filter(
      (demo) =>
        (!savedOnly() || bookmarks().includes(demo.id)) &&
        (category() === '全部' || demo.category === category()) &&
        `${demo.title} ${demo.name} ${demo.category} ${demo.description}`
          .toLowerCase()
          .includes(term),
    )
  })

  function bookmark(id: string, pressed: boolean) {
    const next = bookmarks().filter((value) => value !== id)
    if (pressed) next.push(id)
    setBookmarks(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // The in-memory collection remains available when storage is blocked.
    }
  }

  function openCollection(saved: boolean) {
    setSavedOnly(saved)
    setCategory('全部')
    setQuery('')
  }

  return (
    <div id="studio-top" lang="zh-CN" class="studio min-h-screen bg-paper text-ink">
      <Title>Forma Studio · 组件陈列室</Title>
      <StudioHeader
        onHome={() => openCollection(false)}
        savedOnly={savedOnly()}
        count={bookmarks().length}
        onNavigate={(saved) => {
          openCollection(saved)
          document.getElementById('catalog')?.scrollIntoView?.({ block: 'start' })
        }}
      />

      <main class="page-width pb-16">
        <StudioHero onExplore={() => openCollection(false)} />

        <section id="catalog" aria-labelledby="catalog-title" class="scroll-mt-5 pt-9 sm:pt-11">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <h2
                id="catalog-title"
                class="text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]"
              >
                {savedOnly() ? '我的收藏' : '组件目录'}
              </h2>
              <span aria-live="polite" aria-atomic="true" class="count">
                <span class="sr-only">当前显示 </span>
                {visible().length}
                <span class="sr-only"> 个组件</span>
              </span>
            </div>
            <SearchField
              label="搜索组件"
              clearLabel="清除"
              value={query()}
              onValueChange={setQuery}
            />
          </div>
          <div role="group" aria-label="按类别筛选" class="my-5 flex flex-wrap gap-2">
            <For each={categories}>
              {(item) => (
                <Button
                  class="filter-chip"
                  aria-pressed={category() === item ? 'true' : 'false'}
                  onClick={() => setCategory(item)}
                >
                  {item === '全部' && <Icon name="grid" />}
                  {item}
                </Button>
              )}
            </For>
          </div>
          <div class="demo-grid">
            <For
              each={visible()}
              fallback={
                <div class="col-span-full grid min-h-48 place-content-center justify-items-center gap-3 rounded-2xl border border-dashed border-line text-sm text-muted">
                  <Icon name={savedOnly() ? 'bookmark' : 'search'} />
                  <p>
                    {savedOnly() && !bookmarks().length
                      ? '收藏夹为空，点击组件卡片的书签即可收藏。'
                      : '没有匹配的组件。'}
                  </p>
                  <Button
                    class="font-semibold text-violet underline underline-offset-4"
                    onClick={() => openCollection(false)}
                  >
                    查看全部组件
                  </Button>
                </div>
              }
            >
              {(demo) => (
                <DemoCard
                  demo={demo}
                  saved={bookmarks().includes(demo.id)}
                  onBookmark={(pressed) => bookmark(demo.id, pressed)}
                />
              )}
            </For>
          </div>
        </section>
      </main>
    </div>
  )
}
