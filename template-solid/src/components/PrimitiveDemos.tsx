import { createSignal } from 'solid-js'
import {
  Button,
  Field,
  IconButton,
  Input,
  Popover,
  Select,
  Textarea,
  Toast,
  Tooltip,
  createNotifications,
} from '../design-system'
import { papers } from './studioData'
import s from './ComponentDemos.module.css'

export function InputDemo() {
  const [value, setValue] = createSignal('')
  const [visited, setVisited] = createSignal(false)
  return (
    <div class={s.panel}>
      <Field
        label="文件名"
        description="用于标识这份打样。"
        error={visited() && !value().trim() ? '请填写文件名。' : undefined}
      >
        <Input
          placeholder="例如：春季色样"
          value={value()}
          onValueChange={setValue}
          onBlur={() => setVisited(true)}
        />
      </Field>
    </div>
  )
}
export function TextareaDemo() {
  const [text, setText] = createSignal('')
  return (
    <div class={s.panel}>
      <Field label="校对备注" description={`${text().length} / 120`}>
        <Textarea
          rows={2}
          maxlength={120}
          placeholder="写下需要复核的细节"
          value={text()}
          onValueChange={setText}
        />
      </Field>
    </div>
  )
}
export function SelectDemo() {
  return (
    <div class={s.panel}>
      <Field label="打样纸张">
        <Select options={papers} defaultValue="uncoated" />
      </Field>
    </div>
  )
}
export function TooltipDemo() {
  const [marked, setMarked] = createSignal(false)
  return (
    <div class={[s.panel, s.row]}>
      <span class={s.rowLabel}>{marked() ? '已加入书签' : '为色样添加书签'}</span>
      <Tooltip
        text={marked() ? '移除色样书签' : '保存色样书签'}
        trigger={(trigger) => (
          <IconButton
            {...trigger}
            label="色样书签"
            icon={marked() ? 'bookmarkCheck' : 'bookmark'}
            aria-pressed={marked() ? 'true' : 'false'}
            onClick={() => setMarked((v) => !v)}
          />
        )}
      />
    </div>
  )
}
export function PopoverDemo() {
  const [value, setValue] = createSignal('uncoated')
  return (
    <div class={[s.panel, 'grid justify-items-start gap-2']}>
      <span>纸张 · {papers.find((p) => p.value === value())?.label}</span>
      <Popover label="更换纸张" title="印刷用纸">
        <Field label="选择纸张">
          <Select options={papers} value={value()} onValueChange={setValue} />
        </Field>
      </Popover>
    </div>
  )
}
export function ToastDemo() {
  const notify = createNotifications()
  return (
    <>
      <Button onClick={() => notify('打样提醒', { description: '请确认色样后再开始印刷。' })}>
        试用提醒
      </Button>
      <Toast toaster={notify} />
    </>
  )
}
