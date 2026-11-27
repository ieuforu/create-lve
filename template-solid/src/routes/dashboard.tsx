import { Title } from '@solidjs/meta'
import { useSearchParams } from '@solidjs/router'
import { createMemo, For, Match, Show, Switch as View } from 'solid-js'
import { createNotifications, DashboardLayout, Distribution, Toast } from '../design-system'
import { StudioFooter, StudioSiteHeader } from '../components/StudioSite'
import { DeskFiles, statusTone } from '../components/DeskFiles'
import StudioSettings from '../components/StudioSettings'
import { files, useStudioProfile } from '../components/studioData'
import s from '../components/Desk.module.css'

const links = [
  { label: '总览', href: '/dashboard' },
  { label: '文件', href: '/dashboard?view=files' },
  { label: '工作室资料', href: '/dashboard?view=settings' },
]
const groups = [
  { label: '工作区', links: links.slice(0, 2) },
  { label: '设置', links: links.slice(2) },
]
const summaries = ['草稿', '校对中', '已定稿'].map((label) => ({
  label,
  tone: statusTone(label),
  value: files.filter((f) => f.stage === label).length,
}))

export default function Dashboard() {
  const [params] = useSearchParams()
  const section = createMemo(() =>
    params.view === 'files' ? links[1]! : params.view === 'settings' ? links[2]! : links[0]!,
  )
  const { profile, save } = useStudioProfile()
  const toast = createNotifications()
  return (
    <div lang="zh-CN">
      <Title>{section().label} · Forma 工作台</Title>
      <StudioSiteHeader active="/dashboard" />
      <DashboardLayout title="Studio Desk" groups={groups} active={section().href}>
        <header class={s.pageHead} data-settings={section() === links[2]}>
          <div>
            <Show when={section() !== links[2]}>
              <p>{profile().name}</p>
            </Show>
            <h1>{section() === links[0] ? '工作室总览' : section().label}</h1>
            <Show when={section() === links[2]}>
              <p>保存后，名称和简介会显示在作品集首页。</p>
            </Show>
          </div>
          <a class={s.textLink} href="/portfolio">
            查看作品集 ↗
          </a>
        </header>
        <View>
          <Match when={section() === links[0]}>
            <div class={s.summary}>
              <div class={s.metrics}>
                <h2>文件概况</h2>
                <div class={s.total}>
                  {files.length}
                  <small> 个文件</small>
                </div>
                <dl>
                  <For each={summaries}>
                    {(item) => (
                      <div>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    )}
                  </For>
                </dl>
              </div>
              <section class={s.panel}>
                <h2>印刷格式</h2>
                <Distribution
                  label="按文件格式统计"
                  items={(['PDF', 'INDD', 'TIFF'] as const).map((label, i) => ({
                    label,
                    value: files.filter((f) => f.format === label).length,
                    tone: (['accent', 'warning', 'success'] as const)[i]!,
                  }))}
                />
              </section>
            </div>
            <DeskFiles preview />
          </Match>
          <Match when={section() === links[1]}>
            <DeskFiles />
          </Match>
          <Match when={section() === links[2]}>
            <StudioSettings
              profile={profile()}
              onSave={(next) => {
                const stored = save(next)
                toast(stored ? '工作室资料已保存' : '资料已更新，浏览器存储不可用')
              }}
            />
          </Match>
        </View>
      </DashboardLayout>
      <Toast toaster={toast} />
      <StudioFooter active="/dashboard" />
    </div>
  )
}
