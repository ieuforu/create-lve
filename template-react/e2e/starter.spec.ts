import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://api.dicebear.com/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>',
    }),
  )
})

test('the production landing page opens and confirms the project preview', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('textbox', { name: 'Project name' }).fill('A small project')
  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await page.getByRole('button', { name: 'Open A small project project preview' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Confirm', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('status')).toContainText('Example confirmed.')
})

test('the compiled virtual list scrolls, loads more, and preserves search through detail navigation', async ({
  page,
}) => {
  await page.goto('/examples/users')
  const search = page.getByRole('textbox', { name: 'Search people' })
  const rows = page.locator('a[href*="/examples/users/"]')
  await expect(rows.first()).toBeVisible()
  const firstUser = await rows.first().textContent()
  const list = page.getByRole('region', { name: 'People' })
  await list.hover()
  await page.mouse.wheel(0, 3_200)
  await expect(rows.first()).not.toHaveText(firstUser ?? '')
  await expect(page.locator('a[href*="/examples/users/51"]')).toBeVisible()

  await search.fill('emma')
  await expect(page).toHaveURL(/q=emma/)
  await expect(rows.first()).toContainText(/emma/i)
  await rows.first().click()
  await expect(page).toHaveURL(/\/examples\/users\/\d+\?q=emma/)
  await page.getByRole('link', { name: 'Back to users', exact: true }).click()
  await expect(search).toHaveValue('emma')
  await page.reload()
  await expect(search).toHaveValue('emma')
})

test('settings use URL state and accessible switches on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/examples/settings')
  const fullName = page.getByRole('textbox', { name: 'Full name' })
  await expect(fullName).toBeVisible()
  const field = await fullName.boundingBox()
  expect(field).not.toBeNull()
  expect(field!.x + field!.width).toBeLessThanOrEqual(390)
  expect(field!.width).toBeGreaterThan(200)
  await page.getByRole('button', { name: 'Notifications', exact: true }).click()
  await expect(page).toHaveURL(/section=notifications/)
  const updates = page.getByRole('switch', { name: 'Product updates' })
  await expect(updates).toBeChecked()
  await updates.focus()
  await page.keyboard.press('Space')
  await expect(updates).not.toBeChecked()
  await page.reload()
  await expect(updates).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible()
})

test('theme preferences survive navigation and reload, and follow system changes', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/examples/settings?section=appearance')
  const root = page.locator('html')
  await expect(root).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Dark', exact: true }).click()
  await expect(root).toHaveClass(/dark/)
  await page.getByRole('link', { name: 'React Starter', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(root).toHaveClass(/dark/)
  await page.reload()
  await expect(root).toHaveClass(/dark/)
  await page.goto('/examples/settings?section=appearance')
  await expect(page.getByRole('button', { name: 'Dark', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'System', exact: true }).click()
  await expect(root).toHaveClass(/dark/)
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(root).not.toHaveClass(/dark/)
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(root).toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Light', exact: true }).click()
  await expect(root).not.toHaveClass(/dark/)
})
