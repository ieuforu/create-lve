import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SettingsPage } from './SettingsPage'

it('associates profile labels and descriptions with their fields', () => {
  render(<SettingsPage section="profile" onSectionChange={() => {}} />)
  expect(screen.getByRole('textbox', { name: 'Full name' })).toHaveValue('John Doe')
  expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
    'Used for sign-in and notifications',
  )
  expect(screen.getByRole('textbox', { name: 'Username' })).toBeVisible()
  expect(screen.getByRole('textbox', { name: 'Bio' })).toBeVisible()
})

it('supports keyboard-operated notification switches and reports section changes', async () => {
  const user = userEvent.setup()
  const onSectionChange = vi.fn()
  render(<SettingsPage section="notifications" onSectionChange={onSectionChange} />)
  const updates = screen.getByRole('switch', { name: 'Product updates' })
  expect(updates).toBeChecked()
  updates.focus()
  await user.keyboard(' ')
  expect(updates).not.toBeChecked()
  await user.click(screen.getByRole('button', { name: 'Security' }))
  expect(onSectionChange).toHaveBeenCalledWith('security')
})
