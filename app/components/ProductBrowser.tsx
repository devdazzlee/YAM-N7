'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from './ProductCard';
import {
  Grid, List, X, ChevronLeft, ChevronRight, Search,
  SlidersHorizontal, ChevronDown, ArrowUpDown, LayoutGrid,
} from 'lucide-react';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { useWebProductListStore } from '../../lib/store/webProductListStore';
import { WebSort } from '../../lib/api/webApi';

const PAGE_SIZE = 12;

type PriceTagId = 'all' | 'under500' | '500-1000' | '1000-2500' | '2500-5000' | 'above5000';

interface PriceTag {
  id: PriceTagId;
  label: string;
  min?: number;
  max?: number;
}

const PRICE_TAGS: PriceTag[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'under500', label: 'Under Rs. 500', max: 500 },
  { id: '500-1000', label: 'Rs. 500 – 1,000', min: 500, max: 1000 },
  { id: '1000-2500', label: 'Rs. 1,000 – 2,500', min: 1000, max: 2500 },
  { id: '2500-5000', label: 'Rs. 2,500 – 5,000', min: 2500, max: 5000 },
  { id: 'above5000', label: 'Above Rs. 5,000', min: 5000 },
];

const SORT_OPTIONS: Array<{ id: WebSort; label: string }> = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Name: A to Z' },
  { id: 'name-desc', label: 'Name: Z to A' },
];

interface ProductBrowserProps {
  /** Unique store bucket key (e.g. "shop" or `category:${slug}`). */
  bucketKey: string;
  /**
   * When set, the browser is scoped to a single category: results are always
   * filtered to this slug and the "Browse by Category" picker is hidden.
   */
  lockedCategorySlug?: string;
}

/**
 * Reusable product browser: search + sort + price/category filters, a responsive
 * grid, and numbered server-side pagination. Used by both the Shop page and the
 * per-category pages so filtering/pagination behaviour stays identical.
 */
