import {
  InputDemo,
  TextareaDemo,
  SelectDemo,
  TooltipDemo,
  PopoverDemo,
  ToastDemo,
} from './PrimitiveDemos'
import { ActionMenuDemo, DialogDemo, BadgeDemo, DistributionDemo } from './StudioPatterns'
import { Accordion } from '@ui-sdk/solid/accordion'
import { Slider, SliderValue } from '@ui-sdk/solid/slider'
import { Tabs, TabsPanel, TabsTab } from '@ui-sdk/solid/tabs'
import { createSignal, For } from 'solid-js'
import {
  Button,
  Switch,
  SegmentedList,
  SliderRail,
  Checkbox,
  Stepper,
  RadioChoices,
  StarRating,
  ProgressBar,
  DisclosureItem,
  Icon,
} from '../design-system'
import styles from './ComponentDemos.module.css'

function ButtonDemo() {
  const [count, setCount] = createSignal(0)
  return (
    <div class={styles.actions}>
      <Button onClick={() => setCount((count) => count + 1)}>
        <Icon name={count() ? 'check' : 'plus'} />
        {count() ? `已添加 ${count()}` : '添加项目'}
      </Button>
      <Button variant="secondary" onClick={() => setCount(0)}>
        <Icon name="reset" />
        重置
      </Button>
    </div>
  )
}

function SwitchDemo() {
  return (
    <label class={[styles.panel, styles.row]}>
      <span class={styles.bell}>
        <Icon name="bell" />
      </span>
      <span class={styles.rowLabel}>消息通知</span>
      <Switch defaultChecked aria-label="消息通知" />
    </label>
  )
}

const periods = [
  { id: 'week', name: '本周', visits: '2,418', bars: [28, 49, 35, 64, 52, 77, 92] },
  { id: 'month', name: '本月', visits: '9,602', bars: [46, 31, 63, 44, 80, 92, 73] },
]

function TabsDemo() {
  return (
    <Tabs defaultValue="week" class={styles.panel}>
      <div class={styles.between}>
        <span class={styles.caption}>访问量</span>
        <SegmentedList aria-label="访问量统计周期">
          <For each={periods}>{(period) => <TabsTab value={period.id}>{period.name}</TabsTab>}</For>
        </SegmentedList>
      </div>
      <For each={periods}>
        {(period) => (
          <TabsPanel value={period.id} class={styles.tabPanel}>
            <div class={styles.values}>
              <strong class={styles.visits}>{period.visits}</strong>
              <span class={styles.chart} aria-hidden="true">
                <For each={period.bars}>{(height) => <i style={{ height: `${height}%` }} />}</For>
              </span>
            </div>
          </TabsPanel>
        )}
      </For>
    </Tabs>
  )
}

function SliderDemo() {
  return (
    <Slider defaultValue={65} aria-label="音量设置" class={styles.panel}>
      <div class={styles.row}>
        <Icon name="volume" />
        <span class={styles.rowLabel}>音量</span>
        <span class={styles.readout}>
          <SliderValue />%
        </span>
      </div>
      <SliderRail label="音量" />
    </Slider>
  )
}

function CheckboxDemo() {
  return (
    <div class={[styles.panel, styles.checks]}>
      <For each={['设计稿', '交互原型']}>
        {(item) => (
          <label class={styles.checkRow}>
            <Checkbox defaultChecked={item === '设计稿'} aria-label={item} />
            {item}
          </label>
        )}
      </For>
    </div>
  )
}

function AccordionDemo() {
  return (
    <Accordion aria-label="组件说明" class={styles.panel}>
      <DisclosureItem value="keyboard" title="键盘怎么操作？">
        用 Tab 聚焦标题，按 Enter 或空格展开和收起。
      </DisclosureItem>
    </Accordion>
  )
}

function StepperDemo() {
  return (
    <div class={styles.panel}>
      <Stepper label="印刷份数" min={1} max={99} defaultValue={3} />
    </div>
  )
}

const printStocks = [
  { value: 'matte', label: '哑光' },
  { value: 'gloss', label: '亮面' },
]

function RadioDemo() {
  return (
    <div class={styles.panel}>
      <RadioChoices label="纸张表面" options={printStocks} defaultValue="matte" />
    </div>
  )
}

function RatingDemo() {
  return (
    <div class={styles.panel}>
      <StarRating label="给作品评分" defaultValue={3} />
    </div>
  )
}

function ProgressDemo() {
  const [value, setValue] = createSignal(25)
  return (
    <div class={[styles.panel, 'grid gap-3']}>
      <ProgressBar label="校对进度" value={value()} />
      <Button variant="secondary" onClick={() => setValue((v) => (v === 100 ? 0 : v + 25))}>
        {value() === 100 ? '重新校对' : '完成一页'}
      </Button>
    </div>
  )
}

