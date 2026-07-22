'use client';

import { use, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Services from '../../components/Services';
import ProductBrowser from '../../components/ProductBrowser';
import Loader from '../../components/Loader';
import { useWebCategoryStore } from '../../../lib/store/webCategoryStore';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Category meta (name + product count) comes from the shared, cached
  // all-categories list — the same source the Header/Footer already populate —
  // so we avoid an extra round trip just for the hero.
  const categories = useWebCategoryStore((s) => s.all);
  const fetchAllCategories = useWebCategoryStore((s) => s.fetchAll);
  const categoriesLoading = useWebCategoryStore((s) => s.allLoading);

  useEffect(() => {
    fetchAllCategories().catch(() => {});
  }, [fetchAllCategories]);

  const category = useMemo(
    () => categories?.find((c) => c.slug === slug) ?? null,
    [categories, slug]
  );

  // Categories are still loading and we have nothing cached yet.
  const resolvingMeta = categories === null && categoriesLoading;
  // Categories loaded but this slug isn't among the active ones.
  const notFound = categories !== null && !category;

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category?.name || 'Category'}</h1>
            <p className="text-xl text-foreground/90 max-w-2xl mx-auto">
              {category && category.product_count > 0
                ? `${category.product_count} premium ${category.product_count === 1 ? 'product' : 'products'}`
                : 'Explore our premium products in this category.'}
            </p>
          </motion.div>
        </div>
      </section>

      {resolvingMeta ? (
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4">
            <Loader size="lg" text="Loading category..." />
          </div>
        </section>
      ) : notFound ? (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-500">Category not found</p>
          </div>
        </section>
      ) : (
        <ProductBrowser bucketKey={`category:${slug}`} lockedCategorySlug={slug} />
      )}
      <Services />
      <Footer />
    </div>
  );
}
