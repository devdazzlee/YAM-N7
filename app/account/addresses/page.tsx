'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import Services from '../../components/Services';
import { MapPin, Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../lib/store/authStore';

export default function AddressesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

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

  const hasAddress = user.address || user.billing_address;

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Address Book</h1>
            <p className="text-xl text-white/90">Manage your shipping addresses</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {!hasAddress ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-[#6B7280] text-lg mb-4">No addresses saved yet</p>
              <p className="text-[#6B7280] text-sm mb-6">
                You can add your address in your{' '}
                <a href="/account/profile" className="text-[#C5A059] hover:text-[#1A1A1A] font-semibold">
                  Profile Settings
                </a>
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {user.address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border-2 border-[#C5A059] bg-[#FBF6EC] rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-[#C5A059]" />
                      <h3 className="font-semibold text-[#1A1A1A]">{user.name || 'Shipping Address'}</h3>
                      <span className="bg-[#C5A059] text-white text-xs px-3 py-1 rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-[#6B7280]">
                    <p>{user.address}</p>
                    {user.phone_number && <p>{user.phone_number}</p>}
                    {user.mobile_number && <p>{user.mobile_number}</p>}
                  </div>
                </motion.div>
              )}

              {user.billing_address && user.billing_address !== user.address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="border-2 border-gray-200 bg-white rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-[#C5A059]" />
                      <h3 className="font-semibold text-[#1A1A1A]">Billing Address</h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-[#6B7280]">
                    <p>{user.billing_address}</p>
                    {user.phone_number && <p>{user.phone_number}</p>}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <a href="/account/profile">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Update Address in Profile</span>
              </motion.button>
            </a>
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
