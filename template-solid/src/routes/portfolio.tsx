import { Title } from '@solidjs/meta'
import { createMemo, createSignal, For } from 'solid-js'
import { StudioFooter, StudioSiteHeader } from '../components/StudioSite'
import { works, useStudioProfile } from '../components/studioData'
import { Button, DetailDialog } from '../design-system'
import s from '../components/Portfolio.module.css'

export default function Portfolio() {
  const { profile } = useStudioProfile()
  const [filter, setFilter] = createSignal('全部')
  const selected = createMemo(() =>
    works.filter((work) => filter() === '全部' || work.category === filter()),
  )
  return (
    <div lang="zh-CN">
      <Title>作品集 · Forma Studio</Title>
      <StudioSiteHeader active="/portfolio" />
      <main class="page-width">
        <section class={s.hero} aria-labelledby="portfolio-title">
          <div class={s.copy}>
            <p class={s.studio}>{profile().name} / 印刷工作室</p>
            <h1 id="portfolio-title" lang="en">
              Printed
              <br />
              <em>forms.</em>
            </h1>
            <p class={s.intro}>{profile().intro}</p>
            <a href="#works">
              浏览作品 <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div
            class={s.heroArt}
            role="img"
            aria-label="淡紫色几何构成，拱形和阶梯形成一组立体静物"
          />
        </section>
        <section id="works" class={s.works} aria-labelledby="works-title">
          <div class={s.heading}>
            <h2 id="works-title">精选作品</h2>
            <div role="group" aria-label="作品类别" class="flex flex-wrap gap-2">
              <For each={['全部', '海报', '色彩', '书刊']}>
                {(f) => (
                  <Button
                    variant="chip"
                    aria-pressed={filter() === f ? 'true' : 'false'}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </Button>
                )}
              </For>
            </div>
          </div>
          <div class={s.grid}>
            <For each={selected()}>
              {(work) => (
                <article class={s.work}>
                  <div class={s.cover} data-art={work.id} aria-hidden="true">
                    <strong lang="en">{work.print}</strong>
                    <span lang="en">{work.series}</span>
                  </div>
                  <div class={s.workContent}>
                    <h3>{work.title}</h3>
                    <p>
                      {work.category} · {work.format}
                    </p>
                    <DetailDialog
                      trigger={`查看${work.title}`}
                      title={work.title}
                      description={work.format}
                    >
                      <p class={s.note}>{work.note}</p>
                    </DetailDialog>
                  </div>
                </article>
              )}
            </For>
          </div>
        </section>
      </main>
      <StudioFooter active="/portfolio" />
    </div>
  )
}
