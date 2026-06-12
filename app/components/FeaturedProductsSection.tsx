'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { WebProduct } from '../../lib/api/webApi';
import { useWebProductListStore } from '../../lib/store/webProductListStore';

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

  // Pre-seed the store with what /web/home returned so the first "Load More"
  // click fetches page 2 directly. No wasted page-1 refetch.
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
    <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#FBF6EC]/60 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
            YAM-N7 Signature Scents
          </h2>
          <p className="text-[#6B7280] text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Discover the bestselling perfumes and exclusive fragrances that define our legacy.
          </p>
        </motion.div>

        {initialLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`featured-skel-${i}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="p-2.5 sm:p-3 space-y-2">
                  <div className="h-3 sm:h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 sm:h-5 w-2/5 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05 }}
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
            ))}
          </div>
        )}

        {error && (
          <div className="text-center mt-4">
            <p className="text-red-500 text-xs">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mt-8">
          {hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A059] text-white font-semibold text-sm hover:bg-[#1A1A1A] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading…' : 'Load More Products'}
            </button>
          )}
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-[#C5A059] hover:text-[#1A1A1A] font-semibold text-sm group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
