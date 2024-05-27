import { test, expect } from '@playwright/test';

test('login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173/dashboard');
});

test('login with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'invalidpassword');
    await page.click('button[type="submit"]');
    await expect(page).toHaveText('Invalid username or password', { timeout: 5000 }); // Adjust the error message selector
});
