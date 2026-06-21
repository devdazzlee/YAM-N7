'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { WebProduct } from '../../lib/api/webApi';
import { useWebProductListStore } from '../../lib/store/webProductListStore';
import { SectionHeader, Stagger, StaggerChild, Reveal, SectionShell } from './motion/reveal';

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

  return (
    <SectionShell id="featured" className="bg-gradient-to-b from-surface/40 via-background to-background">
      <SectionHeader
        accent="House Favourites"
        title="Featured Perfumes"
        subtitle="The scents our clients return to — bestselling signatures and timeless classics."
      />

      {initialLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`featured-skel-${i}`} className="luxury-card overflow-hidden">
              <div className="aspect-[3/4] animate-pulse bg-gradient-to-br from-subtle-strong to-border" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Reveal className="text-center py-16">
          <p className="text-muted font-light">No featured products available at the moment.</p>
        </Reveal>
      ) : (
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          {products.map((product) => (
            <StaggerChild key={product.id} className="h-full">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price}
                image={product.image || ''}
                category={product.category?.name}
                unitName={product.unit?.name}
                sales_rate_inc_dis_and_tax={product.price}
                sales_rate_exc_dis_and_tax={product.base_price}
                selling_price={product.price}
              />
            </StaggerChild>
          ))}
        </Stagger>
      )}

      {error && (
        <div className="text-center mt-4">
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}

      <Reveal className="flex flex-col items-center gap-4 mt-12 sm:mt-14" delay={0.15}>
        {hasMore && (
          <motion.button
            type="button"
            onClick={() => loadNextPage(BUCKET_KEY)}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="luxury-btn-outline disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load More'}
          </motion.button>
        )}
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors tracking-editorial uppercase group">
          View All Products
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </SectionShell>
  );
}
