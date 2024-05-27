import { test, expect, devices } from '@playwright/test';

test.use({
    ...devices['iPhone 12'],
});

test('homepage looks correct on mobile', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.screenshot({ path: 'screenshots/homepage-mobile.png' });
    await expect(page.locator('nav')).toBeVisible(); // Ensure the navigation bar is visible on mobile
});
