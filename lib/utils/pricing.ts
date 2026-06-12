import { CartItem } from './cart';
import { get1KgDiscountForCartItem } from './discount';

export interface CartLinePricing {
  subtotal: number;
  discount: number;
  total: number;
}

export interface CartPricing {
  linePricingById: Record<string, CartLinePricing>;
  subtotalBeforeDiscount: number;
  kgDiscountTotal: number;
  subtotalAfterDiscount: number;
}

export function calculateCartPricing(items: CartItem[]): CartPricing {
  const linePricingById: Record<string, CartLinePricing> = {};

  let subtotalBeforeDiscount = 0;
  let kgDiscountTotal = 0;

  for (const item of items) {
    const subtotal = item.price * item.quantity;
    const discount = get1KgDiscountForCartItem(item);
    const total = Math.max(0, subtotal - discount);

    linePricingById[item.id] = { subtotal, discount, total };

    subtotalBeforeDiscount += subtotal;
    kgDiscountTotal += discount;
  }

  return {
    linePricingById,
    subtotalBeforeDiscount,
    kgDiscountTotal,
    subtotalAfterDiscount: Math.max(0, subtotalBeforeDiscount - kgDiscountTotal),
  };
}
