import { createMemo, createSignal, For, Show } from 'solid-js'
import {
  Button,
  DetailDialog,
  Field,
  IconButton,
  Popover,
  SearchField,
  Select,
  StatusBadge,
  Tooltip,
} from '../design-system'
import { files } from './studioData'
import s from './Desk.module.css'

const filters = ['全部状态', '草稿', '校对中', '已定稿'].map((label) => ({ label, value: label }))
export const statusTone = (stage: string) =>
  stage === '已定稿' ? 'success' : stage === '校对中' ? 'warning' : 'neutral'

export function DeskFiles(props: { preview?: boolean }) {
  const [query, setQuery] = createSignal('')
  const [stage, setStage] = createSignal('全部状态')
  const [compact, setCompact] = createSignal(false)
  const filtered = createMemo(() =>
    (props.preview ? files.slice(0, 3) : files).filter(
      (f) =>
        (stage() === '全部状态' || f.stage === stage()) &&
        f.name.toLowerCase().includes(query().trim().toLowerCase()),
    ),
  )
  return (
    <section class={s.panel} aria-label={props.preview ? '最近文件' : '文件目录'}>
      <div class={s.sectionHead}>
        <h2>{props.preview ? '最近文件' : '文件目录'}</h2>
        <Show
          when={props.preview}
          fallback={
            <div class={s.actions}>
              <Popover label="筛选" title="筛选文件">
                <Field label="文件状态">
                  <Select options={filters} value={stage()} onValueChange={setStage} />
                </Field>
              </Popover>
              <Tooltip
                text={compact() ? '切换为标准行距' : '切换为紧凑行距'}
                trigger={(trigger) => (
                  <IconButton
                    {...trigger}
                    label="紧凑行距"
                    icon="rows"
                    aria-pressed={compact() ? 'true' : 'false'}
                    onClick={() => setCompact((v) => !v)}
                  />
                )}
              />
            </div>
          }
        >
          <a class={s.textLink} href="/dashboard?view=files">
            全部文件 →
          </a>
        </Show>
      </div>
      <Show when={!props.preview}>
        <div class={s.filterBar}>
          <SearchField
            label="搜索文件"
            clearLabel="清除搜索"
            value={query()}
            onValueChange={setQuery}
          />
          <Show when={stage() !== '全部状态'}>
            <Button variant="chip" onClick={() => setStage('全部状态')}>
              {stage()} ×
            </Button>
          </Show>
          <small aria-live="polite">{filtered().length} 个文件</small>
        </div>
      </Show>
      <Show
        when={filtered().length}
        fallback={
          <div class={s.empty}>
            <p>没有匹配的文件。</p>
            <Button
              variant="link"
              onClick={() => {
                setQuery('')
                setStage('全部状态')
              }}
            >
              清除筛选
            </Button>
          </div>
        }
      >
        <table class={s.table} data-compact={compact()}>
          <caption class="sr-only">印刷文件</caption>
          <thead>
            <tr>
              <th scope="col">文件名称</th>
              <th scope="col">状态</th>
              <th scope="col">更新</th>
            </tr>
          </thead>
          <tbody>
            <For each={filtered()}>
              {(f) => (
                <tr>
                  <td>
                    <div class={s.filename}>
                      <span class={s.fileIcon} data-format={f.format} aria-hidden="true">
                        {f.format}
                      </span>
                      <DetailDialog
                        trigger={f.name}
                        triggerVariant="link"
                        title={f.name}
                        description={`${f.format} · ${f.size}`}
                        size="compact"
                      >
                        <p>
                          最近更新于 {f.date}，当前状态为{f.stage}。
                        </p>
                      </DetailDialog>
                    </div>
                  </td>
                  <td>
                    <StatusBadge tone={statusTone(f.stage)}>{f.stage}</StatusBadge>
                  </td>
                  <td>{f.date}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </Show>
    </section>
  )
}
