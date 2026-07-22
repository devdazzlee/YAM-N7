import { test, expect } from '@playwright/test';

// All pages to test
const pages = [
  // Main Pages
  { path: '/', name: 'Home' },
  { path: '/shop', name: 'Shop' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  
  // E-commerce Pages
  { path: '/cart', name: 'Cart' },
  { path: '/checkout', name: 'Checkout' },
  { path: '/checkout/thank-you', name: 'Order Confirmation' },
  { path: '/wishlist', name: 'Wishlist' },
  { path: '/compare', name: 'Compare Products' },
  
  // User Account Pages
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/account', name: 'My Account' },
  { path: '/account/orders', name: 'My Orders' },
  { path: '/account/profile', name: 'Profile Settings' },
  { path: '/account/addresses', name: 'Address Book' },
  { path: '/account/track-order', name: 'Track Order' },
  
  // Category Pages
  { path: '/categories/perfumes', name: 'Perfumes Category' },
  { path: '/categories/mens', name: 'Mens Fragrances Category' },
  { path: '/categories/womens', name: 'Womens Fragrances Category' },
  { path: '/categories/gift-sets', name: 'Gift Sets Category' },
  { path: '/categories/attars', name: 'Attars Category' },
  { path: '/categories/oud', name: 'Oud Category' },
  { path: '/categories/body-mists', name: 'Body Mists Category' },
  { path: '/categories/pulses-rice', name: 'Pulses & Rice Category' },
  { path: '/categories/oil', name: 'Oil Category' },
  
  // Product Pages
  { path: '/products/1', name: 'Product Detail 1' },
  { path: '/products/2', name: 'Product Detail 2' },
  
  // Informational Pages
  { path: '/faq', name: 'FAQ' },
  { path: '/shipping-returns', name: 'Shipping & Returns' },
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/terms-conditions', name: 'Terms & Conditions' },
  { path: '/payment-methods', name: 'Payment Methods' },
  
  // Specialty Pages
  { path: '/herbal-remedies', name: 'Attars & Body Mists' },
  { path: '/custom-formulas', name: 'Custom Formulas' },
  { path: '/saffron', name: 'Oud Collection' },
  { path: '/gift-packs', name: 'Gift Packs' },
  
  // Marketing Pages
  { path: '/blog', name: 'Blog' },
  { path: '/offers', name: 'Offers' },
  { path: '/new-arrivals', name: 'New Arrivals' },
  { path: '/best-sellers', name: 'Best Sellers' },
  { path: '/deals', name: 'Deals' },
  
  // Utility Pages
  { path: '/sitemap', name: 'Sitemap' },
  { path: '/search', name: 'Search' },
  
  // Forms & Service Pages
  { path: '/newsletter-signup', name: 'Newsletter Signup' },
  { path: '/wholesale', name: 'Wholesale' },
  { path: '/supplier', name: 'Supplier' },
  { path: '/feedback', name: 'Feedback' },
  { path: '/support', name: 'Support' },
  
  // Optional Pages
  { path: '/recipes', name: 'Recipes' },
  { path: '/ingredient-sourcing', name: 'Ingredient Sourcing' },
  { path: '/reviews', name: 'Reviews' },
];

test.describe('All Pages Test Suite', () => {
  for (const page of pages) {
    test(`should load ${page.name} page successfully`, async ({ page: browserPage }) => {
      // Navigate to the page
      await browserPage.goto(page.path);
      
      // Wait for page to load
      await browserPage.waitForLoadState('networkidle');
      
      // Check that page loaded without errors
      await expect(browserPage).toHaveTitle(/.+/);
      
      // Check that main content is visible (header should be present)
      const header = browserPage.locator('header');
      await expect(header).toBeVisible();
      
      // Check that footer is present
      const footer = browserPage.locator('footer');
      await expect(footer).toBeVisible();
      
      // Take screenshot for visual verification
      await browserPage.screenshot({ 
        path: `tests/screenshots/${page.name.replace(/\s+/g, '-')}.png`,
        fullPage: true 
      });
    });
  }
});

test.describe('Navigation Tests', () => {
  test('should navigate from home to shop', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Shop');
    await expect(page).toHaveURL(/.*shop/);
  });

  test('should navigate to cart from header', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/cart"]');
    await expect(page).toHaveURL(/.*cart/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Component Tests', () => {
  test('should display header with logo', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('img[alt="YAM-N7"]');
    await expect(logo).toBeVisible();
  });

  test('should display services section', async ({ page }) => {
    await page.goto('/');
    const services = page.locator('text=Free Shipping');
    await expect(services).toBeVisible();
  });

  test('should display footer with links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=About')).toBeVisible();
  });
});

test.describe('Form Tests', () => {
  test('should display contact form', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should display register form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Product Tests', () => {
  test('should display products on shop page', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.locator('text=Shop')).toBeVisible();
    // Check for product cards
    const productCards = page.locator('[class*="ProductCard"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('should display product details page', async ({ page }) => {
    await page.goto('/products/1');
    await expect(page.locator('h1')).toBeVisible();
    // Check for price
    await expect(page.locator('text=Rs.')).toBeVisible();
  });
});

test.describe('Responsive Design Tests', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    // Check mobile menu button
    const menuButton = page.locator('button[aria-label="Menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });
});

test.describe('Color Scheme Tests', () => {
  test('should use correct color scheme', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    const headerBg = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Header should have white background
    expect(headerBg).toContain('rgb(255, 255, 255)');
  });
});

