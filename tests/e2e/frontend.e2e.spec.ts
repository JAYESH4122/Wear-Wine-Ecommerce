import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('tracking requires contact details without putting them in the URL', async ({ page }) => {
    await page.goto('/track-order?orderId=WW-TEST&email=private@example.com')

    await expect(page.getByRole('heading', { name: /track your order/i })).toBeVisible()
    await expect(page.getByLabel(/email or phone number/i)).toHaveValue('')
    await expect(page.getByLabel(/exact order id/i)).toHaveValue('WW-TEST')
    await expect(page).not.toHaveURL(/email=/)
    await expect(page.getByLabel(/email or phone number/i)).toHaveAttribute('required', '')
  })
})
