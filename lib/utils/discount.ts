// ============================================
// 1 KG = Rs 300 OFF  –  Sitewide Promotion
// ============================================

export const KG_DISCOUNT = {
  amount: 300,   // Rs 300 off
  label: '1 KG - Rs 300 OFF',
  shortLabel: 'Rs 300 OFF on 1 KG',
  badge: '🔥 1 KG = Rs 300 OFF',
};

/**
 * Check whether the selected weight equals (or exceeds) 1 kg.
 * Works for both gram-based and kg-based units.
 */
export function is1KgSelection(unitName: string | undefined, selectedValue: string): boolean {
  if (!unitName) return false;
  const unit = unitName.toLowerCase().trim();
  const value = parseFloat(selectedValue);
  if (isNaN(value) || value <= 0) return false;

  if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(unit) && value >= 1) return true;
  if (['gm', 'g', 'gram', 'grams'].includes(unit) && value >= 1000) return true;
  return false;
}

/**
 * Check if a cart-item name indicates it's a 1 kg item.
 * Cart names are formatted as "Product Name - 1 Kg" by the product detail page.
 */
export function is1KgCartItem(itemName: string): boolean {
  return /[-–]\s*1\s*kg\s*$/i.test(itemName);
}

/**
 * Return the discount to apply.  Never discount more than the item price.
 */
export function get1KgDiscount(price: number): number {
  if (price <= KG_DISCOUNT.amount) return 0;
  return KG_DISCOUNT.amount;
}

/**
 * Check if a product uses weight units (kg / gm) rather than pieces.
 */
export function isWeightBasedUnit(unitName: string | undefined): boolean {
  if (!unitName) return false;
  const unit = unitName.toLowerCase().trim();
  return /(kg|kgs|kilogram|kilograms|gm|g|gram|grams|gms)\b/.test(unit);
}

function isKgUnit(unitName: string | undefined): boolean {
  if (!unitName) return false;
  return /(kg|kgs|kilogram|kilograms)\b/.test(unitName.toLowerCase().trim());
}

/**
 * Parse variation weight from cart item name suffix.
 * Examples:
 * - "Almonds - 250g"
 * - "Almonds - 500 gms"
 * - "Almonds - 1 Kg"
 * - "Almonds - 0.5kg"
 */
export function getCartItemWeightInGramsFromName(itemName: string): number | null {
  const match = itemName.match(/[-–]\s*(\d+(?:\.\d+)?)\s*(kg|kgs|kilogram|kilograms|g|gm|gram|grams|gms)\s*$/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (isNaN(value) || value <= 0) return null;

  if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(unit)) return value * 1000;
  return value;
}

export interface DiscountCartItem {
  name: string;
  price: number;
  quantity: number;
  unitName?: string;
  gramsPerUnit?: number;
}

/**
 * Calculate 1kg-discount for a cart line based on total selected weight.
 * Applies Rs 300 off for each full 1000g in the line.
 */
export function get1KgDiscountForCartItem(item: DiscountCartItem): number {
  const lineTotal = item.price * item.quantity;
  if (lineTotal <= 0 || item.quantity <= 0) return 0;

  const gramsFromName = getCartItemWeightInGramsFromName(item.name);
  // Backward-compatible fallback:
  // if cart line has kg-based unit but no variation metadata, treat quantity as kg units.
  const inferredGramsFromUnit = !gramsFromName && !item.gramsPerUnit && isKgUnit(item.unitName) ? 1000 : null;
  const gramsPerUnit = gramsFromName || item.gramsPerUnit || inferredGramsFromUnit || null;

  if (!gramsPerUnit || gramsPerUnit <= 0) return 0;

  // If unitName is present and non-weight based, don't apply weight promotion.
  if (item.unitName && !isWeightBasedUnit(item.unitName)) return 0;

  const totalWeightGrams = gramsPerUnit * item.quantity;
  const eligibleKgBlocks = Math.floor(totalWeightGrams / 1000);
  if (eligibleKgBlocks <= 0) return 0;

  const discount = eligibleKgBlocks * KG_DISCOUNT.amount;
  return Math.min(discount, lineTotal);
}
