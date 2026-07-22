'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { BookOpen } from 'lucide-react';
import { productApi } from '../../lib/api/productApi';
import { mapApiProducts, DisplayProduct } from '../../lib/utils/productHelpers';

export default function RecipesPage() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productApi.listProducts({ fetch_all: true });
        const mapped = mapApiProducts(result.data);
        const fragrances = mapped.filter(
          (p) =>
            p.category?.toLowerCase().includes('perfume') ||
            p.category?.toLowerCase().includes('attar') ||
            p.category?.toLowerCase().includes('oud') ||
            p.name.toLowerCase().includes('perfume') ||
            p.name.toLowerCase().includes('attar') ||
            p.name.toLowerCase().includes('oud')
        );
        setProducts(fragrances.length > 0 ? fragrances : mapped.slice(0, 12));
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="page-banner text-foreground page-offset py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Fragrance Guide</h1>
            <p className="text-xl text-foreground/90">
              Discover our premium perfumes and learn how to choose your perfect scent
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <Loader size="lg" text="Loading products..." />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No products available at the moment.</p>
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
      <Services />
      <Footer />
    </div>
  );
}
