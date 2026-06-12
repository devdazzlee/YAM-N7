'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import Loader from '../components/Loader';
import Link from 'next/link';
import { Package, User, MapPin, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../lib/store/authStore';
import { orderApi, Order } from '../../lib/api/orderApi';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const myOrders = await orderApi.getMyOrders();
      setOrders(myOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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

  const pendingOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'PROCESSING' || o.status === 'CONFIRMED'
  );

  const stats = [
    { label: 'Total Orders', value: String(orders.length), icon: Package },
    { label: 'Pending Orders', value: String(pendingOrders.length), icon: Package },
    { label: 'Wishlist Items', value: String(wishlistCount), icon: Heart },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Account</h1>
            <p className="text-xl text-white/90">
              {user?.name ? `Welcome back, ${user.name}` : 'Manage your account and orders'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="bg-[#FBF6EC] rounded-2xl p-6 space-y-4">
                <Link
                  href="/account"
                  className="flex items-center space-x-3 p-3 bg-[#C5A059] text-white rounded-xl"
                >
                  <User className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center space-x-3 p-3 text-[#1A1A1A] hover:bg-white rounded-xl transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/account/profile"
                  className="flex items-center space-x-3 p-3 text-[#1A1A1A] hover:bg-white rounded-xl transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center space-x-3 p-3 text-[#1A1A1A] hover:bg-white rounded-xl transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Address Book</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-3 p-3 text-[#1A1A1A] hover:bg-white rounded-xl transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/account/settings"
                  className="flex items-center space-x-3 p-3 text-[#1A1A1A] hover:bg-white rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>

            <div className="lg:col-span-3 space-y-8">
              {ordersLoading ? (
                <Loader size="lg" text="Loading your account..." />
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-[#FBF6EC] rounded-2xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <Icon className="w-8 h-8 text-[#C5A059]" />
                          </div>
                          <h3 className="text-3xl font-bold text-[#1A1A1A] mb-2">{stat.value}</h3>
                          <p className="text-[#6B7280]">{stat.label}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200 rounded-2xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-[#6B7280]">No orders yet</p>
                        <Link href="/shop" className="text-[#C5A059] hover:text-[#1A1A1A] font-semibold text-sm mt-2 inline-block">
                          Start Shopping →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <Link key={order.id} href={`/account/orders/${order.id}`}>
                            <div className="flex items-center justify-between p-4 bg-[#FBF6EC] rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                              <div>
                                <p className="font-semibold text-[#1A1A1A]">Order #{order.order_number}</p>
                                <p className="text-sm text-[#6B7280]">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-[#1A1A1A]">
                                  Rs. {order.total.toLocaleString()}
                                </p>
                                <span
                                  className={`text-sm font-semibold ${
                                    order.status === 'DELIVERED'
                                      ? 'text-green-600'
                                      : order.status === 'CANCELLED'
                                      ? 'text-red-600'
                                      : 'text-[#8E6D31]'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    <Link
                      href="/account/orders"
                      className="block text-center mt-6 text-[#C5A059] hover:text-[#1A1A1A] font-semibold"
                    >
                      View All Orders
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
