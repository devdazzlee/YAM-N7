'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Loader from './Loader';
import { WebCategory } from '../../lib/api/webApi';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { isValidImageUrl } from '../../lib/utils/image';
import { SectionHeader, Reveal, ease } from './motion/reveal';

const INITIAL_COUNT = 6;

interface CategoriesSectionProps {
  initialCategories: WebCategory[];
  initialTotal?: number;
  initialLoading?: boolean;
  error?: string | null;
}

function CategoryImage({ category }: { category: WebCategory }) {
  const imageUrl = isValidImageUrl(category.image) ? category.image! : null;

  if (!imageUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-muted to-subtle-strong">
        <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-primary/50" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${imageUrl})` }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.5, ease }}
    />
  );
}

export default function CategoriesSection({
  initialCategories,
  initialTotal,
  initialLoading,
  error,
}: CategoriesSectionProps) {
  const pages = useWebCategoryStore((s) => s.pages);
  const pageLoading = useWebCategoryStore((s) => s.pageLoading);
  const pageError = useWebCategoryStore((s) => s.pageError);
  const fetchAll = useWebCategoryStore((s) => s.fetchAll);

  const [seeded, setSeeded] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (seeded) return;
    if (initialCategories.length === 0) return;
    useWebCategoryStore.setState({
      pages: initialCategories.slice(0, INITIAL_COUNT),
      pageMeta: {
        total: initialTotal ?? initialCategories.length,
        page: 1,
        limit: INITIAL_COUNT,
        totalPages: 1,
      },
      pageError: null,
    });
    setSeeded(true);
  }, [initialCategories, initialTotal, seeded]);

  const categories = useMemo(() => {
    if (pages.length > 0) return pages;
    return initialCategories.slice(0, INITIAL_COUNT);
  }, [pages, initialCategories]);

  const total = initialTotal ?? initialCategories.length;
  const hasMore = !allLoaded && categories.length < total;

  const handleLoadMore = async () => {
    useWebCategoryStore.setState({ pageLoading: true, pageError: null });
    try {
      const all = await fetchAll();
      const seen = new Set(useWebCategoryStore.getState().pages.map((c) => c.id));
      const remaining = all.filter((c) => !seen.has(c.id));
      const merged = [...useWebCategoryStore.getState().pages, ...remaining];
      useWebCategoryStore.setState({
        pages: merged,
        pageMeta: { total: all.length, page: 1, limit: all.length, totalPages: 1 },
        pageLoading: false,
      });
      setAllLoaded(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load more categories';
      useWebCategoryStore.setState({ pageLoading: false, pageError: message });
    }
  };

  return (
    <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-background to-surface-muted/60">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Shop by Category"
          subtitle="Explore our wide range of premium products"
        />

        {initialLoading && categories.length === 0 ? (
          <Loader text="Loading categories..." />
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
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.36), ease }}
                  className="h-full flex"
                >
                  <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }} className="w-full">
                    <Link href={`/categories/${category.slug}`} className="w-full flex flex-col">
                      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-border hover:border-primary/40">
                        <div className="relative aspect-square overflow-hidden flex-shrink-0 bg-subtle-strong">
                          <CategoryImage category={category} />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                        <div className="p-2.5 sm:p-3 text-center flex items-center justify-center min-h-[48px] sm:min-h-[52px] flex-grow">
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {pageError && (
              <div className="text-center mt-4">
                <p className="text-red-500 text-xs">{pageError}</p>
              </div>
            )}

            {hasMore && (
              <Reveal className="text-center mt-6 sm:mt-8" delay={0.2}>
                <motion.button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={pageLoading}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-surface-elevated transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pageLoading ? 'Loading…' : 'Load More'}
                </motion.button>
              </Reveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}
