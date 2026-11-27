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
  expect(screen.getAllByRole('article')).toHaveLength(6)
  fireEvent.click(screen.getByRole('button', { name: '表单' }))
  await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3))
  const agent = createAgent()
  const result = await agent.act({
    steps: [{ ref: '搜索组件', action: 'setValue', args: ['SWITCH'] }],
  })
  expect(result.ok, result.error?.message).toBe(true)
  expect(screen.getAllByRole('article')).toHaveLength(1)
  expect(screen.getByRole('switch', { name: '消息通知' })).toBeVisible()
  fireEvent.input(screen.getByRole('searchbox'), { target: { value: '无匹配' } })
  fireEvent.click(await screen.findByRole('button', { name: '查看全部组件' }))
  await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(6))
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
