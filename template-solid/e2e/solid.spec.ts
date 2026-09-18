import { expect, test } from '@playwright/test'

test('navigates through a query-backed route', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Solid, without the maze.' })).toBeVisible()

  await page.getByRole('link', { name: 'Query example', exact: true }).click()
  await expect(page).toHaveURL(/\/users\/1$/)
  await expect(page.getByRole('heading', { name: 'Ada Lovelace' })).toBeVisible()
})
