export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  productId?: string;
  unitName?: string;
  gramsPerUnit?: number;
}

const CART_STORAGE_KEY = 'yamn7_cart';

const UUID_PREFIX =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

/** Real DB product id — cart `id` may be a variation key like `{uuid}-250g`. */
export function resolveCartProductId(item: Pick<CartItem, 'id' | 'productId'>): string {
  if (item.productId) return item.productId;
  const match = item.id.match(UUID_PREFIX);
  return match ? match[1] : item.id;
}

export const cartUtils = {
  // Get all cart items
  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  // Add item to cart
  addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
    if (typeof window === 'undefined') return;
    try {
      const cart = this.getCart();
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        cart.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },

  // Update item quantity
  updateQuantity(id: string, quantity: number): void {
    if (typeof window === 'undefined') return;
    try {
      const cart = this.getCart();
      const item = cart.find((item) => item.id === id);

      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(id);
        } else {
          item.quantity = quantity;
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  },

  // Remove item from cart
  removeFromCart(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const cart = this.getCart();
      const filteredCart = cart.filter((item) => item.id !== id);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredCart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },

  // Clear cart
  clearCart(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  // Get cart count
  getCartCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Get cart total
  getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
};

