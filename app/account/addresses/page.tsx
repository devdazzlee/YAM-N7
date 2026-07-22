'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const hasAddress = user.address || user.billing_address;

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Address Book</h1>
            <p className="text-xl text-foreground/90">Manage your shipping addresses</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 max-w-6xl">
          {!hasAddress ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-muted-subtle mx-auto mb-4" />
              <p className="text-muted text-lg mb-4">No addresses saved yet</p>
              <p className="text-muted text-sm mb-6">
                You can add your address in your{' '}
                <a href="/account/profile" className="text-primary hover:text-foreground font-semibold">
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
                  className="border-2 border-primary bg-surface-muted rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{user.name || 'Shipping Address'}</h3>
                      <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-muted">
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
                  className="border-2 border-border bg-card rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Billing Address</h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-muted">
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
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Update Address in Profile</span>
              </motion.button>
            </a>
          </div>
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}
