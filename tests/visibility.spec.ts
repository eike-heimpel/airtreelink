import { test, expect } from '@playwright/test';

test('check visibility of elements on homepage', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.locator('h1')).toBeVisible(); // Ensure the main heading is visible
    await expect(page.locator('nav')).toBeVisible(); // Ensure the navigation bar is visible
    await expect(page.locator('footer')).toBeVisible(); // Ensure the footer is visible
});
