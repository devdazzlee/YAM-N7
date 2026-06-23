'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState, useRef } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { WebProduct } from '../../lib/api/webApi';
import { useWebProductListStore } from '../../lib/store/webProductListStore';
import { cartUtils } from '../../lib/utils/cart';
import { showCartToast } from './CartToast';
import { ease, Reveal } from './motion/reveal';

const BUCKET_KEY = 'home:featured';
const PAGE_SIZE = 8;

/* ─── Label config ───────────────────────────────────────────────────── */
type LabelKey = 'NEW' | 'TRENDING' | 'LIMITED' | 'EXCLUSIVE' | 'Bestseller';

const LABELS: LabelKey[] = ['NEW', 'TRENDING', 'LIMITED', 'EXCLUSIVE', 'Bestseller'];

const LABEL_STYLES: Record<LabelKey, React.CSSProperties & { text: string }> = {
  NEW: {
    text: 'NEW',
    background: '#C8A46B',
    color: '#0A0A0A',
    border: 'none',
    fontWeight: 700,
    letterSpacing: '0.16em',
  },
  TRENDING: {
    text: 'TRENDING',
    background: '#0E0E0E',
    color: '#C8A46B',
    border: '1px solid #C8A46B',
    fontWeight: 600,
    letterSpacing: '0.12em',
  },
  LIMITED: {
    text: 'LIMITED',
    background: '#1C0F00',
    color: '#D4A96A',
    border: '1px solid rgba(200,164,107,0.25)',
    fontWeight: 600,
    letterSpacing: '0.14em',
  },
  EXCLUSIVE: {
    text: 'EXCLUSIVE',
    background: '#000000',
    color: '#C8A46B',
    border: 'none',
    fontWeight: 500,
    letterSpacing: '0.18em',
  },
  Bestseller: {
    text: 'Bestseller',
    background: '#D8C4A0',
    color: '#1A1208',
    border: 'none',
    fontWeight: 700,
    letterSpacing: '0.06em',
  },
};

function getLabelForProduct(id: string): LabelKey {
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return LABELS[seed % LABELS.length];
}

/* ─── Product label badge ─────────────────────────────────────────────── */
function ProductBadge({ labelKey }: { labelKey: LabelKey }) {
  const style = LABEL_STYLES[labelKey];
  return (
    <span
      className="absolute top-3 left-3 z-20 text-[9px] uppercase font-sans px-2.5 py-1 backdrop-blur-sm pointer-events-none"
      style={{
        background: style.background as string,
        color: style.color as string,
        border: style.border as string,
        fontWeight: style.fontWeight as number,
        letterSpacing: style.letterSpacing as string,
      }}
    >
      {style.text}
    </span>
  );
}

