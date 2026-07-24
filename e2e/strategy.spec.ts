import { test, expect } from '@playwright/test'

test.describe('Strategy Mode', () => {
  test('navigates from title screen to strategy mode', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByAltText('GIHA Logo')).toBeVisible()
    await expect(page.getByText('New Game')).toBeVisible()
    await page.getByText('New Game').click()
    await expect(page.getByTestId('city-canvas')).toBeVisible({ timeout: 8000 })
  })

  test('HUD displays after strategy loads', async ({ page }) => {
    await page.goto('/')
    await page.getByText('New Game').click()
    await page.waitForSelector('[data-testid="city-canvas"]', { timeout: 8000 })
    await page.waitForSelector('[data-testid="city-canvas"]', { timeout: 8000 })
    await page.waitForTimeout(1500)
    const hudLabel = page.getByText('Media Literacy').first()
    await expect(hudLabel).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Spread Rate').first()).toBeVisible()
    await expect(page.getByText('Budget').first()).toBeVisible()
  })
})
