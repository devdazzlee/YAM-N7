'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Services from '../../../components/Services';
import Loader from '../../../components/Loader';
import Link from 'next/link';
import { Package, MapPin, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../../lib/store/authStore';
import { orderApi, Order } from '../../../../lib/api/orderApi';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrder();
    }
  }, [isAuthenticated, id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await orderApi.getMyOrderById(id);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-primary-dark';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="page-banner text-foreground page-offset py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/account/orders"
              className="inline-flex items-center space-x-2 mb-6 text-foreground/90 hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Details</h1>
            {order && (
              <p className="text-xl text-foreground/90">Order #{order.order_number}</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <Loader size="lg" text="Loading order details..." />
          ) : !order ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-subtle mx-auto mb-4" />
              <p className="text-muted text-lg mb-4">Order not found</p>
              <Link href="/account/orders">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full font-semibold transition-colors"
                >
                  Back to Orders
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Order Items</h2>
                    <span className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center space-x-4 p-4 bg-surface-muted rounded-xl"
                      >
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product?.name || 'Product'}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-muted">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-surface-muted rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Shipping</span>
                      <span className={order.shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {order.tax !== undefined && order.tax > 0 && (
                      <div className="flex justify-between text-muted">
                        <span>Tax</span>
                        <span>Rs. {order.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-border-strong pt-4">
                      <div className="flex justify-between text-xl font-bold text-foreground">
                        <span>Total</span>
                        <span>Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {order.shipping_address && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-2xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Address</h2>
                    <div className="space-y-3 text-muted">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p>{order.shipping_address.address}</p>
                          <p>
                            {order.shipping_address.city}
                            {order.shipping_address.postal_code && `, ${order.shipping_address.postal_code}`}
                          </p>
                        </div>
                      </div>
                      {order.shipping_address.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-primary" />
                          <p>{order.shipping_address.phone}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-foreground mb-4">Order Info</h2>
                  <div className="space-y-2 text-sm text-muted">
                    <div className="flex justify-between">
                      <span>Order Date</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <span className={order.payment_status === 'PAID' ? 'text-green-600 font-semibold' : 'text-primary-dark font-semibold'}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}
