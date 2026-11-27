import { LibraryPreview, ReportPreview } from './StudioPatterns'
import { createMemo, createSignal, For } from 'solid-js'
import { Button, Checkbox, SidebarLayout, SplitLayout } from '../design-system'
import styles from './LayoutShowcase.module.css'
import catalog from './Catalog.module.css'

const studies = [
  {
    title: '折线与秩序',
    series: 'Fold studies',
    text: '用一张纸、一道折痕，试验重复线条中的节奏。',
    cover: 'fold',
  },
  {
    title: '圆的负空间',
    series: 'Orbit studies',
    text: '移动圆心，让几何图形之间的留白成为画面的主角。',
    cover: 'orbit',
  },
]

function EditorialPreview() {
  const [page, setPage] = createSignal(0)
  const study = createMemo(() => studies[page()]!)
  return (
    <SplitLayout
      visual={
        <div class={styles.poster} data-cover={study().cover} aria-hidden="true">
          <span class={styles.posterType}>Offset.</span>
          <span class={styles.imprint}>Forma Press</span>
        </div>
      }
    >
      <div class={styles.editorial}>
        <div aria-live="polite">
          <span class={styles.series} lang="en">
            {study().series}
          </span>
          <h4>{study().title}</h4>
          <p>{study().text}</p>
        </div>
        <Button variant="link" onClick={() => setPage((i) => (i + 1) % studies.length)}>
          下一件作品 <span aria-hidden="true">→</span>
        </Button>
      </div>
    </SplitLayout>
  )
}

const tasks = [
  { id: 'poster', name: '整理海报草稿' },
  { id: 'type', name: '校对字阶样张' },
  { id: 'archive', name: '归档色彩研究' },
]
const folders = ['全部任务', '待处理', '已完成'] as const

function WorkspacePreview() {
  const [folder, setFolder] = createSignal<(typeof folders)[number]>('全部任务')
  const [done, setDone] = createSignal<string[]>(['archive'])
  const shown = createMemo(() =>
    tasks.filter(
      (task) => folder() === '全部任务' || done().includes(task.id) === (folder() === '已完成'),
    ),
  )
  return (
    <SidebarLayout
      sidebar={
        <div class={styles.rail}>
          <p lang="en">Studio Desk</p>
          <div class={styles.folders} role="group" aria-label="任务视图">
            <For each={folders}>
              {(item) => (
                <Button
                  variant="chip"
                  aria-pressed={folder() === item ? 'true' : 'false'}
                  onClick={() => setFolder(item)}
                >
                  {item}
                </Button>
              )}
            </For>
          </div>
        </div>
      }
    >
      <div class={styles.desk}>
        <div class={styles.deskHeader}>
          <h4>{folder()}</h4>
          <span aria-live="polite">
            {done().length} / {tasks.length} 已完成
          </span>
        </div>
        <div class={styles.taskList}>
          <For each={shown()} fallback={<p>这个视图暂无任务。</p>}>
            {(task) => (
              <label data-done={done().includes(task.id)}>
                <Checkbox
                  checked={done().includes(task.id)}
                  aria-label={task.name}
                  onCheckedChange={(checked) =>
                    setDone((ids) =>
                      checked ? [...ids, task.id] : ids.filter((id) => id !== task.id),
                    )
                  }
                />
                <span>{task.name}</span>
              </label>
            )}
          </For>
        </div>
      </div>
    </SidebarLayout>
  )
}

export default function LayoutShowcase() {
  return (
    <section id="layouts" aria-labelledby="layouts-title" class="scroll-mt-5 pt-9 sm:pt-11">
      <h2 id="layouts-title" class={catalog.heading}>
        布局样板
      </h2>
      <div class="mt-4 grid gap-5 lg:grid-cols-2">
        <div id="file-library">
          <h3 class={styles.caption}>
            素材库 <span lang="en">Asset library</span>
          </h3>
          <div class={styles.frame}>
            <LibraryPreview />
          </div>
        </div>
        <div>
          <h3 class={styles.caption}>
            审稿台 <span lang="en">Review desk</span>
          </h3>
          <div class={styles.frame}>
            <ReportPreview />
          </div>
        </div>
        <div>
          <h3 class={styles.caption}>
            作品集 <span lang="en">Editorial split</span>
          </h3>
          <div class={styles.frame}>
            <EditorialPreview />
          </div>
        </div>
        <div>
          <h3 class={styles.caption}>
            工作台 <span lang="en">Sidebar workspace</span>
          </h3>
          <div class={styles.frame}>
            <WorkspacePreview />
          </div>
        </div>
      </div>
    </section>
  )
}
