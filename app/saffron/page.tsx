'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Sparkles } from 'lucide-react';
import { productApi } from '../../lib/api/productApi';
import { mapApiProducts, DisplayProduct } from '../../lib/utils/productHelpers';

export default function SaffronPage() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const results = await productApi.searchProducts('oud');
        setProducts(mapApiProducts(results));
      } catch (err) {
        console.error('Error fetching oud products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Sparkles className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Premium Oud Collection</h1>
            </div>
            <p className="text-xl text-white/90">
              Luxurious oud fragrances, carefully sourced and authentically crafted
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#FBF6EC]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Why Choose Our Oud?</h2>
            <p className="text-lg text-[#6B7280]">
              We source only the finest oud oils and blends from trusted suppliers, ensuring depth,
              longevity, and premium quality in every bottle.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <Loader size="lg" text="Loading oud fragrances..." />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-lg">No oud fragrances available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
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