export default function ProductBrowser({ bucketKey, lockedCategorySlug }: ProductBrowserProps) {
  const categoryLocked = !!lockedCategorySlug;

  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // slug or 'All'
  const [selectedPriceTag, setSelectedPriceTag] = useState<PriceTagId>('all');
  const [sortBy, setSortBy] = useState<WebSort>('newest');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [showMobilePrice, setShowMobilePrice] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  // Categories — cached, shared with Header/Footer. Only needed for the picker.
  const allCategories = useWebCategoryStore((s) => s.all);
  const categories = useMemo(() => allCategories ?? [], [allCategories]);
  const fetchAllCategories = useWebCategoryStore((s) => s.fetchAll);
  useEffect(() => {
    if (categoryLocked) return;
    fetchAllCategories().catch(() => {});
  }, [fetchAllCategories, categoryLocked]);

  // Products — server-paginated bucket.
  const bucket = useWebProductListStore((s) => s.buckets[bucketKey]);
  const setBucketPage = useWebProductListStore((s) => s.setPage);

  // Debounce the free-text search input (300ms).
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // The category sent to the API: locked slug wins, otherwise the picker value.
  const categoryParam = categoryLocked
    ? lockedCategorySlug
    : selectedCategory !== 'All'
      ? selectedCategory
      : undefined;

  const activeTag = PRICE_TAGS.find((t) => t.id === selectedPriceTag) ?? PRICE_TAGS[0];

  // Reset to page 1 whenever the filters change. Done during render (the React
  // recommended pattern) rather than in an effect, to avoid a cascading render.
  const filterSignature = `${categoryParam ?? ''}|${selectedPriceTag}|${sortBy}|${searchQuery}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setPage(1);
  }

  // Fetch on any change.
  useEffect(() => {
    setBucketPage(bucketKey, {
      page,
      limit: PAGE_SIZE,
      sort: sortBy,
      search: searchQuery || undefined,
      category: categoryParam,
      min_price: activeTag.min,
      max_price: activeTag.max,
    }).catch(() => {});
  }, [bucketKey, page, sortBy, searchQuery, categoryParam, setBucketPage, activeTag.min, activeTag.max]);

  const products = bucket?.page ?? [];
  const meta = bucket?.meta;
  const loading = bucket?.loading ?? false;
  const error = bucket?.error ?? null;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  const indexOfFirst = (page - 1) * PAGE_SIZE;
  const indexOfLast = indexOfFirst + products.length;

  // Numbered pagination → smoothly scroll back to the top of the list on every page
  // change so the user lands on the first product instead of mid-page.
  //
  // We animate the scroll ourselves with requestAnimationFrame instead of using
  // native smooth scrolling. Native smooth scroll (whether via CSS `scroll-behavior`
  // or `behavior: 'smooth'`) gets silently cancelled the moment the new page's
  // products replace the DOM nodes — so it never visibly completes. Driving
  // `scrollTo` frame-by-frame is immune to that and lets us tune the easing/duration.
  const goToPage = useCallback((next: number) => {
    const target = Math.min(Math.max(1, next), totalPages);
    if (target === page) return;
    setPage(target);

    const el = rootRef.current;
    if (!el) return;
    const headerOffset = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    const startY = window.scrollY;
    const targetY = Math.max(0, startY + el.getBoundingClientRect().top - headerOffset - 12);
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = 450;
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let startTime: number | null = null;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // `behavior: 'instant'` per frame so the global `scroll-behavior: smooth`
      // doesn't fight our own animation.
      window.scrollTo({ top: startY + distance * easeInOutCubic(progress), behavior: 'instant' as ScrollBehavior });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [page, totalPages]);

  // Close sort menu on outside click
  useEffect(() => {
    if (!showSortMenu) return;
    const handler = () => setShowSortMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showSortMenu]);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategory === 'All') return 'All';
    return categories.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory;
  }, [selectedCategory, categories]);

  const clearAll = () => {
    if (!categoryLocked) setSelectedCategory('All');
    setSelectedPriceTag('all');
    setSortBy('newest');
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters =
    (!categoryLocked && selectedCategory !== 'All') ||
    selectedPriceTag !== 'all' ||
    !!searchQuery ||
    sortBy !== 'newest';

  return (
    <div ref={rootRef}>
      {/* Toolbar — scrolls with page (not sticky) */}
      <section className="py-5 sm:py-6 bg-surface border-y border-border">
        <div className="luxury-container">
          {/* Search + sort row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-subtle pointer-events-none" />
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-surface border border-border text-sm text-foreground placeholder:text-muted-subtle focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-subtle hover:text-muted">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Sort */}
              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }}
                  className="flex items-center gap-1.5 w-full sm:w-auto px-3 py-2.5 bg-surface border border-border text-sm text-foreground hover:border-primary/40 transition-all whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
                  <span className="text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-none">
                    {SORT_OPTIONS.find((s) => s.id === sortBy)?.label ?? 'Sort'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-subtle transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-card shadow-lg border border-border py-1 z-20"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setShowSortMenu(false); }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm transition-colors ${
                            sortBy === option.id
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-muted hover:bg-surface-muted'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-0.5 bg-surface border border-border p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all duration-200 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-subtle hover:text-muted'}`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all duration-200 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-subtle hover:text-muted'}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories — hidden when locked to one category */}
          {!categoryLocked && (
            <div className="mb-4">
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className="flex items-center gap-2 mb-2.5 w-full sm:hidden"
              >
                <LayoutGrid className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Categories</span>
                {selectedCategory !== 'All' && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 font-medium">{selectedCategoryLabel}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-muted-subtle ml-auto transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} />
              </button>

              <p className="hidden sm:block text-xs text-muted-subtle mb-2">Category</p>
              <div className="hidden sm:flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 text-xs font-medium transition-all border ${
                    selectedCategory === 'All'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface text-muted border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 text-xs font-medium transition-all border ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-surface text-muted border-border hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showMobileCategories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden sm:hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => { setSelectedCategory('All'); setShowMobileCategories(false); }}
                        className={`px-3 py-1.5 text-xs font-medium border ${
                          selectedCategory === 'All'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-surface text-muted border-border'
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.slug); setShowMobileCategories(false); }}
                          className={`px-3 py-1.5 text-xs font-medium border ${
                            selectedCategory === cat.slug
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-surface text-muted border-border'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Price filters */}
          <div className="mb-3">
            <button
              onClick={() => setShowMobilePrice(!showMobilePrice)}
              className="flex items-center gap-2 mb-2.5 w-full sm:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-medium text-foreground">Price</span>
              {selectedPriceTag !== 'all' && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 font-medium">{activeTag.label}</span>
              )}
              <ChevronDown className={`w-4 h-4 text-muted-subtle ml-auto transition-transform ${showMobilePrice ? 'rotate-180' : ''}`} />
            </button>

            <p className="hidden sm:block text-xs text-muted-subtle mb-2">Price range</p>
            <div className="hidden sm:flex flex-wrap gap-2">
              {PRICE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedPriceTag(tag.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all border ${
                    selectedPriceTag === tag.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface text-muted border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showMobilePrice && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden sm:hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PRICE_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => { setSelectedPriceTag(tag.id); setShowMobilePrice(false); }}
                        className={`px-3 py-1.5 text-xs font-medium border ${
                          selectedPriceTag === tag.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-surface text-muted border-border'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <p className="text-muted-subtle text-xs">
              <span className="font-semibold text-foreground">{total}</span> {total === 1 ? 'product' : 'products'}
              {!categoryLocked && selectedCategory !== 'All' && <span> in {selectedCategoryLabel}</span>}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 sm:py-8 bg-card">
        <div className="container mx-auto px-3 sm:px-4">
          {total > 0 && (
            <p className="text-muted-subtle text-xs mb-3">
              Showing {indexOfFirst + 1}–{Math.min(indexOfLast, total)} of {total}
            </p>
          )}

          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch'
              : 'space-y-3 sm:space-y-4'
          }>
            {loading && products.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`skel-${i}`} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-subtle-strong to-border" />
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <div className="h-3 sm:h-4 w-4/5 rounded bg-border animate-pulse" />
                    <div className="h-4 sm:h-5 w-2/5 rounded bg-border animate-pulse" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted">No products found matching your criteria.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className={viewMode === 'grid' ? 'h-full' : ''}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.original_price}
                    image={product.image || '/Banner-01.jpg'}
                    category={product.category?.name}
                    unitName={product.unit?.name}
                    viewMode={viewMode}
                    sales_rate_inc_dis_and_tax={product.price}
                    sales_rate_exc_dis_and_tax={product.base_price}
                    selling_price={product.price}
                  />
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-muted text-xs sm:text-sm">Page {page} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1 || loading}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                    page === 1 || loading
                      ? 'bg-subtle-strong text-muted-subtle cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        disabled={loading}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                          page === pageNum
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-subtle-strong text-foreground hover:bg-border'
                        } disabled:opacity-60`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages || loading}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                    page === totalPages || loading
                      ? 'bg-subtle-strong text-muted-subtle cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
