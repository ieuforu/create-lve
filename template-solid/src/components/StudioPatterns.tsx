import { createSignal, createStore, For, Show } from 'solid-js'
import {
  ActionItem,
  ActionMenu,
  ActionSeparator,
  ActionSubmenu,
  Button,
  CollectionLayout,
  DetailDialog,
  Distribution,
  InspectorLayout,
  StatusBadge,
  type StatusTone,
} from '../design-system'
import styles from './StudioPatterns.module.css'

const stages = [
  { label: '草稿', tone: 'neutral' },
  { label: '校对中', tone: 'warning' },
  { label: '已定稿', tone: 'success' },
] as const
function stageTone(label: string) {
  return stages.find((stage) => stage.label === label)?.tone ?? 'neutral'
}

const shelves = ['工作室', '印刷室', '资料室'] as const
type Asset = { id: number; name: string; stage: string; shelf: string; cover: 'fold' | 'orbit' }
const initialAssets: Asset[] = [
  { id: 1, name: '折线练习', stage: '校对中', shelf: '工作室', cover: 'fold' },
  { id: 2, name: '轨道色样', stage: '草稿', shelf: '资料室', cover: 'orbit' },
]

function AssetActions(props: {
  asset: Asset
  compact?: boolean
  onMove: (shelf: string) => void
  onStage: (stage: string) => void
  onCopy: () => void
}) {
  return (
    <ActionMenu
      label={props.compact ? `${props.asset.name}的操作` : '文件操作'}
      variant={props.compact ? 'icon' : 'button'}
      onAction={(value) => {
        if (value === 'copy') props.onCopy()
        else if (value.startsWith('move/')) props.onMove(value.slice(5))
        else if (value.startsWith('stage/')) props.onStage(value.slice(6))
      }}
    >
      <ActionSubmenu label="移动到">
        <For each={shelves}>
          {(shelf) => (
            <ActionItem value={`move/${shelf}`}>
              {shelf}
              <Show when={props.asset.shelf === shelf}>
                <span aria-hidden="true">✓</span>
              </Show>
            </ActionItem>
          )}
        </For>
      </ActionSubmenu>
      <ActionSubmenu label="标记为">
        <For each={stages}>
          {(stage) => (
            <ActionItem value={`stage/${stage.label}`}>
              {stage.label}
              <Show when={props.asset.stage === stage.label}>
                <span aria-hidden="true">✓</span>
              </Show>
            </ActionItem>
          )}
        </For>
      </ActionSubmenu>
      <ActionSeparator />
      <ActionItem value="copy">创建副本</ActionItem>
    </ActionMenu>
  )
}

export function LibraryPreview() {
  const [assets, setAssets] = createStore<Asset[]>(initialAssets.map((file) => ({ ...file })))
  const [view, setView] = createSignal<'list' | 'grid'>('list')
  const [message, setMessage] = createSignal('')
  let nextId = initialAssets.length + 1
  function update(id: number, patch: Partial<Pick<Asset, 'shelf' | 'stage'>>, message: string) {
    setAssets((files) => {
      const file = files.find((file) => file.id === id)
      if (file) Object.assign(file, patch)
    })
    setMessage(message)
  }
  return (
    <div class={styles.sample}>
      <div class={styles.toolbar}>
        <h4>工作室文件</h4>
        <div role="group" aria-label="素材布局" class={styles.view}>
          <For each={['list', 'grid'] as const}>
            {(mode) => (
              <button
                type="button"
                aria-pressed={mode === view() ? 'true' : 'false'}
                onClick={() => setView(mode)}
              >
                {mode === 'list' ? '列表' : '网格'}
              </button>
            )}
          </For>
        </div>
      </div>
      <CollectionLayout variant={view()}>
        <For each={assets}>
          {(file) => (
            <li class={styles.file}>
              <span class={styles.thumb} data-cover={file.cover} aria-hidden="true" />
              <div class={styles.fileText}>
                <strong>{file.name}</strong>
                <small>{file.shelf}</small>
              </div>
              <StatusBadge tone={stageTone(file.stage)}>{file.stage}</StatusBadge>
              <AssetActions
                compact
                asset={file}
                onMove={(shelf) => update(file.id, { shelf }, `已将${file.name}移到${shelf}`)}
                onStage={(stage) => update(file.id, { stage }, `${file.name}已标记为${stage}`)}
                onCopy={() => {
                  const copy = { ...file, id: nextId++, name: `${file.name} 副本` }
                  setAssets((list) => {
                    list.push(copy)
                  })
                  setMessage(`已创建${copy.name}`)
                }}
              />
            </li>
          )}
        </For>
      </CollectionLayout>
      <span role="status" class="sr-only">
        {message()}
      </span>
    </div>
  )
}

