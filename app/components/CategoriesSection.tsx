'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Loader from './Loader';
import { WebCategory } from '../../lib/api/webApi';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';

const INITIAL_COUNT = 6;

interface CategoriesSectionProps {
  initialCategories: WebCategory[];
  initialTotal?: number;
  initialLoading?: boolean;
  error?: string | null;
}

export default function CategoriesSection({
  initialCategories,
  initialTotal,
  initialLoading,
  error,
}: CategoriesSectionProps) {
  const pages = useWebCategoryStore((s) => s.pages);
  const pageMeta = useWebCategoryStore((s) => s.pageMeta);
  const pageLoading = useWebCategoryStore((s) => s.pageLoading);
  const pageError = useWebCategoryStore((s) => s.pageError);
  const fetchNextPage = useWebCategoryStore((s) => s.fetchNextPage);

  // Seed the paged store once with what the bundled /web/home call returned,
  // so the first "Read More" click goes straight to page 2.
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (seeded) return;
    if (initialCategories.length === 0) return;
    useWebCategoryStore.setState({
      pages: initialCategories.slice(0, INITIAL_COUNT),
      pageMeta: {
        total: initialTotal ?? initialCategories.length,
        page: 1,
        limit: INITIAL_COUNT,
        totalPages: Math.max(1, Math.ceil((initialTotal ?? initialCategories.length) / INITIAL_COUNT)),
      },
    });
    setSeeded(true);
  }, [initialCategories, initialTotal, seeded]);

  const categories = useMemo(() => {
    if (pages.length > 0) return pages;
    return initialCategories;
  }, [pages, initialCategories]);

  const total = pageMeta?.total ?? initialTotal ?? initialCategories.length;
  const hasMore = total > categories.length;

  const handleReadMore = () => fetchNextPage(INITIAL_COUNT);

  return (
    <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-white to-[#FBF6EC]/60">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
            Shop by Category
          </h2>
          <p className="text-[#6B7280] text-xs sm:text-sm">
            Explore our wide range of premium products
          </p>
        </motion.div>

        {initialLoading && categories.length === 0 ? (
          <Loader size="lg" text="Loading categories..." />
        ) : error && categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-stretch">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="h-full flex"
                >
                  <Link href={`/categories/${category.slug}`} className="w-full flex flex-col">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 hover:border-[#C5A059]/30">
                      <div className="relative aspect-square overflow-hidden flex-shrink-0 bg-gray-100">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${category.image || '/Banner-01.jpg'})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      <div className="p-2.5 sm:p-3 text-center flex items-center justify-center min-h-[48px] sm:min-h-[52px] flex-grow">
                        <h3 className="font-semibold text-[#1A1A1A] text-xs sm:text-sm group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-tight">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {pageError && (
              <div className="text-center mt-4">
                <p className="text-red-500 text-xs">{pageError}</p>
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={handleReadMore}
                  disabled={pageLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A059] text-white font-semibold text-sm hover:bg-[#1A1A1A] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pageLoading ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
