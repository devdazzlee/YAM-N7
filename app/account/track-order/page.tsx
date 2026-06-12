'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import Services from '../../components/Services';
import Loader from '../../components/Loader';
import { Search, Package, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../lib/store/authStore';
import { orderApi, Order } from '../../../lib/api/orderApi';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

function getStepLabel(status: string) {
  switch (status) {
    case 'PENDING': return 'Order Placed';
    case 'CONFIRMED': return 'Confirmed';
    case 'PROCESSING': return 'Processing';
    case 'SHIPPED': return 'Shipped';
    case 'DELIVERED': return 'Delivered';
    default: return status;
  }
}

export default function TrackOrderPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllOrders();
    }
  }, [isAuthenticated]);

  const fetchAllOrders = async () => {
    try {
      setInitialLoading(true);
      const orders = await orderApi.getMyOrders();
      setAllOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setSearched(true);
    setLoading(true);
    const found = allOrders.find(
      (o) =>
        o.order_number.toLowerCase() === orderNumber.trim().toLowerCase() ||
        o.id === orderNumber.trim()
    );
    setOrder(found || null);
    setLoading(false);
  };

  const selectOrder = (o: Order) => {
    setOrder(o);
    setOrderNumber(o.order_number);
    setSearched(true);
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

  const currentStepIndex = order && order.status !== 'CANCELLED'
    ? STATUS_STEPS.indexOf(order.status)
    : -1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
            <p className="text-xl text-white/90">Enter your order number to see order status</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FBF6EC] rounded-2xl p-8 mb-8"
          >
            <form onSubmit={handleTrack} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter order number..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-semibold transition-colors"
              >
                Track Order
              </motion.button>
            </form>
          </motion.div>

          {!searched && !initialLoading && allOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Your Recent Orders</h3>
              <div className="space-y-3">
                {allOrders.slice(0, 5).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => selectOrder(o)}
                    className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">Order #{o.order_number}</p>
                      <p className="text-sm text-[#6B7280]">
                        {new Date(o.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        o.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : o.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-[#F5EDD8] text-[#8E6D31]'
                      }`}
                    >
                      {o.status}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {initialLoading && <Loader size="lg" text="Loading your orders..." />}

          {loading && <Loader size="lg" text="Tracking your order..." />}

          {searched && !loading && !order && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-[#6B7280] text-lg">
                No order found with number &ldquo;{orderNumber}&rdquo;
              </p>
            </div>
          )}

          {searched && order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-8">
                <Package className="w-6 h-6 text-[#C5A059]" />
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">
                    Order #{order.order_number}
                  </h2>
                  <p className="text-[#6B7280]">
                    Placed on {new Date(order.created_at).toLocaleDateString()} · Rs.{' '}
                    {order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {order.status === 'CANCELLED' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-lg font-semibold text-red-600">This order has been cancelled</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    return (
                      <div key={step} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'bg-[#C5A059] text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Clock className="w-6 h-6" />
                            )}
                          </div>
                          {index < STATUS_STEPS.length - 1 && (
                            <div
                              className={`w-1 h-16 ${
                                isCompleted ? 'bg-[#C5A059]' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h3
                            className={`font-semibold mb-1 ${
                              isCompleted ? 'text-[#1A1A1A]' : 'text-gray-400'
                            }`}
                          >
                            {getStepLabel(step)}
                          </h3>
                          {isCompleted && index === currentStepIndex && (
                            <p className="text-sm text-[#6B7280]">Current status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
