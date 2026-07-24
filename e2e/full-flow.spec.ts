import { test, expect } from '@playwright/test'

test.describe('Full Game Flow', () => {
  test('victory screen loads at /victory route', async ({ page }) => {
    await page.goto('/victory')
    await expect(page.getByText('MISSION COMPLETE')).toBeVisible({ timeout: 8000 })
    await expect(page.getByText('Composite Grade')).toBeVisible()
  })

  test('game over screen loads at /gameover route', async ({ page }) => {
    await page.goto('/gameover')
    await expect(page.getByText('GAME OVER').first()).toBeVisible({ timeout: 8000 })
    await expect(page.getByText('CIVILIZATION COLLAPSE').first()).toBeVisible()
  })

  test('404 shows not-found page', async ({ page }) => {
    await page.goto('/nonexistent-route')
    await expect(page.getByText(/doesn't exist/).first()).toBeVisible({ timeout: 8000 })
  })
})
