'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Search as SearchIcon } from 'lucide-react';
import { useWebProductListStore } from '../../lib/store/webProductListStore';

const PAGE_SIZE = 12;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const bucketKey = `search:${query}`;
  const bucket = useWebProductListStore((s) => s.buckets[bucketKey]);
  const loadFirstPage = useWebProductListStore((s) => s.loadFirstPage);
  const loadNextPage = useWebProductListStore((s) => s.loadNextPage);

  useEffect(() => {
    const urlQuery = (searchParams.get('q') || '').trim();
    setInput(urlQuery);
    setQuery(urlQuery);
  }, [searchParams]);

  useEffect(() => {
    if (!query) return;
    loadFirstPage(bucketKey, { search: query, limit: PAGE_SIZE, sort: 'newest' }).catch(() => {});
  }, [query, bucketKey, loadFirstPage]);

  const products = bucket?.items ?? [];
  const meta = bucket?.meta;
  const loading = bucket?.loading ?? false;
  const hasMore = meta ? meta.page < meta.totalPages : false;
  const total = meta?.total ?? 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <>
      <section className="bg-gradient-to-r from-surface-elevated to-primary text-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Search Products</h1>
            <form onSubmit={handleSearchSubmit} className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-14 pr-4 py-4 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </form>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          {!query ? (
            <p className="text-muted mb-6">Enter a search term above</p>
          ) : loading && products.length === 0 ? (
            <Loader size="lg" text="Searching products..." />
          ) : (
            <>
              <p className="text-muted mb-6">
                {total > 0
                  ? `${total} result${total !== 1 ? 's' : ''} for "${query}"`
                  : `No results found for "${query}"`}
              </p>
              {products.length > 0 && (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
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

                  {hasMore && (
                    <div className="text-center mt-8">
                      <button
                        type="button"
                        onClick={() => loadNextPage(bucketKey).catch(() => {})}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-surface-elevated transition-colors shadow-sm disabled:opacity-60"
                      >
                        {loading ? 'Loading…' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<Loader size="xl" text="Loading search results..." fullScreen />}>
        <SearchContent />
      </Suspense>
      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
