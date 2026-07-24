import { test, expect } from '@playwright/test'

test.describe('Detective Mode', () => {
  test('loads case 1 without crashing', async ({ page }) => {
    await page.goto('/detective/case-01')
    await page.waitForTimeout(3000)
    const errorText = page.locator('text=cannot|error|failed|unexpected').first()
    const hasError = await errorText.isVisible().catch(() => false)
    expect(hasError).toBe(false)
  })
})