/* ─── Individual trending card ───────────────────────────────────────── */
function TrendingCard({ product, index }: { product: WebProduct; index: number }) {
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const labelKey = getLabelForProduct(product.id);

  const hasImage = Boolean(product.image && product.image.trim() !== '');

  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [product.image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const img = product.image || '/Banner-01.jpg';
    cartUtils.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: img,
      productId: product.id,
    });
    showCartToast(product.name, img);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease }}
      className="group relative flex flex-col"
    >
      {/* ── Image container ─────────────────────────────────────────── */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
        <div
          className="relative overflow-hidden border border-border/20 bg-[#0E0E0E] transition-all duration-500 group-hover:border-[#C8A46B]/50"
          style={{ aspectRatio: '3/4' }}
        >
          {/* Product image — lifts on hover */}
          <motion.div
            className="absolute inset-0"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ duration: 0.5, ease }}
          >
            {hasImage && !imageFailed ? (
              <img
                src={product.image!}
                alt={product.name}
                ref={(n) => {
                  imageRef.current = n;
                  if (n?.complete && n.naturalWidth > 0) setImageLoaded(true);
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-5xl text-primary/15 tracking-widest">N7</span>
              </div>
            )}
          </motion.div>

          {/* Luxury dark scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/55 pointer-events-none z-10" />

          {/* Reflection shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(130deg, transparent 35%, rgba(200,164,107,0.07) 52%, transparent 68%)',
            }}
          />

          {/* Gold drop shadow glow under bottle */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-5 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(200,164,107,0.3) 0%, transparent 70%)',
            }}
          />

          {/* ── Badges ────────────────────────────────────────────── */}
          <ProductBadge labelKey={labelKey} />

          {/* Discount badge — top right */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 z-20 text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-primary text-primary-foreground">
              −{discount}%
            </span>
          )}

          {/* Quick Add — slides up from bottom */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20">
            <button
              onClick={handleQuickAdd}
              className="w-full py-3 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300"
              style={{
                background: added ? 'rgba(200,164,107,0.96)' : 'rgba(10,10,10,0.93)',
                color: added ? '#0A0A0A' : '#C8A46B',
                backdropFilter: 'blur(6px)',
                borderTop: '1px solid rgba(200,164,107,0.35)',
              }}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✓ Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Quick Add
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </Link>

      {/* ── Metadata ────────────────────────────────────────────────── */}
      <div className="pt-4 pb-1 px-0.5">
        {/* Category label */}
        {product.category?.name && (
          <p className="text-[9px] uppercase tracking-[0.22em] text-muted-subtle font-semibold font-sans mb-1.5">
            {product.category.name}
          </p>
        )}

        {/* Product name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-heading text-base sm:text-lg text-foreground leading-snug font-normal hover:text-[#C8A46B] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-2 flex items-baseline gap-2.5">
          <span
            className="font-heading text-lg sm:text-xl font-normal"
            style={{ color: '#C8A46B' }}
          >
            Rs.&nbsp;{product.price.toLocaleString()}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-muted-subtle line-through font-sans">
              Rs.&nbsp;{product.original_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Card skeleton ──────────────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <div
        className="bg-[#0E0E0E] border border-border/20 animate-pulse"
        style={{ aspectRatio: '3/4' }}
      />
      <div className="pt-4 space-y-2">
        <div className="h-2 w-14 bg-border/30 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-border/30 rounded animate-pulse" />
        <div className="h-5 w-1/3 bg-border/30 rounded animate-pulse" />
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */
interface TrendingProductsSectionProps {
  initialProducts: WebProduct[];
  initialTotal?: number;
  initialLoading?: boolean;
}

export default function TrendingProductsSection({
  initialProducts,
  initialTotal,
  initialLoading,
}: TrendingProductsSectionProps) {
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
  const loadingMore = bucket?.loading ?? false;
  const error = bucket?.error ?? null;

  return (
    <section
      id="featured"
      className="py-24 sm:py-28 md:py-32 bg-[#0A0A0A] border-t border-border/20 relative overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_35%_at_50%_100%,rgba(200,164,107,0.035)_0%,transparent_70%)] pointer-events-none" />

      <div className="luxury-container relative z-10">

        {/* ── Section heading ─────────────────────────────────────── */}
        <Reveal className="mb-16 md:mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.45em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.28em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="luxury-label mb-4"
          >
            Featured Fragrances
          </motion.p>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground tracking-wide uppercase font-normal leading-tight mb-5">
            Currently Defining Trends
          </h2>

          <p className="font-heading text-base sm:text-lg text-muted font-normal max-w-lg mx-auto leading-relaxed">
            The scents setting the standard this season — celebrated, sought after, and unmistakably YAM&#8209;N7.
          </p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="mt-8 mx-auto h-px w-32 origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, #C8A46B, transparent)',
            }}
          />
        </Reveal>

        {/* ── Label legend ────────────────────────────────────────── */}
        <Reveal className="flex flex-wrap justify-center gap-3 mb-12" delay={0.1}>
          {(Object.keys(LABEL_STYLES) as LabelKey[]).map((key) => {
            const s = LABEL_STYLES[key];
            return (
              <span
                key={key}
                className="text-[9px] uppercase px-2.5 py-1 font-sans"
                style={{
                  background: s.background as string,
                  color: s.color as string,
                  border: s.border as string,
                  fontWeight: s.fontWeight as number,
                  letterSpacing: s.letterSpacing as string,
                }}
              >
                {s.text}
              </span>
            );
          })}
        </Reveal>

        {/* ── Grid ────────────────────────────────────────────────── */}
        {initialLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={`trend-skel-${i}`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Reveal className="text-center py-20">
            <p className="font-heading text-muted text-lg font-normal">
              No featured products available at the moment.
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {products.map((product, i) => (
              <TrendingCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center mt-4">
            <p className="text-red-500 text-xs">{error}</p>
          </div>
        )}

        {/* ── Footer actions ──────────────────────────────────────── */}
        <Reveal className="flex flex-col items-center gap-5 mt-14 md:mt-16" delay={0.15}>
          {hasMore && (
            <motion.button
              type="button"
              onClick={() => loadNextPage(BUCKET_KEY)}
              disabled={loadingMore}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="luxury-btn-outline disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </motion.button>
          )}
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A46B] border-b border-[#C8A46B]/40 pb-1 hover:border-[#C8A46B] transition-colors duration-300"
          >
            Explore All Fragrances
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>

      </div>
    </section>
  );
}
