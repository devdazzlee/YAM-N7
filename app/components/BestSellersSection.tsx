'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { WebProduct } from '../../lib/api/webApi';
import { cartUtils } from '../../lib/utils/cart';
import { showCartToast } from './CartToast';
import { ease, Reveal } from './motion/reveal';

/* ─── Simulated star ratings per product id (seeded for stability) ─── */
function getStarRating(id: string): number {
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const ratings = [4, 4.5, 5, 4, 4.5, 5, 4.5, 4];
  return ratings[seed % ratings.length];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span key={star} className="relative inline-block w-3.5 h-3.5">
            <Star
              className="w-3.5 h-3.5 text-border/40 absolute inset-0"
              strokeWidth={1.5}
              fill="none"
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star
                  className="w-3.5 h-3.5 text-[#E8B4A0]"
                  strokeWidth={0}
                  fill="#E8B4A0"
                />
              </span>
            )}
          </span>
        );
      })}
      <span className="ml-1.5 text-[10px] text-muted-subtle tracking-wide font-sans">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* ─── Single editorial product card ─────────────────────────────────── */
interface EditorialCardProps {
  product: WebProduct;
  index: number;
}

function EditorialCard({ product, index }: EditorialCardProps) {
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const displayPrice =
    product.price ||
    (product as any).sales_rate_inc_dis_and_tax
      ? parseFloat(String((product as any).sales_rate_inc_dis_and_tax || product.price || 0))
      : 0;

  const hasImage = Boolean(product.image && product.image.trim() !== '');
  const rating = getStarRating(product.id);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      className="group relative flex flex-col"
    >
      {/* ── Image zone ─────────────────────────────────────────────── */}
      <Link href={`/products/${product.id}`} className="block relative">
        {/* Outer frame */}
        <div
          className="relative overflow-hidden bg-surface-muted border border-border/20 transition-all duration-500 group-hover:border-[#E8B4A0]/60"
          style={{ aspectRatio: '3/4' }}
        >
          {/* Product image — lifts on hover */}
          <motion.div
            className="w-full h-full"
            whileHover={{ y: -12, scale: 1.04 }}
            transition={{ duration: 0.45, ease }}
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
                className="w-full h-full object-cover object-center transition-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-muted to-subtle-strong">
                <span className="font-display text-4xl text-primary/25 tracking-widest">N7</span>
              </div>
            )}
          </motion.div>

          {/* Permanent dark scrim — fades slightly on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500 pointer-events-none" />

          {/* Luxury reflection shimmer — appears on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(232,180,160,0.08) 55%, transparent 70%)',
            }}
          />

          {/* Gold drop shadow beneath bottle — slides up on hover */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(232,180,160,0.35) 0%, transparent 70%)' }}
          />

          {/* Category badge */}
          {product.category?.name && (
            <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] text-[#E8B4A0] font-semibold bg-black/50 backdrop-blur-sm px-2 py-0.5 border border-[#E8B4A0]/20">
              {product.category.name}
            </span>
          )}

          {/* Quick Add — slides up from bottom */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20">
            <button
              onClick={handleQuickAdd}
              className="w-full py-3 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300"
              style={{
                background: added
                  ? 'rgba(232,180,160,0.95)'
                  : 'rgba(43,11,22,0.92)',
                color: added ? '#2B0B16' : '#E8B4A0',
                backdropFilter: 'blur(6px)',
                borderTop: '1px solid rgba(232,180,160,0.4)',
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

      {/* ── Card metadata ───────────────────────────────────────────── */}
      <div className="pt-4 pb-1 px-0.5">
        {/* Star rating */}
        <StarRating rating={rating} />

        {/* Product name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 font-heading text-base sm:text-lg text-foreground leading-snug font-normal hover:text-[#E8B4A0] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="font-heading text-lg sm:text-xl font-normal" style={{ color: '#E8B4A0' }}>
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

/* ─── Section skeleton ──────────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="bg-surface-muted border border-border/20 animate-pulse" style={{ aspectRatio: '3/4' }} />
      <div className="pt-4 space-y-2">
        <div className="h-2.5 w-16 bg-border/30 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-border/30 rounded animate-pulse" />
        <div className="h-5 w-1/3 bg-border/30 rounded animate-pulse" />
      </div>
    </div>
  );
}

/* ─── Section component ─────────────────────────────────────────────── */
interface BestSellersSectionProps {
  products: WebProduct[];
  loading?: boolean;
}

export default function BestSellersSection({ products, loading = false }: BestSellersSectionProps) {
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-24 sm:py-28 md:py-32 bg-background border-t border-border/20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(232,180,160,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="luxury-container relative z-10">

        {/* ── Editorial heading block ──────────────────────────────── */}
        <Reveal className="mb-16 md:mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.45em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.28em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="luxury-label mb-4"
          >
            Best Sellers
          </motion.p>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground tracking-wide uppercase font-normal leading-tight mb-5">
            The Most Desired
          </h2>

          <p className="font-heading text-base sm:text-lg text-muted font-normal max-w-md mx-auto leading-relaxed">
            Chosen by those who leave lasting impressions.
          </p>

          {/* Decorative rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="mt-8 mx-auto h-px w-32 origin-center"
            style={{ background: 'linear-gradient(to right, transparent, #E8B4A0, transparent)' }}
          />
        </Reveal>

        {/* ── Product grid ────────────────────────────────────────── */}
        {loading && displayProducts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={`skel-${i}`} />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <Reveal className="text-center py-20">
            <p className="font-heading text-muted text-lg font-normal">No products available at the moment.</p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {displayProducts.map((product, i) => (
              <EditorialCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────── */}
        {displayProducts.length > 0 && (
          <Reveal className="mt-14 md:mt-16 flex justify-center" delay={0.1}>
            <Link
              href="/best-sellers"
              className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B4A0] border-b border-[#E8B4A0]/40 pb-1 hover:border-[#E8B4A0] transition-colors duration-300"
            >
              Discover All Bestsellers
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        )}

      </div>
    </section>
  );
}
