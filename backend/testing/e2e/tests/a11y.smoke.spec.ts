import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * axe smoke on public login.
 *
 * Gate: zero **critical** violations (CI fail).
 * Serious color-contrast on muted login chrome is a known residual
 * (see phase12-a11y-summary.md) — tracked for token hardening, not silent-skipped forever.
 *
 * Also disable `aria-valid-attr-value` — Radix Tabs ID false positive with axe 4.x.
 */
test.describe('Accessibility smoke @smoke @a11y', () => {
  test('login page has no critical axe violations', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading').first()).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['aria-valid-attr-value'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');

    expect(
      critical,
      critical.map((v) => `${v.id}: ${v.help}`).join('\n') || 'ok',
    ).toEqual([]);
  });
});
