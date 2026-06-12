/**
 * Nationwide delivery rules for cart totals, checkout UI, and guest order payloads.
 * Change only here — cart and checkout must not invent parallel constants.
 */
export const deliveryRules = {
  /**
   * When true, every order gets PKR 0 delivery (no shipping line item).
   * Set to false to use threshold + flat rate below.
   */
  complimentaryNationwide: false,

  /** Applied when complimentaryNationwide is false and subtotal is below freeFromSubtotalPkr */
  flatRatePkrWhenChargeApplies: 350,

  /** Subtotal after cart discounts; at or above this, shipping is PKR 0 (when not complimentaryNationwide) */
  freeFromSubtotalPkr: 5000,
} as const;

/**
 * @param subtotalAfterDiscountsPkr — same value used for checkout subtotal (after line/kg discounts)
 */
export function getShippingChargePkr(subtotalAfterDiscountsPkr: number): number {
  if (deliveryRules.complimentaryNationwide) {
    return 0;
  }
  return subtotalAfterDiscountsPkr >= deliveryRules.freeFromSubtotalPkr
    ? 0
    : deliveryRules.flatRatePkrWhenChargeApplies;
}

export function formatShippingAmountLabel(chargePkr: number): string {
  return chargePkr <= 0 ? 'Free' : `Rs. ${chargePkr.toLocaleString()}`;
}

/** Short helper line under the shipping row in order summaries */
export function shippingSummaryFootnote(chargePkr: number): string {
  if (chargePkr <= 0) {
    return deliveryRules.complimentaryNationwide
      ? 'Complimentary delivery across Pakistan.'
      : 'Complimentary delivery on this order.';
  }
  return `Flat Rs. ${deliveryRules.flatRatePkrWhenChargeApplies.toLocaleString()} for orders under Rs. ${deliveryRules.freeFromSubtotalPkr.toLocaleString()}.`;
}
