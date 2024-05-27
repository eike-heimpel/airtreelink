import { test, expect } from '@playwright/test';

test('fetch data from API and display on page', async ({ page }) => {
    await page.goto('http://localhost:5173/data');
    const response = await page.waitForResponse('**/api/data'); // Adjust the API endpoint
    const data = await response.json();
    expect(data).not.toBeNull();
    await expect(page.locator('.data-item')).toHaveCount(data.length); // Adjust the selector to match the data items on your page
});
