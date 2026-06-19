/**
 * Maps URL paths to human-readable page titles for the route loader.
 */
const STATIC_TITLES: Record<string, string> = {
  '/': 'Home',
  '/shop': 'Shop',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/cart': 'Shopping Cart',
  '/checkout': 'Checkout',
  '/checkout/thank-you': 'Order Confirmation',
  '/login': 'Login',
  '/register': 'Register',
  '/wishlist': 'Wishlist',
  '/search': 'Search',
  '/compare': 'Compare Products',
  '/blog': 'Blog',
  '/faq': 'FAQ',
  '/support': 'Support',
  '/feedback': 'Feedback',
  '/reviews': 'Reviews',
  '/deals': 'Deals',
  '/offers': 'Offers',
  '/new-arrivals': 'New Arrivals',
  '/best-sellers': 'Best Sellers',
  '/gift-packs': 'Gift Packs',
  '/wholesale': 'Wholesale',
  '/supplier': 'Supplier',
  '/sitemap': 'Sitemap',
  '/privacy-policy': 'Privacy Policy',
  '/terms-conditions': 'Terms & Conditions',
  '/shipping-returns': 'Shipping & Returns',
  '/payment-methods': 'Payment Methods',
  '/newsletter-signup': 'Newsletter',
  '/account': 'My Account',
  '/account/profile': 'My Profile',
  '/account/orders': 'My Orders',
  '/account/addresses': 'My Addresses',
  '/account/track-order': 'Track Order',
  '/saffron': 'Saffron',
  '/recipes': 'Recipes',
  '/herbal-remedies': 'Herbal Remedies',
  '/ingredient-sourcing': 'Ingredient Sourcing',
  '/custom-formulas': 'Custom Formulas',
};

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getPageTitleFromPath(pathname: string): string {
  const path = pathname.split('?')[0].split('#')[0] || '/';

  if (STATIC_TITLES[path]) {
    return STATIC_TITLES[path];
  }

  if (path.startsWith('/products/')) {
    return 'Product Details';
  }

  if (path.startsWith('/categories/')) {
    const slug = path.replace('/categories/', '');
    return formatSlug(slug) || 'Category';
  }

  if (path.startsWith('/account/orders/')) {
    return 'Order Details';
  }

  const segment = path.split('/').filter(Boolean).pop();
  if (segment) {
    return formatSlug(segment);
  }

  return 'Page';
}

export function getLoadingMessage(pathname: string): string {
  return `Loading ${getPageTitleFromPath(pathname)}...`;
}
