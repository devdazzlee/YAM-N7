'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import ProductCard from '../components/ProductCard';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setItems(wishlist);
    }

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setItems(wishlist);
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const clearAll = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      localStorage.setItem('wishlist', '[]');
      setItems([]);
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-8 sm:py-10 md:py-14">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">My Wishlist</h1>
            </div>
            <p className="text-sm sm:text-base text-white/90">Save your favorite items for later</p>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Items */}
      <section className="py-6 sm:py-8 bg-gradient-to-b from-white to-[#FBF6EC]">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <>
              {/* Wishlist Summary */}
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <p className="text-[#6B7280] text-xs sm:text-sm">
                  <span className="font-semibold text-[#1A1A1A]">{items.length}</span> {items.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Clear All
                </button>
              </div>

              {/* Grid Layout — uses the same ProductCard as everywhere else */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <ProductCard
                      id={item.id}
                      name={item.name}
                      price={item.price || item.selling_price || 0}
                      originalPrice={item.originalPrice}
                      image={item.image || '/Banner-01.jpg'}
                      category={item.category}
                      sales_rate_inc_dis_and_tax={item.sales_rate_inc_dis_and_tax}
                      sales_rate_exc_dis_and_tax={item.sales_rate_exc_dis_and_tax}
                      selling_price={item.selling_price}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 sm:py-14"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-10 max-w-sm mx-auto shadow-md">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
                <p className="text-[#6B7280] mb-5 text-xs sm:text-sm">Start adding your favorite items to your wishlist!</p>
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold transition-colors text-sm"
                  >
                    Continue Shopping
                  </motion.button>
                </Link>
              </div>
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
