'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import Services from '../../components/Services';
import { User, Mail, Phone, MapPin, Package, Edit2, Save, X, Loader2, CheckCircle, Clock, Truck, XCircle, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../lib/store/authStore';
import { orderApi, Order } from '../../../lib/api/orderApi';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, fetchCurrentUser, updateUser, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone_number: '',
    mobile_number: '',
    address: '',
    billing_address: '',
    gender: '',
    dob: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setEditData({
        name: user.name || '',
        phone_number: user.phone_number || '',
        mobile_number: user.mobile_number || '',
        address: user.address || '',
        billing_address: user.billing_address || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      });
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchCurrentUser();
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

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUser(editData);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name || '',
        phone_number: user.phone_number || '',
        mobile_number: user.mobile_number || '',
        address: user.address || '',
        billing_address: user.billing_address || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      });
    }
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'SHIPPED':
      case 'PROCESSING':
        return <Truck className="w-5 h-5 text-[#C5A059]" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-[#C5A059]" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
      case 'PROCESSING':
        return 'bg-[#F5EDD8] text-[#8E6D31]';
      case 'CONFIRMED':
        return 'bg-[#F5EDD8] text-[#8E6D31]';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Profile Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#FBF6EC] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">My Profile</h1>
              <p className="text-[#6B7280]">Manage your account details and view your orders</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Details Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Personal Details</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Edit profile"
                      >
                        <Edit2 className="w-5 h-5 text-[#C5A059]" />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={editData.phone_number}
                            onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Mobile Number</label>
                          <input
                            type="tel"
                            value={editData.mobile_number}
                            onChange={(e) => setEditData({ ...editData, mobile_number: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Address</label>
                        <textarea
                          value={editData.address}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Billing Address</label>
                        <textarea
                          value={editData.billing_address}
                          onChange={(e) => setEditData({ ...editData, billing_address: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Gender</label>
                          <select
                            value={editData.gender}
                            onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={editData.dob}
                            onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#6B7280]">
                        <Mail className="w-5 h-5" />
                        <span>{user.email}</span>
                      </div>
                      {user.name && (
                        <div className="flex items-center gap-3 text-[#6B7280]">
                          <User className="w-5 h-5" />
                          <span>{user.name}</span>
                        </div>
                      )}
                      {(user.phone_number || user.mobile_number) && (
                        <div className="flex items-center gap-3 text-[#6B7280]">
                          <Phone className="w-5 h-5" />
                          <div>
                            {user.phone_number && <p>Phone: {user.phone_number}</p>}
                            {user.mobile_number && <p>Mobile: {user.mobile_number}</p>}
                          </div>
                        </div>
                      )}
                      {user.address && (
                        <div className="flex items-start gap-3 text-[#6B7280]">
                          <MapPin className="w-5 h-5 mt-0.5" />
                          <div>
                            <p className="font-medium">Address:</p>
                            <p>{user.address}</p>
                            {user.billing_address && (
                              <>
                                <p className="font-medium mt-2">Billing Address:</p>
                                <p>{user.billing_address}</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {user.gender && (
                        <div className="flex items-center gap-3 text-[#6B7280]">
                          <User className="w-5 h-5" />
                          <span>Gender: {user.gender}</span>
                        </div>
                      )}
                      {user.dob && (
                        <div className="flex items-center gap-3 text-[#6B7280]">
                          <Calendar className="w-5 h-5" />
                          <span>Date of Birth: {new Date(user.dob).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Orders Card */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      My Orders
                    </h2>
                    <Link
                      href="/account/orders"
                      className="text-sm text-[#C5A059] hover:text-[#1A1A1A] font-semibold"
                    >
                      View All
                    </Link>
                  </div>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-[#6B7280] text-lg mb-2">No orders yet</p>
                      <Link
                        href="/shop"
                        className="text-[#C5A059] hover:text-[#1A1A1A] font-semibold"
                      >
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-[#1A1A1A]">Order #{order.order_number}</p>
                              <p className="text-sm text-[#6B7280]">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-[#6B7280]">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                              <p className="text-lg font-bold text-[#1A1A1A] mt-1">
                                Rs. {order.total.toLocaleString()}
                              </p>
                            </div>
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="text-[#C5A059] hover:text-[#1A1A1A] font-semibold text-sm"
                            >
                              View Details →
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
