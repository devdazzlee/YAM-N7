'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Gift } from 'lucide-react';
import { productApi } from '../../lib/api/productApi';
import { mapApiProducts, DisplayProduct } from '../../lib/utils/productHelpers';

export default function GiftPacksPage() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productApi.listProducts({ fetch_all: true });
        const mapped = mapApiProducts(result.data);
        const giftProducts = mapped.filter(
          (p) =>
            p.name.toLowerCase().includes('gift') ||
            p.name.toLowerCase().includes('pack') ||
            p.name.toLowerCase().includes('bundle') ||
            p.category?.toLowerCase().includes('gift')
        );
        setProducts(giftProducts.length > 0 ? giftProducts : mapped.slice(0, 12));
      } catch (err) {
        console.error('Error fetching gift packs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-r from-surface-elevated to-primary text-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Gift className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Gift Packs & Bundles</h1>
            </div>
            <p className="text-xl text-foreground/90">
              Thoughtful gift sets for every occasion - Eid, Ramadan, Weddings, and more
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <Loader size="lg" text="Loading gift packs..." />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No gift packs available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
