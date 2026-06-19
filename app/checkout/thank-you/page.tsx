'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import Services from '../../components/Services';
import { CheckCircle, Package, Mail, Home, Truck } from 'lucide-react';
import Link from 'next/link';

interface Order {
  orderNumber: string;
  items: any[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode?: string;
  };
  payment: {
    method: string;
    status: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  date: string;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
      return;
    }

    setLoading(true);

    // Get order from localStorage (saved as 'lastOrder')
    const lastOrderData = localStorage.getItem('lastOrder');
    
    if (lastOrderData) {
      try {
        const orderData = JSON.parse(lastOrderData);
        
        // Map the order data to match the Order interface
        const mappedOrder: Order = {
          orderNumber: orderData.orderNumber,
          items: orderData.items || [],
          customer: {
            firstName: orderData.customerInfo?.firstName || '',
            lastName: orderData.customerInfo?.lastName || '',
            email: orderData.customerInfo?.email || '',
            phone: orderData.customerInfo?.phone || '',
          },
          shipping: {
            address: orderData.shippingAddress?.address || '',
            city: orderData.shippingAddress?.city || '',
          },
          payment: {
            method: orderData.paymentMethod || 'cash',
            status: orderData.status || 'pending',
          },
          totals: {
            subtotal: orderData.subtotal || 0,
            shipping: orderData.shipping || 0,
            total: orderData.total || 0,
          },
          date: orderData.orderDate || new Date().toISOString(),
        };
        
        // Verify order number matches
        if (mappedOrder.orderNumber === orderNumber) {
          setOrder(mappedOrder);
          setLoading(false);
        } else {
          console.warn('Order number mismatch. Expected:', orderNumber, 'Got:', mappedOrder.orderNumber);
          setLoading(false);
          router.push('/');
        }
      } catch (error) {
        console.error('Error parsing order data:', error);
        setLoading(false);
        router.push('/');
      }
    } else {
      // If order not found, redirect to home
      console.warn('No order data found in localStorage');
      setLoading(false);
      router.push('/');
    }
  }, [orderNumber, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Success Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-surface-muted to-background">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 sm:w-16 sm:h-16 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Order Confirmed!
              </h1>
              <p className="text-base sm:text-xl text-muted px-2">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-left"
            >
              <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h2 className="text-lg sm:text-2xl font-bold text-foreground">Order Details</h2>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col xs:flex-row justify-between gap-1">
                  <span className="text-muted text-sm sm:text-base">Order Number:</span>
                  <span className="font-semibold text-foreground text-sm sm:text-base break-all">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between gap-1">
                  <span className="text-muted text-sm sm:text-base">Order Date:</span>
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between gap-1">
                  <span className="text-muted text-sm sm:text-base">Total Amount:</span>
                  <span className="font-semibold text-primary text-base sm:text-xl">
                    Rs. {order.totals.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between gap-1">
                  <span className="text-muted text-sm sm:text-base">Payment Method:</span>
                  <span className="font-semibold text-foreground text-sm sm:text-base flex items-center gap-2">
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    Cash on Delivery
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-3 sm:pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Delivery Address:</h3>
                <p className="text-muted text-xs sm:text-sm">
                  {order.customer.firstName} {order.customer.lastName}
                  <br />
                  {order.shipping.address}
                  <br />
                  {order.shipping.city}{order.shipping.postalCode ? `, ${order.shipping.postalCode}` : ''}
                  <br />
                  Phone: {order.customer.phone}
                </p>
              </div>

              {/* Order Items */}
              <div className="pt-3 sm:pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Order Items:</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2 text-xs sm:text-sm">
                      <span className="text-muted flex-1 min-w-0">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-foreground flex-shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-border">
                <div className="bg-surface rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-foreground">
                    <p className="font-semibold mb-1">Cash on Delivery</p>
                    <p>Please keep cash ready. Our delivery person will collect the payment when your order arrives.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 px-2"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-primary hover:bg-surface-elevated text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Continue Shopping</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading order details...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
