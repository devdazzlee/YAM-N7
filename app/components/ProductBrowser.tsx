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
      {/* Toolbar */}
      <section className="py-4 sm:py-5 md:py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#1A1A1A] hover:border-[#C5A059]/40 transition-all whitespace-nowrap"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label ?? 'Sort'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-40"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { setSortBy(option.id); setShowSortMenu(false); }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm transition-colors ${
                          sortBy === option.id
                            ? 'bg-[#C5A059]/10 text-[#C5A059] font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
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
            <div className="hidden sm:flex items-center gap-0.5 bg-gray-50 border border-gray-200 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories — hidden when the browser is locked to one category. */}
          {!categoryLocked && (
            <div className="mb-4 sm:mb-5">
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className="flex items-center gap-2 mb-0 sm:mb-2.5 w-full sm:pointer-events-none"
              >
                <LayoutGrid className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Browse by Category</h3>
                {selectedCategory !== 'All' && (
                  <span className="text-[10px] bg-[#C5A059] text-white px-1.5 py-0.5 rounded-full font-semibold">{selectedCategoryLabel}</span>
                )}
                <div className="flex-1 h-px bg-gray-200" />
                {selectedCategory !== 'All' && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setSelectedCategory('All'); }}
                    className="text-[11px] sm:text-xs text-[#C5A059] hover:text-[#1A1A1A] font-medium transition-colors flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Reset
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 sm:hidden transition-transform duration-200 flex-shrink-0 ${showMobileCategories ? 'rotate-180' : ''}`} />
              </button>

              <div className="hidden sm:block relative mt-2.5">
                <div className="overflow-x-auto scrollbar-hide pb-1">
                  <div className="flex gap-2 min-w-max">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm whitespace-nowrap border ${
                        selectedCategory === 'All'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#C5A059] hover:text-[#C5A059]'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm whitespace-nowrap border ${
                          selectedCategory === cat.slug
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#C5A059] hover:text-[#C5A059]'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
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
                    <div className="flex flex-wrap gap-2 pt-2.5">
                      <button
                        onClick={() => { setSelectedCategory('All'); setShowMobileCategories(false); }}
                        className={`px-3 py-1.5 rounded-full font-medium transition-all text-xs border ${
                          selectedCategory === 'All'
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 active:border-[#C5A059] active:text-[#C5A059]'
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.slug); setShowMobileCategories(false); }}
                          className={`px-3 py-1.5 rounded-full font-medium transition-all text-xs border ${
                            selectedCategory === cat.slug
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 active:border-[#C5A059] active:text-[#C5A059]'
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

          {/* Price */}
          <div className="mb-3">
            <button
              onClick={() => setShowMobilePrice(!showMobilePrice)}
              className="flex items-center gap-2 mb-0 sm:mb-2.5 w-full sm:pointer-events-none"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8E6D31] flex-shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Filter by Price</h3>
              {selectedPriceTag !== 'all' && (
                <span className="text-[10px] bg-[#8E6D31] text-white px-1.5 py-0.5 rounded-full font-semibold">{activeTag.label}</span>
              )}
              <div className="flex-1 h-px bg-gray-200" />
              {selectedPriceTag !== 'all' && (
                <span
                  onClick={(e) => { e.stopPropagation(); setSelectedPriceTag('all'); }}
                  className="text-[11px] sm:text-xs text-[#C5A059] hover:text-[#1A1A1A] font-medium transition-colors flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                >
                  <X className="w-3 h-3" /> Reset
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 sm:hidden transition-transform duration-200 flex-shrink-0 ${showMobilePrice ? 'rotate-180' : ''}`} />
            </button>

            <div className="hidden sm:flex flex-wrap gap-2 mt-2.5">
              {PRICE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedPriceTag(tag.id)}
                  className={`px-3.5 py-2 rounded-lg font-medium transition-all duration-200 text-xs whitespace-nowrap border ${
                    selectedPriceTag === tag.id
                      ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
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
                  <div className="flex flex-wrap gap-1.5 pt-2.5">
                    {PRICE_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => { setSelectedPriceTag(tag.id); setShowMobilePrice(false); }}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-[11px] whitespace-nowrap border ${
                          selectedPriceTag === tag.id
                            ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-md'
                            : 'bg-white text-gray-500 border-gray-200 active:border-[#C5A059] active:text-[#C5A059]'
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

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-gray-400 text-[11px] sm:text-xs">
              <span className="font-semibold text-[#1A1A1A]">{total}</span> {total === 1 ? 'product' : 'products'} found
              {!categoryLocked && selectedCategory !== 'All' && <span> in <span className="text-[#1A1A1A] font-medium">{selectedCategoryLabel}</span></span>}
              {selectedPriceTag !== 'all' && <span> · <span className="text-[#C5A059] font-medium">{activeTag.label}</span></span>}
              {searchQuery && <span> · &ldquo;<span className="text-[#1A1A1A] font-medium">{searchQuery}</span>&rdquo;</span>}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs text-red-500 hover:text-red-700 font-medium whitespace-nowrap transition-colors"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          {total > 0 && (
            <p className="text-gray-400 text-xs mb-3">
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
                <div key={`skel-${i}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <div className="h-3 sm:h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 sm:h-5 w-2/5 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-[#6B7280]">No products found matching your criteria.</p>
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
              <div className="text-[#6B7280] text-xs sm:text-sm">Page {page} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1 || loading}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                    page === 1 || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#C5A059] text-white hover:bg-[#1A1A1A]'
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
                            ? 'bg-[#C5A059] text-white'
                            : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
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
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#C5A059] text-white hover:bg-[#1A1A1A]'
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
