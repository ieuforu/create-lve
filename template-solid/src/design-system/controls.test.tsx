import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, expect, test } from 'vitest'
import { Button, Switch } from './index'

afterEach(cleanup)

test('a button forwards its handler, label and class as its variant changes', async () => {
  function Example() {
    const [selected, setSelected] = createSignal(false)
    return (
      <Button
        class={selected() ? 'selected-action' : 'default-action'}
        variant={selected() ? 'chip' : 'secondary'}
        aria-pressed={selected() ? 'true' : 'false'}
        onClick={() => setSelected((value) => !value)}
      >
        收藏
      </Button>
    )
  }

  render(() => <Example />)
  const button = screen.getByRole('button', { name: '收藏' })
  expect(button).toHaveClass('default-action')
  expect(button).toHaveAttribute('data-variant', 'secondary')
  fireEvent.click(button)
  await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'))
  expect(button).toHaveAttribute('data-variant', 'chip')
  expect(button).toHaveClass('selected-action')
  expect(button).not.toHaveClass('default-action')
})

test('a controlled switch follows owner updates and forwards user changes', async () => {
  function Example() {
    const [notifications, setNotifications] = createSignal(false)
    return (
      <>
        <Switch aria-label="通知" checked={notifications()} onCheckedChange={setNotifications} />
        <Button onClick={() => setNotifications(true)}>启用</Button>
        <output>{notifications() ? '已启用' : '已关闭'}</output>
      </>
    )
  }

  render(() => <Example />)
  const toggle = screen.getByRole('switch', { name: '通知' })
  fireEvent.click(screen.getByRole('button', { name: '启用' }))
  await waitFor(() => expect(toggle).toBeChecked())
  fireEvent.click(toggle)
  await waitFor(() => expect(toggle).not.toBeChecked())
  expect(screen.getByText('已关闭')).toBeVisible()
})
