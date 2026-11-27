import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { createAgent } from '@ui-sdk/solid/agent'
import { afterEach, expect, test } from 'vitest'
import SearchField from './SearchField'

afterEach(cleanup)

test('Clear appears for text, empties the field and returns focus for further typing', async () => {
  render(() => <SearchField />)
  const input = screen.getByRole('searchbox', { name: 'Search' })
  const clearButton = () => screen.queryByRole('button', { name: 'Clear' })
  expect(clearButton()).not.toBeInTheDocument()

  fireEvent.input(input, { target: { value: 'Solid' } })
  const clear = await screen.findByRole('button', { name: 'Clear' })
  clear.focus()
  fireEvent.click(clear)
  await waitFor(() => expect(clearButton()).not.toBeInTheDocument())
  expect(input).toHaveValue('')
  expect(input).toHaveFocus()

  fireEvent.input(input, { target: { value: ' ' } })
  expect(await screen.findByRole('button', { name: 'Clear' })).toBeVisible()
  fireEvent.input(input, { target: { value: '' } })
  await waitFor(() => expect(clearButton()).not.toBeInTheDocument())
})

test('the SDK exposes the labeled search field and updates its displayed value', async () => {
  const agent = createAgent()
  render(() => <SearchField />)
  const result = await agent.act({
    steps: [{ ref: 'Search', action: 'setValue', args: ['Solid'] }],
  })
  expect(result.ok, result.error?.message).toBe(true)
  expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('Solid')
  expect(screen.getByRole('button', { name: 'Clear' })).toBeVisible()
})
