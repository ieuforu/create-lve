import { expect, test } from '@playwright/test'

test('the production landing tells the architecture story', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make more.')
  await expect(page.getByRole('heading', { name: 'A structure you can explain.' })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(4)

  await page.getByRole('link', { name: /See the flow/ }).click()
  await expect(page).toHaveURL(/#flow$/)
  await expect(page.getByLabel('Application architecture flow')).toContainText(
    'request→route→feature→ui + query',
  )
})

test('the landing remains inside a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const width = await page.evaluate('document.documentElement.scrollWidth')
  expect(width).toBeLessThanOrEqual(390)
})

test('an unknown route renders the feature-owned not-found page', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This route ends here.')
  await expect(page.getByText('404', { exact: true })).toBeVisible()

  await page.getByRole('link', { name: /Back home/ }).click()
  await expect(page).toHaveURL(/\/$/)
})
