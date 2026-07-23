import { test, expect } from '@playwright/test';

/**
 * Smoke + characterization: demo login shell and role route guards.
 * @smoke — runs in CI without backend services.
 */
test.describe('Portal smoke @smoke', () => {
  test('login page loads with role tabs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading').first()).toBeVisible();
    // Demo accounts must remain discoverable for sales demos
    await expect(page.locator('body')).toContainText(/student|teacher|parent|admin/i);
  });

  test('student dashboard requires auth', async ({ page }) => {
    await page.goto('/student');
    await expect(page).toHaveURL(/login/);
  });

  test('teacher dashboard requires auth', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page).toHaveURL(/login/);
  });

  test('parent dashboard requires auth', async ({ page }) => {
    await page.goto('/parent');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('AI routes @smoke', () => {
  test('student AI tutor route requires auth', async ({ page }) => {
    await page.goto('/student/ai/tutor');
    await expect(page).toHaveURL(/login/);
  });

  test('homework route requires auth', async ({ page }) => {
    await page.goto('/student/ai/homework');
    await expect(page).toHaveURL(/login/);
  });
});

/**
 * Cross-tenant negative (API-level) — requires live identity.
 * Signed exception in CI: skipped unless EDUAI_E2E_LIVE=true.
 */
test.describe('Cross-tenant negatives @live', () => {
  test.skip(!process.env.EDUAI_E2E_LIVE, 'Requires live Nest stack (EDUAI_E2E_LIVE=true)');

  test('identity health is reachable', async ({ request }) => {
    const identity =
      process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL ?? 'http://localhost:3001';
    const res = await request.get(`${identity}/api/v1/health`);
    expect(res.ok()).toBeTruthy();
  });
});
