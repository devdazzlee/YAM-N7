import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage should match design', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  });

  test('shop page should match design', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('shop-page.png', { fullPage: true });
  });

  test('product page should match design', async ({ page }) => {
    await page.goto('/products/1');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('product-page.png', { fullPage: true });
  });

  test('cart page should match design', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('cart-page.png', { fullPage: true });
  });
});

