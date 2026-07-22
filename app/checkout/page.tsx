'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import { CheckCircle, ArrowRight, Lock, Truck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { cartUtils, CartItem, resolveCartProductId } from '../../lib/utils/cart';
import { orderApi } from '../../lib/api/orderApi';
import { useAuthStore } from '../../lib/store/authStore';
import { KG_DISCOUNT } from '../../lib/utils/discount';
import { CONTACT } from '../../config/storeInfo';
import { calculateCartPricing } from '../../lib/utils/pricing';
import {
  getShippingChargePkr,
  formatShippingAmountLabel,
  shippingSummaryFootnote,
} from '../../lib/utils/shipping';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    const items = cartUtils.getCart();
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(items);
  }, [router]);

  // Pre-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const nameParts = user.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone_number || user.mobile_number || '',
        address: user.address || '',
        city: '',
      }));
    }
  }, [isAuthenticated, user]);

  const pricing = calculateCartPricing(cartItems);
  const subtotalBeforeDiscount = pricing.subtotalBeforeDiscount;
  const kgDiscountTotal = pricing.kgDiscountTotal;
  const subtotal = pricing.subtotalAfterDiscount;
  const shipping = getShippingChargePkr(subtotal);
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else {
      setLoading(true);
      try {
        const orderData = {
          items: cartItems.map((item) => {
            const productId = resolveCartProductId(item);
            return {
              id: productId,
              productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              gramsPerUnit: item.gramsPerUnit,
              unitName: item.unitName,
              image: item.image,
            };
          }),
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          shipping: {
            address: formData.address,
            city: formData.city,
          },
          paymentMethod: 'cash' as const,
          subtotal,
          shippingCost: shipping,
          total,
          orderNotes: formData.notes || undefined,
        };

        const orderResponse = await orderApi.createGuestOrder(orderData);

        const orderDetails = {
          orderId: orderResponse.id,
          orderNumber: orderResponse.order_number,
          orderDate: new Date().toISOString(),
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            address: formData.address,
            city: formData.city,
          },
          orderNotes: formData.notes,
          items: cartItems,
          subtotal,
          shipping,
          total,
          paymentMethod: 'cash',
          status: orderResponse.status,
        };

        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
        cartUtils.clearCart();
        router.push(`/checkout/thank-you?order=${orderResponse.order_number}`);
      } catch (error: any) {
        console.error('Error placing order:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
        alert(errorMessage);
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="page-banner text-foreground page-offset py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">Checkout</h1>
            <p className="text-sm sm:text-base md:text-xl text-foreground/90">Complete your order</p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Steps */}
      <section className="py-6 sm:py-8 md:py-12 bg-card">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    step >= 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-border text-muted'
                  }`}
                >
                  {step > 1 ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : '1'}
                </div>
                <span className="text-[10px] sm:text-xs text-muted font-medium">Shipping</span>
              </div>
              <div
                className={`h-0.5 sm:h-1 w-12 sm:w-16 md:w-24 ${
                  step >= 2 ? 'bg-primary' : 'bg-border'
                }`}
              />
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    step >= 2
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-border text-muted'
                  }`}
                >
                  {step > 2 ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : '2'}
                </div>
                <span className="text-[10px] sm:text-xs text-muted font-medium">Payment</span>
              </div>
            </div>
          </div>

          {/* Mobile Order Summary (collapsed, shown above form on mobile) */}
          <div className="lg:hidden mb-4">
            <details className="bg-surface-muted rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    Order Summary ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                </div>
                <span className="font-bold text-foreground text-sm">Rs. {total.toLocaleString()}</span>
              </summary>
              <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 pb-2.5 border-b border-border/60 last:border-0 last:pb-0">
                    <img
                      src={item.image || '/Banner-01.jpg'}
                      alt={item.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-xs sm:text-sm truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted">Qty: {item.quantity}</p>
                      {(pricing.linePricingById[item.id]?.discount || 0) > 0 && (
                        <span className="inline-block bg-gradient-to-r from-destructive to-primary-dark text-foreground px-1.5 py-[1px] rounded-full text-[8px] font-bold mt-0.5">
                          🔥 Rs {pricing.linePricingById[item.id].discount.toLocaleString()} OFF
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
                      Rs. {(pricing.linePricingById[item.id]?.total || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="pt-2 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>Rs. {subtotalBeforeDiscount.toLocaleString()}</span>
                  </div>
                  {kgDiscountTotal > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>{KG_DISCOUNT.shortLabel}</span>
                      <span>- Rs. {kgDiscountTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span>
                    <span className={shipping <= 0 ? 'text-green-600 font-semibold' : ''}>
                      {formatShippingAmountLabel(shipping)}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted">{shippingSummaryFootnote(shipping)}</p>
                  <div className="border-t border-border-strong pt-2 mt-1">
                    <div className="flex justify-between font-bold text-foreground text-sm sm:text-base">
                      <span>Total</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6"
                  >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 md:mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                      <div>
                        <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                        placeholder={CONTACT.phoneDisplay}
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Delivery Address *</label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                        rows={3}
                        placeholder="House/Street address, Area, Landmark"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Order Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm sm:text-base"
                        rows={3}
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6"
                  >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 md:mb-6">Payment Method</h2>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-3 sm:space-x-4 p-4 sm:p-5 md:p-6 border-2 border-primary rounded-xl bg-surface/30">
                        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-sm sm:text-base md:text-lg">Cash on Delivery</p>
                          <p className="text-xs sm:text-sm text-muted mt-1">
                            Pay with cash when your order is delivered. Our delivery person will collect the payment.
                          </p>
                          <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary">
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>No online payment required</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Review */}
                    <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-border">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">Order Review</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-muted flex-1 mr-2 truncate">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="font-semibold text-foreground whitespace-nowrap">
                              Rs. {(pricing.linePricingById[item.id]?.total || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-2.5 sm:gap-3 md:space-x-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                      className="px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-border hover:bg-border-strong text-foreground rounded-full font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>{step === 1 ? 'Continue to Payment' : 'Place Order'}</span>
                        {step === 2 && <Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {step === 1 && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary (Desktop sidebar) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block lg:col-span-1"
            >
              <div className="bg-surface-muted rounded-2xl p-5 md:p-6 sticky top-24">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Order Summary</h2>
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-border">
                      <img
                        src={item.image || '/Banner-01.jpg'}
                        alt={item.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-xs md:text-sm truncate">{item.name}</p>
                        <p className="text-[10px] md:text-xs text-muted">Qty: {item.quantity}</p>
                        {(pricing.linePricingById[item.id]?.discount || 0) > 0 && (
                          <span className="inline-block bg-gradient-to-r from-destructive to-primary-dark text-foreground px-1.5 py-[1px] rounded-full text-[8px] md:text-[9px] font-bold mt-0.5">
                            🔥 Rs {pricing.linePricingById[item.id].discount.toLocaleString()} OFF
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-primary text-sm whitespace-nowrap">
                        Rs. {(pricing.linePricingById[item.id]?.total || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between text-muted pt-2 text-sm">
                    <span>Subtotal</span>
                    <span>Rs. {subtotalBeforeDiscount.toLocaleString()}</span>
                  </div>
                  {kgDiscountTotal > 0 && (
                    <div className="flex justify-between text-green-600 text-sm font-semibold">
                      <span>{KG_DISCOUNT.shortLabel}</span>
                      <span>- Rs. {kgDiscountTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted text-sm">
                    <span>Shipping</span>
                    <span className={shipping <= 0 ? 'text-green-600 font-semibold' : ''}>
                      {formatShippingAmountLabel(shipping)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted">{shippingSummaryFootnote(shipping)}</p>
                  <div className="border-t border-border-strong pt-4">
                    <div className="flex justify-between text-lg md:text-xl font-bold text-foreground">
                      <span>Total</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}
