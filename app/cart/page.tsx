'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cartUtils, CartItem } from '../../lib/utils/cart';
import { KG_DISCOUNT } from '../../lib/utils/discount';
import { calculateCartPricing } from '../../lib/utils/pricing';
import {
  getShippingChargePkr,
  formatShippingAmountLabel,
  shippingSummaryFootnote,
} from '../../lib/utils/shipping';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      setItems(cartUtils.getCart());
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const updateQuantity = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      cartUtils.updateQuantity(id, newQuantity);
      setItems(cartUtils.getCart());
    }
  };

  const removeItem = (id: string) => {
    cartUtils.removeFromCart(id);
    setItems(cartUtils.getCart());
  };

  const pricing = calculateCartPricing(items);
  const subtotalBeforeDiscount = pricing.subtotalBeforeDiscount;
  const kgDiscountTotal = pricing.kgDiscountTotal;
  const subtotal = pricing.subtotalAfterDiscount;
  const shipping = getShippingChargePkr(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-surface-elevated to-primary text-foreground py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">Shopping Cart</h1>
            <p className="text-sm sm:text-base md:text-xl text-foreground/90">Review your items</p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-6 sm:py-8 md:py-12 bg-card">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 flex gap-3 sm:gap-4 md:gap-6"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg sm:rounded-xl overflow-hidden bg-surface-muted flex-shrink-0">
                      <img
                        src={item.image || '/Banner-01.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-xl font-semibold text-foreground mb-0.5 sm:mb-1 md:mb-2 truncate">{item.name}</h3>
                      {(pricing.linePricingById[item.id]?.discount || 0) > 0 && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-destructive to-primary-dark text-foreground px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold mb-1.5">
                          🔥 Rs {pricing.linePricingById[item.id].discount.toLocaleString()} OFF Applied
                        </span>
                      )}
                      <p className="text-base sm:text-lg md:text-2xl font-bold text-primary mb-2 sm:mb-3 md:mb-4">
                        Rs. {item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 bg-surface-muted rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                          </button>
                          <span className="font-semibold text-foreground w-5 sm:w-6 md:w-8 text-center text-xs sm:text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm md:text-lg font-semibold text-foreground mt-2 sm:mt-3 md:mt-4">
                        Total: Rs. {(pricing.linePricingById[item.id]?.total || 0).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-surface-muted rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 sticky top-24">
                  {/* 1 KG Promo Banner */}
                  <div className="bg-gradient-to-r from-destructive to-primary-dark text-foreground rounded-lg p-2.5 mb-4 text-center">
                    <p className="text-xs sm:text-sm font-bold">🔥 1 KG = Rs {KG_DISCOUNT.amount} OFF!</p>
                    <p className="text-[10px] sm:text-[11px] text-foreground/80">On all products</p>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6">Order Summary</h2>
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex justify-between text-muted text-sm sm:text-base">
                      <span>Subtotal</span>
                      <span>Rs. {subtotalBeforeDiscount.toLocaleString()}</span>
                    </div>
                    {kgDiscountTotal > 0 && (
                      <div className="flex justify-between text-green-600 text-sm sm:text-base font-semibold">
                        <span>{KG_DISCOUNT.shortLabel}</span>
                        <span>- Rs. {kgDiscountTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted text-sm sm:text-base">
                      <span>Shipping</span>
                      <span className={shipping <= 0 ? 'text-green-600 font-semibold' : ''}>
                        {formatShippingAmountLabel(shipping)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted">{shippingSummaryFootnote(shipping)}</p>
                    <div className="border-t border-border-strong pt-3 sm:pt-4">
                      <div className="flex justify-between text-base sm:text-lg md:text-xl font-bold text-foreground">
                        <span>Total</span>
                        <span>Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <button
                      className="w-full bg-primary hover:bg-surface-elevated text-foreground px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </Link>
                  <Link href="/shop">
                    <button
                      className="w-full mt-3 sm:mt-4 bg-card hover:bg-surface text-foreground px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 border-2 border-surface-elevated text-sm sm:text-base"
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Continue Shopping</span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 sm:py-12 md:py-16"
            >
              <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-muted-subtle mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-4">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-muted mb-6 sm:mb-8">Start adding items to your cart!</p>
              <Link href="/shop">
                <button
                  className="bg-primary hover:bg-surface-elevated text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