export const categories = ['全部', '操作', '表单', '布局', '反馈'] as const
export type Category = (typeof categories)[number]

export const demos = [
  {
    id: 'text-field',
    title: 'Text Field',
    name: '文本字段',
    category: '表单',
    description: 'Field 关联标签、提示和错误信息，Input 接收单行文字。',
    tone: 'lilac',
    preview: InputDemo,
  },
  {
    id: 'textarea',
    title: 'Textarea',
    name: '多行输入',
    category: '表单',
    description: '输入校对备注，实时查看剩余的书写空间。',
    tone: 'sky',
    preview: TextareaDemo,
  },
  {
    id: 'select',
    title: 'Select',
    name: '选择框',
    category: '表单',
    description: '用键盘或鼠标在多种纸张中选择一种。',
    tone: 'mint',
    preview: SelectDemo,
  },
  {
    id: 'tooltip',
    title: 'Icon Button',
    name: '图标按钮与提示',
    category: '操作',
    description: '悬停或聚焦显示 Tooltip，点击切换书签。',
    tone: 'peach',
    preview: TooltipDemo,
  },
  {
    id: 'popover',
    title: 'Popover',
    name: '弹出面板',
    category: '操作',
    description: '在操作按钮旁边直接调整用纸。',
    tone: 'butter',
    preview: PopoverDemo,
  },
  {
    id: 'toast',
    title: 'Toast',
    name: '轻提示',
    category: '反馈',
    description: '短暂显示操作反馈，可提前关闭。',
    tone: 'rose',
    preview: ToastDemo,
  },
  {
    id: 'action-menu',
    title: 'Action Menu',
    name: '二级操作菜单',
    category: '操作',
    description: '展开「移动到」，斜穿下一行去选目标文件夹。',
    tone: 'lilac',
    preview: ActionMenuDemo,
  },
  {
    id: 'dialog',
    title: 'Dialog',
    name: '详情弹窗',
    category: '布局',
    description: '试试紧凑信息窗和标准清单，按 Esc 返回。',
    tone: 'mint',
    preview: DialogDemo,
  },
  {
    id: 'status-badge',
    title: 'Status Badge',
    name: '状态标签',
    category: '反馈',
    description: '切换浅底和描边，区分文件的审稿状态。',
    tone: 'sky',
    preview: BadgeDemo,
  },
  {
    id: 'distribution',
    title: 'Distribution',
    name: '分布条',
    category: '反馈',
    description: '对照同色图例，以数量或百分比查看构成。',
    tone: 'butter',
    preview: DistributionDemo,
  },
  {
    id: 'button',
    title: 'Button',
    name: '按钮',
    category: '操作',
    description: '触发操作，立即得到反馈。',
    tone: 'lilac',
    preview: ButtonDemo,
  },
  {
    id: 'switch',
    title: 'Switch',
    name: '开关',
    category: '表单',
    description: '一键切换设置的开关状态。',
    tone: 'mint',
    preview: SwitchDemo,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    name: '标签页',
    category: '布局',
    description: '在同一区域切换关联内容。',
    tone: 'peach',
    preview: TabsDemo,
  },
  {
    id: 'slider',
    title: 'Slider',
    name: '滑块',
    category: '表单',
    description: '拖动或使用方向键调整数值。',
    tone: 'butter',
    preview: SliderDemo,
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    name: '复选框',
    category: '表单',
    description: '从一组选项中选择多个项目。',
    tone: 'rose',
    preview: CheckboxDemo,
  },
  {
    id: 'accordion',
    title: 'Accordion',
    name: '折叠面板',
    category: '布局',
    description: '按需展开或收起详细说明。',
    tone: 'sky',
    preview: AccordionDemo,
  },
  {
    id: 'stepper',
    title: 'Stepper',
    name: '步进输入',
    category: '表单',
    description: '输入份数，或用加减按钮逐份调整。',
    tone: 'mint',
    preview: StepperDemo,
  },
  {
    id: 'radio',
    title: 'Radio Group',
    name: '单选组',
    category: '表单',
    description: '用方向键在纸张选项之间切换。',
    tone: 'peach',
    preview: RadioDemo,
  },
  {
    id: 'rating',
    title: 'Rating',
    name: '星级评分',
    category: '反馈',
    description: '为作品选择一到五颗星。',
    tone: 'butter',
    preview: RatingDemo,
  },
  {
    id: 'progress',
    title: 'Progress',
    name: '进度条',
    category: '反馈',
    description: '每校对一页，更新一次完成比例。',
    tone: 'sky',
    preview: ProgressDemo,
  },
] as const

export type Demo = (typeof demos)[number]
