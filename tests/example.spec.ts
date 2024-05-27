import { test, expect } from '@playwright/test';

test('homepage has title GuestLink', async ({ page }) => {
    const url = 'http://localhost:5173/';
    await page.goto(url);
    await expect(page).toHaveTitle(/GuestLink/); // Ensure this matches your app's title

});
