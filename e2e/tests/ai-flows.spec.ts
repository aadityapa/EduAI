import { test, expect } from '@playwright/test';

test.describe('AI Tutor Chat', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('student AI tutor route requires auth', async ({ page }) => {
    await page.goto('/student/ai/tutor');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Homework Assistant', () => {
  test('homework route requires auth', async ({ page }) => {
    await page.goto('/student/ai/homework');
    await expect(page).toHaveURL(/login/);
  });
});
