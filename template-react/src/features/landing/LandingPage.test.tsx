import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { LandingPage } from './LandingPage'

it('presents one clear application flow', () => {
  render(<LandingPage />)

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Make more.Carry less.')
  expect(screen.getByRole('heading', { name: 'A structure you can explain.' })).toBeVisible()
  expect(screen.getAllByRole('article')).toHaveLength(4)
  expect(screen.getByLabelText('Application architecture flow')).toHaveTextContent(
    'request→route→feature→ui + query',
  )
  expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/ieuforu/create-lve',
  )
})
