'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Services from '../../components/Services';
import Loader from '../../components/Loader';
import Link from 'next/link';
import { Package, Eye, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../lib/store/authStore';
import { orderApi, Order } from '../../../lib/api/orderApi';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const myOrders = await orderApi.getMyOrders();
      setOrders(myOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      case 'SHIPPED':
        return 'text-primary-dark';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'text-primary-dark';
      default:
        return 'text-primary';
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
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Orders</h1>
            <p className="text-xl text-foreground/90">View and track your orders</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <Loader size="lg" text="Loading your orders..." />
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-subtle mx-auto mb-4" />
              <p className="text-muted text-lg mb-4">You haven&apos;t placed any orders yet</p>
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full font-semibold transition-colors"
                >
                  Start Shopping
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <Package className="w-6 h-6 text-primary" />
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-sm text-muted">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-muted">
                          <strong>Items:</strong> {order.items.length}
                        </span>
                        <span className="text-muted">
                          <strong>Total:</strong> Rs. {order.total.toLocaleString()}
                        </span>
                        <span className={`font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link href={`/account/orders/${order.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-full font-semibold transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                          <span>View Details</span>
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}
