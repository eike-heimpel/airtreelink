import { test, expect } from '@playwright/test';

test('take screenshot of homepage', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.screenshot({ path: 'screenshots/homepage.png' });
});
