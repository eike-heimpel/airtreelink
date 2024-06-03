import { test, expect } from '@playwright/test';

test('homepage has title GuestLink', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/GuestLink/);
});

test('navigate to about page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.click('a[href="/about"]'); // Adjust the selector based on your app
    await expect(page).toHaveURL('http://localhost:5173/about');
});