export function ActionMenuDemo() {
  const [asset, setAsset] = createSignal(initialAssets[0]!)
  const [copies, setCopies] = createSignal(0)
  return (
    <div class={styles.demo}>
      <div class={styles.demoName}>
        <span class={styles.thumb} data-cover="fold" aria-hidden="true" />
        <div>
          <strong>折线练习</strong>
          <small role="status">
            {asset().shelf} · {asset().stage}
            <Show when={copies() > 0}> · {copies()} 份副本</Show>
          </small>
        </div>
      </div>
      <AssetActions
        asset={asset()}
        onMove={(shelf) => setAsset((file) => ({ ...file, shelf }))}
        onStage={(stage) => setAsset((file) => ({ ...file, stage }))}
        onCopy={() => setCopies((n) => n + 1)}
      />
    </div>
  )
}

const reports = [
  {
    period: '本周',
    counts: [12, 7, 5],
    notes: ['折页海报需要复核出血尺寸。', '打样结果将在周五汇总。'],
  },
  {
    period: '本月',
    counts: [34, 18, 27],
    notes: ['色样合订本已完成首轮校对。', '有三组封面进入终稿复核。'],
  },
]

export function ReportPreview() {
  const [report, setReport] = createSignal(reports[0]!)
  return (
    <div class={styles.sample}>
      <div class={styles.toolbar}>
        <h4>审稿简报</h4>
        <div role="group" aria-label="简报周期" class={styles.view}>
          <For each={reports}>
            {(r) => (
              <button
                type="button"
                aria-pressed={report() === r ? 'true' : 'false'}
                onClick={() => setReport(r)}
              >
                {r.period}
              </button>
            )}
          </For>
        </div>
      </div>
      <InspectorLayout
        summary={
          <Distribution
            label={`${report().period}审稿分布`}
            items={stages.map((s, i) => ({ ...s, value: report().counts[i]! }))}
          />
        }
      >
        <h5 class={styles.notesHeading}>审阅记录</h5>
        <ul class={styles.notes}>
          <For each={report().notes}>{(note) => <li>{note}</li>}</For>
        </ul>
      </InspectorLayout>
    </div>
  )
}

export function BadgeDemo() {
  const [outline, setOutline] = createSignal(false)
  return (
    <div class={styles.demo}>
      <div class={styles.badges}>
        <For each={stages}>
          {(s) => (
            <StatusBadge variant={outline() ? 'outline' : 'soft'} tone={s.tone}>
              {s.label}
            </StatusBadge>
          )}
        </For>
      </div>
      <Button variant="link" onClick={() => setOutline((v) => !v)}>
        {outline() ? '使用浅底样式' : '使用描边样式'}
      </Button>
    </div>
  )
}

const printRun = [
  { label: '内页', value: 24, tone: 'accent' },
  { label: '封面', value: 8, tone: 'warning' },
] as const satisfies readonly { label: string; value: number; tone: StatusTone }[]

export function DistributionDemo() {
  const [percent, setPercent] = createSignal(false)
  return (
    <div class={styles.demo}>
      <Distribution label="印刷页数" items={printRun} variant={percent() ? 'percent' : 'count'} />
      <Button variant="link" onClick={() => setPercent((p) => !p)}>
        {percent() ? '显示页数' : '显示占比'}
      </Button>
    </div>
  )
}

export function DialogDemo() {
  return (
    <div class={styles.dialogs}>
      <DetailDialog trigger="文件信息" title="折线练习" description="印刷用文件" size="compact">
        <dl class={styles.specs}>
          <div>
            <dt>格式</dt>
            <dd>PDF</dd>
          </div>
          <div>
            <dt>尺寸</dt>
            <dd>A4 · 210 × 297 mm</dd>
          </div>
        </dl>
      </DetailDialog>
      <DetailDialog trigger="印刷清单" title="印刷清单" description="送印前核对这三项设置。">
        <dl class={styles.specs}>
          <div>
            <dt>出血</dt>
            <dd>四周 3 mm</dd>
          </div>
          <div>
            <dt>字体</dt>
            <dd>嵌入全部字形</dd>
          </div>
          <div>
            <dt>颜色</dt>
            <dd>CMYK</dd>
          </div>
        </dl>
      </DetailDialog>
    </div>
  )
}
