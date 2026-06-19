'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { WebProduct } from '../../lib/api/webApi';
import { useWebProductListStore } from '../../lib/store/webProductListStore';
import { SectionHeader, Stagger, StaggerChild, Reveal } from './motion/reveal';

const BUCKET_KEY = 'home:featured';
const PAGE_SIZE = 8;

interface FeaturedProductsSectionProps {
  initialProducts: WebProduct[];
  initialTotal?: number;
  initialLoading?: boolean;
}

export default function FeaturedProductsSection({
  initialProducts,
  initialTotal,
  initialLoading,
}: FeaturedProductsSectionProps) {
  const bucket = useWebProductListStore((s) => s.buckets[BUCKET_KEY]);
  const loadNextPage = useWebProductListStore((s) => s.loadNextPage);

  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (seeded) return;
    if (initialProducts.length === 0) return;
    const total = initialTotal ?? initialProducts.length;
    useWebProductListStore.setState((s) => ({
      buckets: {
        ...s.buckets,
        [BUCKET_KEY]: {
          items: initialProducts,
          page: initialProducts,
          meta: {
            total,
            page: 1,
            limit: PAGE_SIZE,
            totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
          },
          params: { featured: true, sort: 'newest', limit: PAGE_SIZE },
          loading: false,
          error: null,
          fetchedAt: Date.now(),
        },
      },
    }));
    setSeeded(true);
  }, [initialProducts, initialTotal, seeded]);

  const products: WebProduct[] = useMemo(() => {
    if (bucket && bucket.items.length > 0) return bucket.items;
    return initialProducts;
  }, [bucket, initialProducts]);

  const total = bucket?.meta?.total ?? initialTotal ?? initialProducts.length;
  const hasMore = total > products.length;
  const loading = bucket?.loading ?? false;
  const error = bucket?.error ?? null;

  const handleLoadMore = () => loadNextPage(BUCKET_KEY);

  return (
    <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-surface-muted/60 to-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="YAM-N7 Signature Scents"
          subtitle="Discover the bestselling perfumes and exclusive fragrances that define our legacy."
        />

        {initialLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`featured-skel-${i}`} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-subtle-strong to-border" />
                <div className="p-2.5 sm:p-3 space-y-2">
                  <div className="h-3 sm:h-4 w-4/5 rounded bg-border animate-pulse" />
                  <div className="h-4 sm:h-5 w-2/5 rounded bg-border animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Reveal className="text-center py-12">
            <p className="text-muted">No featured products available at the moment.</p>
          </Reveal>
        ) : (
          <Stagger className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
            {products.map((product) => (
              <StaggerChild key={product.id} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                  className="h-full"
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.original_price}
                    image={product.image || '/Banner-01.jpg'}
                    category={product.category?.name}
                    unitName={product.unit?.name}
                    sales_rate_inc_dis_and_tax={product.price}
                    sales_rate_exc_dis_and_tax={product.base_price}
                    selling_price={product.price}
                  />
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>
        )}

        {error && (
          <div className="text-center mt-4">
            <p className="text-red-500 text-xs">{error}</p>
          </div>
        )}

        <Reveal className="flex flex-col items-center gap-3 mt-8" delay={0.15}>
          {hasMore && (
            <motion.button
              type="button"
              onClick={handleLoadMore}
              disabled={loading}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-foreground font-semibold text-sm hover:bg-surface-elevated transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading…' : 'Load More Products'}
            </motion.button>
          )}
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-primary hover:text-foreground font-semibold text-sm group"
          >
            <span>View All Products</span>
            <motion.span whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
