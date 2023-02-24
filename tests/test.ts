import { expect, test } from '@playwright/test';

test('home page has Strømpris in title', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toContain('Strømpris');
});
