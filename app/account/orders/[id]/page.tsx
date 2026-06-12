'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Newsletter from '../../../components/Newsletter';
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
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
        return 'text-[#8E6D31]';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/account/orders"
              className="inline-flex items-center space-x-2 mb-6 text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Details</h1>
            {order && (
              <p className="text-xl text-white/90">Order #{order.order_number}</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <Loader size="lg" text="Loading order details..." />
          ) : !order ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-[#6B7280] text-lg mb-4">Order not found</p>
              <Link href="/account/orders">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-semibold transition-colors"
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
                  className="bg-white border border-gray-200 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Order Items</h2>
                    <span className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center space-x-4 p-4 bg-[#FBF6EC] rounded-xl"
                      >
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product?.name || 'Product'}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1A1A1A]">
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-[#6B7280]">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-[#1A1A1A]">
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
                  className="bg-[#FBF6EC] rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[#6B7280]">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#6B7280]">
                      <span>Shipping</span>
                      <span className={order.shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {order.tax !== undefined && order.tax > 0 && (
                      <div className="flex justify-between text-[#6B7280]">
                        <span>Tax</span>
                        <span>Rs. {order.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex justify-between text-xl font-bold text-[#1A1A1A]">
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
                    className="bg-white border border-gray-200 rounded-2xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Shipping Address</h2>
                    <div className="space-y-3 text-[#6B7280]">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-[#C5A059] mt-1" />
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
                          <Phone className="w-5 h-5 text-[#C5A059]" />
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
                  className="bg-white border border-gray-200 rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Order Info</h2>
                  <div className="space-y-2 text-sm text-[#6B7280]">
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
                      <span className={order.payment_status === 'PAID' ? 'text-green-600 font-semibold' : 'text-[#8E6D31] font-semibold'}>
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

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
