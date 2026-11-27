import { demos } from './ComponentDemos'
import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { createAgent } from '@ui-sdk/solid/agent'
import { afterEach, expect, test } from 'vitest'
import Home from '../routes/index'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

test('combines category and text filters and clears them when returning to all components', async () => {
  render(() => <Home />)
  expect(screen.getAllByRole('article')).toHaveLength(demos.length)
  fireEvent.click(screen.getByRole('button', { name: '表单' }))
  await waitFor(() =>
    expect(screen.getAllByRole('article')).toHaveLength(
      demos.filter((d) => d.category === '表单').length,
    ),
  )
  const agent = createAgent()
  const result = await agent.act({
    steps: [{ ref: '搜索组件', action: 'setValue', args: ['SWITCH'] }],
  })
  expect(result.ok, result.error?.message).toBe(true)
  expect(screen.getAllByRole('article')).toHaveLength(1)
  expect(screen.getByRole('switch', { name: '消息通知' })).toBeVisible()
  fireEvent.input(screen.getByRole('searchbox'), { target: { value: '无匹配' } })
  fireEvent.click(await screen.findByRole('button', { name: '查看全部组件' }))
  await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(demos.length))
  expect(screen.getByRole('searchbox')).toHaveValue('')
})

test('restores saved components and supports removal from the favorites view', async () => {
  const view = render(() => <Home />)
  fireEvent.click(screen.getByRole('button', { name: '收藏滑块' }))
  await waitFor(() =>
    expect(screen.getByRole('button', { name: '收藏滑块' })).toHaveAttribute(
      'aria-pressed',
      'true',
    ),
  )
  view.unmount()
  render(() => <Home />)
  fireEvent.click(await screen.findByRole('button', { name: /收藏夹/ }))
  await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))
  expect(screen.getByRole('slider', { name: '音量' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '收藏滑块' }))
  expect(await screen.findByText(/收藏夹为空/)).toBeVisible()
})

test('changes featured work and moves completed tasks between workspace views', async () => {
  render(() => <Home />)
  fireEvent.click(screen.getByRole('button', { name: '下一件作品' }))
  expect(await screen.findByRole('heading', { name: '圆的负空间' })).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: '待处理' }))
  fireEvent.click(screen.getByRole('checkbox', { name: '整理海报草稿' }))
  await waitFor(() => expect(screen.queryByRole('checkbox', { name: '整理海报草稿' })).toBeNull())
  fireEvent.click(screen.getByRole('button', { name: '已完成' }))
  expect(await screen.findByRole('checkbox', { name: '整理海报草稿' })).toBeChecked()
})

test('switches distribution units and retains file changes when switching layouts', async () => {
  render(() => <Home />)
  fireEvent.click(screen.getByRole('button', { name: '显示占比' }))
  expect(await screen.findByText('75%')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: '显示页数' }))
  await waitFor(() => expect(screen.queryByText('75%')).toBeNull())
  const trigger = screen.getByRole('button', { name: '折线练习的操作' })
  trigger.focus()
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  await waitFor(() => expect(document.activeElement).toHaveTextContent('移动到'))
  fireEvent.keyDown(document.activeElement!, { key: 'End' })
  await waitFor(() => expect(document.activeElement).toHaveTextContent('创建副本'))
  fireEvent.keyDown(document.activeElement!, { key: 'Enter' })
  fireEvent.click(screen.getByRole('button', { name: '网格' }))
  expect(await screen.findByRole('button', { name: '折线练习 副本的操作' })).toBeVisible()
})
