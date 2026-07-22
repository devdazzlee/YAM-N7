'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Zap, Check } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cartUtils } from '../../lib/utils/cart';
import { useProductStore } from '../../lib/store/productStore';
import { showCartToast } from './CartToast';
import { isWeightBasedUnit } from '../../lib/utils/discount';
import { getWeightInGramsFromText } from '../../lib/utils/weight';
interface ProductCardProps {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number;
  image: string;
  category?: string;
  viewMode?: 'grid' | 'list';
  // Additional fields for price extraction
  sales_rate_inc_dis_and_tax?: string | number;
  sales_rate_exc_dis_and_tax?: string | number;
  selling_price?: number;
  unitName?: string;
  weight?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  viewMode = 'grid',
  sales_rate_inc_dis_and_tax,
  sales_rate_exc_dis_and_tax,
  selling_price,
  unitName,
  weight,
}: ProductCardProps) {
  const { prefetchProduct } = useProductStore();
  const hasImageSource = Boolean(image && image.trim() !== '' && image !== '/Banner-01.jpg');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt motion values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };
  
  // Extract price from multiple possible fields
  const displayPrice = price 
    || (sales_rate_inc_dis_and_tax ? parseFloat(String(sales_rate_inc_dis_and_tax)) : 0)
    || (sales_rate_exc_dis_and_tax ? parseFloat(String(sales_rate_exc_dis_and_tax)) : 0)
    || selling_price
    || 0;
  const discount = originalPrice && displayPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;
  
  const [isInWishlist, setIsInWishlist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
    // If browser already has this image in cache, mark as loaded immediately.
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [image]);

  // Check if product is in wishlist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(wishlist.some((item: { id: string }) => item.id === id));
    }
  }, [id]);

  const inferredGramsPerUnit =
    getWeightInGramsFromText(weight) ?? getWeightInGramsFromText(name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productImage = image || '/Banner-01.jpg';
    cartUtils.addToCart({
      id,
      name,
      price: displayPrice,
      image: productImage,
      productId: id,
      unitName,
      gramsPerUnit: inferredGramsPerUnit,
    });
    // Toast notification — no state change, no re-render
    showCartToast(name, productImage);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart first
    cartUtils.addToCart({
      id,
      name,
      price: displayPrice,
      image: image || '/Banner-01.jpg',
      productId: id,
      unitName,
      gramsPerUnit: inferredGramsPerUnit,
    });
    // Redirect to checkout
    router.push('/checkout');
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const product = { id, name, price, originalPrice, image, category };
      
      if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter((item: { id: string }) => item.id !== id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsInWishlist(true);
      }
      
      // Dispatch event to update header count
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-xl sm:rounded-2xl border border-border/40 hover:border-primary transition-all duration-300 overflow-hidden group flex flex-col"
      >
        <div className="flex flex-col sm:flex-row min-w-0">
          <Link href={`/products/${id}`} className="flex-shrink-0 w-full sm:w-auto">
            <div className="relative w-full h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 overflow-hidden bg-subtle-strong sm:rounded-l-xl sm:rounded-r-none rounded-t-xl sm:rounded-t-none">
            {hasImageSource && !imageFailed && (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2"
                ref={(node) => {
                  imageRef.current = node;
                  if (node?.complete && node.naturalWidth > 0) {
                    setImageLoaded(true);
                  }
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
              />
            )}
            {/* Reflection overlay that changes position/opacity on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none mix-blend-overlay" />
            {(!hasImageSource || imageFailed || !imageLoaded) && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-subtle-strong to-border" />
            )}
            {discount > 0 && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary-dark text-foreground px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                -{discount}%
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
          <div>
            <Link href={`/products/${id}`}>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-foreground mb-2 sm:mb-3 hover:text-primary transition-colors line-clamp-2">
                {name}
              </h3>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-wrap">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                Rs. {displayPrice.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xs sm:text-sm md:text-base lg:text-lg text-muted line-through">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 w-full sm:w-auto">
              <motion.button
                onClick={toggleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-card border-2 border-border rounded-full flex items-center justify-center hover:bg-surface transition-colors flex-shrink-0 ${
                  isInWishlist ? 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20' : ''
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-foreground'}`} />
              </motion.button>
              <button
                onClick={handleAddToCart}
                className="px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-3 rounded-full flex items-center justify-center transition-colors duration-200 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base flex-1 sm:flex-initial bg-primary text-primary-foreground hover:bg-primary-dark"
                aria-label="Add to cart"
              >
                {isAdded ? (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4.5 h-4.5" />
                    <span>Added</span>
                  </motion.span>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors duration-200 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base flex-1 sm:flex-initial"
                aria-label="Buy now"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Buy Now</span>
                <span className="sm:hidden">Buy</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      transition={{ duration: 0.45 }}
      className="group luxury-card luxury-card-hover overflow-hidden h-full flex flex-col"
    >
      <Link
        href={`/products/${id}`}
        onMouseEnter={() => prefetchProduct(id)}
        onTouchStart={() => prefetchProduct(id)}
        className="block shrink-0 relative"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
          {hasImageSource && !imageFailed && (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2"
              ref={(node) => {
                imageRef.current = node;
                if (node?.complete && node.naturalWidth > 0) {
                  setImageLoaded(true);
                }
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
            />
          )}
          {/* Reflection overlay that changes position/opacity on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none mix-blend-overlay" />
          
          {(!hasImageSource || imageFailed || !imageLoaded) && (
            <div className="absolute inset-0 bg-gradient-to-br from-subtle-strong via-surface-muted to-border flex items-center justify-center">
              <span className="font-heading text-2xl text-primary/30">N7</span>
            </div>
          )}

          {category && (
            <span className="absolute top-3 left-3 luxury-label text-[9px] bg-background/60 backdrop-blur-sm px-2 py-1">
              {category}
            </span>
          )}
 
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold tracking-wide z-10">
              −{discount}%
            </div>
          )}
 
          <div className={`absolute z-10 ${discount > 0 ? 'top-10 right-3' : 'top-3 right-3'}`}>
            <motion.button
              onClick={toggleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-8 h-8 bg-background/70 backdrop-blur-md flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ${
                isInWishlist ? 'opacity-100 !bg-destructive/20' : ''
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'text-red-400 fill-red-400' : 'text-foreground'}`} />
            </motion.button>
          </div>
 
          {/* Quick add on hover */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-primary/95 backdrop-blur-sm text-primary-foreground text-xs font-semibold uppercase tracking-editorial hover:bg-primary transition-colors flex items-center justify-center gap-1.5"
            >
              {isAdded ? (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-1.5 text-primary-light"
                >
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </motion.span>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
 
      <div className="p-4 sm:p-5 flex flex-col flex-grow min-h-0 border-t border-border/40">
        <Link href={`/products/${id}`}>
          <h3 className="font-heading text-base sm:text-lg text-foreground mb-2 hover:text-primary-light transition-colors line-clamp-2 leading-snug font-normal">
            {name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="font-heading text-lg sm:text-xl text-foreground">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-subtle line-through">
              Rs. {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-editorial border border-border/60 text-foreground hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-1"
          >
            {isAdded ? (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-1 text-primary-light"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </motion.span>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-editorial bg-primary text-primary-foreground hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" />
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
}

