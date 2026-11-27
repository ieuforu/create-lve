import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@ui-sdk/solid/accordion'
import { Button } from '@ui-sdk/solid/button'
import { Checkbox, CheckboxIndicator } from '@ui-sdk/solid/checkbox'
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@ui-sdk/solid/slider'
import { Switch, SwitchThumb } from '@ui-sdk/solid/switch'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@ui-sdk/solid/tabs'
import { createSignal, For } from 'solid-js'
import Icon from './Icon'

function ButtonDemo() {
  const [count, setCount] = createSignal(0)
  return (
    <div class="flex items-center gap-2">
      <Button
        class="demo-action bg-violet text-white hover:bg-violet-dark"
        onClick={() => setCount((count) => count + 1)}
      >
        <Icon name={count() ? 'check' : 'plus'} />
        {count() ? `已添加 ${count()}` : '添加项目'}
      </Button>
      <Button class="demo-action bg-white text-ink hover:bg-stone-50" onClick={() => setCount(0)}>
        <Icon name="reset" />
        重置
      </Button>
    </div>
  )
}

function SwitchDemo() {
  return (
    <label class="sample-panel flex items-center gap-3">
      <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eef6e2] text-[#496438]">
        <Icon name="bell" />
      </span>
      <span class="grow font-semibold">消息通知</span>
      <Switch defaultChecked class="switch-track" aria-label="消息通知">
        <SwitchThumb class="switch-thumb" />
      </Switch>
    </label>
  )
}

const periods = [
  { id: 'week', name: '本周', visits: '2,418', bars: [28, 49, 35, 64, 52, 77, 92] },
  { id: 'month', name: '本月', visits: '9,602', bars: [46, 31, 63, 44, 80, 92, 73] },
]

function TabsDemo() {
  return (
    <Tabs defaultValue="week" class="sample-panel">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-medium text-muted">访问量</span>
        <TabsList aria-label="访问量统计周期" class="flex rounded-md bg-stone-100 p-0.5">
          <For each={periods}>
            {(period) => (
              <TabsTab class="period-tab" value={period.id}>
                {period.name}
              </TabsTab>
            )}
          </For>
        </TabsList>
      </div>
      <For each={periods}>
        {(period) => (
          <TabsPanel value={period.id} class="mt-2">
            <div class="flex items-end justify-between gap-3">
              <strong class="font-display text-[1.65rem] leading-none">{period.visits}</strong>
              <span class="flex h-7 items-end gap-1" aria-hidden="true">
                <For each={period.bars}>
                  {(height) => (
                    <i class="w-2 rounded-t-[2px] bg-[#c16c47]" style={{ height: `${height}%` }} />
                  )}
                </For>
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
    <Slider defaultValue={65} aria-label="音量设置" class="sample-panel">
      <div class="flex items-center gap-2">
        <Icon name="volume" />
        <span class="grow font-semibold">音量</span>
        <span class="font-display tabular-nums">
          <SliderValue />%
        </span>
      </div>
      <SliderControl class="mt-1 flex h-7 items-center">
        <SliderTrack class="relative block h-1.5 w-full rounded-full bg-[#e9dfc6]">
          <SliderIndicator class="h-full rounded-full bg-[#845c1e]" />
          <SliderThumb aria-label="音量" class="slider-thumb" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}

function CheckboxDemo() {
  return (
    <div class="sample-panel grid gap-2.5">
      <For each={['设计稿', '交互原型']}>
        {(item) => (
          <label class="flex cursor-pointer items-center gap-2.5">
            <Checkbox defaultChecked={item === '设计稿'} aria-label={item} class="check-box">
              <CheckboxIndicator>
                <Icon name="check" />
              </CheckboxIndicator>
            </Checkbox>
            {item}
          </label>
        )}
      </For>
    </div>
  )
}

function AccordionDemo() {
  return (
    <Accordion aria-label="组件说明" class="sample-panel">
      <AccordionItem value="keyboard">
        <AccordionHeader>
          <AccordionTrigger class="accordion-trigger flex w-full items-center justify-between gap-2 py-1 font-semibold">
            键盘怎么操作？
            <Icon name="chevronDown" />
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel class="pt-2 text-xs leading-5 text-muted">
          用 Tab 聚焦标题，按 Enter 或空格展开和收起。
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export const categories = ['全部', '操作', '表单', '布局'] as const
export type Category = (typeof categories)[number]

export const demos = [
  {
    id: 'button',
    title: 'Button',
    name: '按钮',
    category: '操作',
    description: '触发操作，立即得到反馈。',
    canvas: 'canvas-lilac',
    preview: ButtonDemo,
  },
  {
    id: 'switch',
    title: 'Switch',
    name: '开关',
    category: '表单',
    description: '一键切换设置的开关状态。',
    canvas: 'canvas-mint',
    preview: SwitchDemo,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    name: '标签页',
    category: '布局',
    description: '在同一区域切换关联内容。',
    canvas: 'canvas-peach',
    preview: TabsDemo,
  },
  {
    id: 'slider',
    title: 'Slider',
    name: '滑块',
    category: '表单',
    description: '拖动或使用方向键调整数值。',
    canvas: 'canvas-butter',
    preview: SliderDemo,
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    name: '复选框',
    category: '表单',
    description: '从一组选项中选择多个项目。',
    canvas: 'canvas-rose',
    preview: CheckboxDemo,
  },
  {
    id: 'accordion',
    title: 'Accordion',
    name: '折叠面板',
    category: '布局',
    description: '按需展开或收起详细说明。',
    canvas: 'canvas-sky',
    preview: AccordionDemo,
  },
] as const

export type Demo = (typeof demos)[number]
