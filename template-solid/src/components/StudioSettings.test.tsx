import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { createAgent } from '@ui-sdk/solid/agent'
import { afterEach, expect, test, vi } from 'vitest'
import StudioSettings from './StudioSettings'

afterEach(cleanup)

test('focuses an empty name and submits trimmed profile fields', async () => {
  const saved = vi.fn()
  render(() => (
    <StudioSettings
      profile={{ name: 'Forma', intro: '纸上实验', paper: 'uncoated' }}
      onSave={saved}
    />
  ))
  const agent = createAgent()
  const setName = async (value: string) => {
    const result = await agent.act({
      steps: [{ ref: '工作室名称（必填）', action: 'setValue', args: [value] }],
    })
    expect(result.ok, result.error?.message).toBe(true)
  }
  await setName(' ')
  fireEvent.click(screen.getByRole('button', { name: '保存资料' }))
  expect(await screen.findByText('请输入工作室名称。')).toBeVisible()
  expect(screen.getByRole('textbox', { name: /工作室名称/ })).toHaveFocus()
  expect(saved).not.toHaveBeenCalled()
  await setName('  春季印社  ')
  const preview = screen.getByRole('figure', { name: '工作室名片预览' })
  expect(preview).toHaveTextContent('春季印社')
  fireEvent.click(screen.getByRole('radio', { name: '再生纸' }))
  await waitFor(() => expect(preview).toHaveTextContent('再生纸'))
  fireEvent.click(screen.getByRole('button', { name: '保存资料' }))
  await waitFor(() =>
    expect(saved).toHaveBeenCalledWith({ name: '春季印社', intro: '纸上实验', paper: 'recycled' }),
  )
})
