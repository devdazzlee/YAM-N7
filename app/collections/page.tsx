'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/pages/PageHero';
import PageCTA from '../components/pages/PageCTA';
import { SectionHeader, SectionShell, Reveal } from '../components/motion/reveal';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { WebCategory } from '../../lib/api/webApi';
import { Layers, Search, ArrowRight, Package } from 'lucide-react';

/* ─── Fallback image gradient colours for categories without images ─── */
const GRADIENT_SWATCHES = [
  'from-[#1a0a00] to-[#3d1f00]',
  'from-[#0a0a1a] to-[#1f1f3d]',
  'from-[#0a1a0a] to-[#1f3d1f]',
  'from-[#1a0a1a] to-[#3d1f3d]',
  'from-[#1a1a0a] to-[#3d3d1f]',
  'from-[#0a1a1a] to-[#1f3d3d]',
];

/* ─── Single Category Card ─── */
function CategoryCard({ cat, index }: { cat: WebCategory; index: number }) {
  const gradient = GRADIENT_SWATCHES[index % GRADIENT_SWATCHES.length];
  const hasImage = Boolean(cat.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/categories/${cat.slug}`}
        className="group block relative overflow-hidden rounded-sm border border-border/40 hover:border-primary/60 transition-all duration-300"
        style={{ aspectRatio: '4/5' }}
      >
        {/* Background */}
        {hasImage ? (
          <img
            src={cat.image!}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        {/* Dark overlay — keeps text readable; no yellow wash at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25 transition-opacity duration-500 group-hover:opacity-70" />

        {/* Reflection sheen on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        {/* Gold border line at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center" />

        {/* Product count badge */}
        {cat.product_count > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/55 backdrop-blur-sm border border-white/15 rounded-sm">
            <Package className="w-3 h-3 text-primary-light" />
            <span className="text-[10px] font-semibold text-white tracking-wide">
              {cat.product_count}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/80 mb-2">
            Collection
          </p>
          <h3 className="font-heading text-xl sm:text-2xl text-white leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
            {cat.name}
          </h3>
          <div className="flex items-center gap-1.5 text-white/50 group-hover:text-primary transition-colors duration-300">
            <span className="text-xs font-medium tracking-wide">
              {cat.product_count > 0 ? `${cat.product_count} Products` : 'Explore'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Skeleton loader ─── */
function CategorySkeleton() {
  return (
    <div
      className="animate-pulse rounded-sm bg-surface-elevated border border-border/30"
      style={{ aspectRatio: '4/5' }}
    />
  );
}

/* ─── Main Page ─── */
export default function CollectionsPage() {
  const all = useWebCategoryStore((s) => s.all);
  const loading = useWebCategoryStore((s) => s.allLoading);
  const error = useWebCategoryStore((s) => s.allError);
  const fetchAll = useWebCategoryStore((s) => s.fetchAll);

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll().catch(() => {});
  }, [fetchAll]);

  const categories: WebCategory[] = all ?? [];

  const filtered = search.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="Collections"
        title="Browse by Collection"
        subtitle={`Explore ${categories.length > 0 ? categories.length : 'our'} curated fragrance collections — from everyday attars to rare oud blends, each thoughtfully organised for easy discovery.`}
      >
        <Link href="/shop" className="luxury-btn-primary">
          Shop All Fragrances
        </Link>
      </PageHero>

      {/* Search + Stats bar — scrolls with page (sticky was colliding with fixed header) */}
      <div className="border-b border-foreground/10 bg-surface">
        <div className="luxury-container py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collections…"
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-foreground/15 text-sm text-foreground placeholder:text-muted rounded-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Count */}
            {!loading && (
              <p className="text-xs text-muted shrink-0">
                {filtered.length === categories.length
                  ? `${categories.length} collections`
                  : `${filtered.length} of ${categories.length} collections`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <SectionShell>
        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-muted mb-4">Unable to load collections. Please try again.</p>
            <button
              onClick={() => fetchAll(true)}
              className="luxury-btn-outline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty search result */}
        {!loading && !error && filtered.length === 0 && categories.length > 0 && (
          <div className="text-center py-20">
            <Layers className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <p className="font-heading text-xl text-foreground mb-2">No collections found</p>
            <p className="text-muted text-sm mb-6">
              Try a different search term or browse all collections.
            </p>
            <button onClick={() => setSearch('')} className="luxury-btn-outline">
              Clear Search
            </button>
          </div>
        )}

        {/* No categories from API */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <Layers className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <p className="font-heading text-xl text-foreground mb-2">Coming Soon</p>
            <p className="text-muted text-sm">Our collections are being curated. Check back shortly.</p>
          </div>
        )}

        {/* Category cards grid */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <SectionHeader
              accent={search ? 'Search Results' : 'All Collections'}
              title={search ? `Results for "${search}"` : 'Explore Every Collection'}
              subtitle={
                search
                  ? undefined
                  : 'Each collection represents a distinct mood, occasion, or olfactory journey. Click any collection to browse its fragrances.'
              }
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filtered.map((cat, i) => (
                <CategoryCard key={cat.id} cat={cat} index={i} />
              ))}
            </div>

            {/* CTA below grid */}
            {!search && (
              <Reveal delay={0.15}>
                <div className="mt-14 text-center">
                  <Link href="/shop" className="luxury-btn-outline inline-flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Browse All Products
                  </Link>
                </div>
              </Reveal>
            )}
          </>
        )}
      </SectionShell>

      {/* Bottom CTA */}
      <PageCTA
        title="Not Sure Which Collection?"
        subtitle="Our fragrance consultants will match you to the perfect collection based on your personality, occasion, and budget."
        primaryHref="/contact"
        primaryLabel="Get Expert Advice"
        secondaryHref="/shop"
        secondaryLabel="Shop All Fragrances"
      />
      <Footer />
    </div>
  );
}
