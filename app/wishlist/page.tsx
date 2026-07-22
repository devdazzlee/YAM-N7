'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PageHero from '../components/pages/PageHero';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setItems(wishlist);
    }

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
    <div className="min-h-screen bg-surface">
      <Header />

      <PageHero
        label="Saved"
        title="My Wishlist"
        subtitle="Save your favorite fragrances for later."
      />

      <section className="py-8 sm:py-12 bg-surface">
        <div className="luxury-container">
          {items.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted text-sm">
                  <span className="font-semibold text-foreground">{items.length}</span>{' '}
                  {items.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-sm text-destructive hover:opacity-80 font-medium transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="max-w-md mx-auto border border-foreground/10 bg-surface px-6 py-12 sm:px-10">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-muted mb-6 text-sm">
                  Start adding your favorite items to your wishlist.
                </p>
                <Link href="/shop" className="luxury-btn-primary">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
