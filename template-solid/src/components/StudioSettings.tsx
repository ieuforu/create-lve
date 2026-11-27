import { createMemo, createSignal, For, Show } from 'solid-js'
import { Radio, RadioGroup, RadioIndicator } from '@ui-sdk/solid/radio'
import { Button, Field, Icon, Input, Textarea } from '../design-system'
import { papers, type StudioProfile } from './studioData'
import s from './StudioSettings.module.css'

const rosetteAngles = Array.from({ length: 12 }, (_, index) => index * 15)

export default function StudioSettings(props: {
  profile: StudioProfile
  onSave: (next: StudioProfile) => void
}) {
  const [name, setName] = createSignal(() => props.profile.name)
  const [intro, setIntro] = createSignal(() => props.profile.intro)
  const [paper, setPaper] = createSignal(() => props.profile.paper)
  const [submitted, setSubmitted] = createSignal(false)
  const dirty = createMemo(
    () =>
      name() !== props.profile.name ||
      intro() !== props.profile.intro ||
      paper() !== props.profile.paper,
  )

  return (
    <div class={s.layout}>
      <form
        class={s.editor}
        aria-labelledby="profile-fields"
        novalidate
        onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const values = new FormData(form)
          const title = String(values.get('name') ?? '').trim()
          setSubmitted(true)
          if (!title) {
            form.querySelector<HTMLInputElement>('input[name="name"]')?.focus()
            return
          }
          const description = String(values.get('intro') ?? '').trim()
          props.onSave({ name: title, intro: description, paper: paper() })
          setName(title)
          setIntro(description)
          setSubmitted(false)
        }}
      >
        <h2 id="profile-fields">公开资料</h2>
        <Field
          name="name"
          label="工作室名称（必填）"
          error={submitted() && !name().trim() ? '请输入工作室名称。' : undefined}
        >
          <Input
            name="name"
            class={s.entry}
            value={name()}
            onValueChange={setName}
            required
            maxlength={60}
            autocomplete="organization"
          />
        </Field>
        <div class={s.bio}>
          <Field name="intro" label="工作室简介">
            <Textarea
              name="intro"
              class={s.entry}
              rows={3}
              maxlength={200}
              value={intro()}
              onValueChange={setIntro}
            />
          </Field>
          <span class={s.count} aria-hidden="true">
            {intro().length} / 200
          </span>
        </div>
        <Field label="常用纸张">
          <RadioGroup
            name="paper"
            value={paper()}
            onValueChange={(value) => {
              if (value) setPaper(value)
            }}
            class={s.stocks}
          >
            <For each={papers}>
              {(stock) => (
                <Radio value={stock.value} aria-label={stock.label} class={s.stock}>
                  <span class={s.chip} data-stock={stock.value} aria-hidden="true">
                    <RadioIndicator>
                      <Icon name="check" />
                    </RadioIndicator>
                  </span>
                  {stock.label}
                </Radio>
              )}
            </For>
          </RadioGroup>
        </Field>
        <div class={s.save}>
          <span class={s.state} data-dirty={dirty()}>
            {dirty() ? '有未保存的修改' : '资料保存在当前浏览器'}
          </span>
          <Button type="submit">保存资料</Button>
        </div>
      </form>

      <figure class={s.proof} aria-label="工作室名片预览">
        <figcaption>
          <span>名片预览</span>
          <span>{papers.find((stock) => stock.value === paper())?.label}</span>
        </figcaption>
        <div class={s.desk}>
          <div class={s.sheet} data-stock={paper()}>
            <div class={s.rosette} aria-hidden="true">
              <For each={rosetteAngles}>
                {(angle) => <i style={{ transform: `rotate(${angle}deg)` }} />}
              </For>
            </div>
            <div class={s.signature}>
              <strong>{name().trim() || '工作室名称'}</strong>
              <Show when={intro().trim()}>
                <p>{intro().trim()}</p>
              </Show>
            </div>
          </div>
        </div>
      </figure>
    </div>
  )
}
