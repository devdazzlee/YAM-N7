'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { ShoppingCart, Heart, Minus, Plus, Star, Shield, RotateCcw, CheckCircle, Award, Zap, Clock } from 'lucide-react';
import BrandLoader from '../../components/BrandLoader';
import ProductPageExtras from '../../components/pages/ProductPageExtras';
import { SectionHeader, SectionShell, Stagger, StaggerChild, Reveal } from '../../components/motion/reveal';
import Link from 'next/link';
import { webApi, WebProduct, WebProductDetail } from '../../../lib/api/webApi';
import { useWebProductDetailStore } from '../../../lib/store/webProductDetailStore';
import { cartUtils } from '../../../lib/utils/cart';
import { showCartToast } from '../../components/CartToast';
import { is1KgSelection, get1KgDiscount, KG_DISCOUNT, isWeightBasedUnit } from '../../../lib/utils/discount';

// Legacy view-model used by this page's existing JSX. We map WebProductDetail
// into this shape so the rest of the file (cart, wishlist, variation logic)
// continues to work without a full rewrite.
type ViewProduct = {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  category?: { id: string; name: string; slug: string } | null;
  unit?: { id: string; name: string } | null;
  price: number;
  selling_price: number;
  originalPrice?: number;
  discount_amount?: number;
  sales_rate_inc_dis_and_tax?: number;
  sales_rate_exc_dis_and_tax?: number;
  image: string;
  images: string[];
  ProductImage: Array<{ image: string }>;
  features: string[];
  nutrition: string[];
  weight: string;
  origin: string;
  rating?: number;
  reviews?: number;
  stock?: number;
};

const toViewProduct = (p: WebProductDetail): ViewProduct => {
  const images = p.images.length > 0 ? p.images : p.image ? [p.image] : ['/Banner-01.jpg'];
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? 'No description available.',
    longDescription: p.description ?? 'No description available.',
    category: p.category,
    unit: p.unit,
    price: p.price,
    selling_price: p.price,
    originalPrice: p.original_price,
    discount_amount: p.discount_amount,
    sales_rate_inc_dis_and_tax: p.price,
    sales_rate_exc_dis_and_tax: p.base_price,
    image: images[0],
    images,
    ProductImage: images.map((image) => ({ image })),
    features: [],
    nutrition: [],
    weight: 'N/A',
    origin: 'N/A',
    stock: p.available_stock,
  };
};

const toViewProductFromList = (p: WebProduct): ViewProduct => ({
  id: p.id,
  name: p.name,
  description: p.description ?? '',
  category: p.category,
  unit: p.unit,
  price: p.price,
  selling_price: p.price,
  originalPrice: p.original_price,
  discount_amount: p.discount_amount,
  image: p.image || '/Banner-01.jpg',
  images: p.image ? [p.image] : ['/Banner-01.jpg'],
  ProductImage: [{ image: p.image || '/Banner-01.jpg' }],
  features: [],
  nutrition: [],
  weight: 'N/A',
  origin: 'N/A',
});

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ViewProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ViewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantityOption, setSelectedQuantityOption] = useState<string>('');
  const [customWeight, setCustomWeight] = useState<string>('');
  const [isCustomWeight, setIsCustomWeight] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false);

  const getOrFetchProduct = useWebProductDetailStore((s) => s.getOrFetch);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getOrFetchProduct(id)
      .then((detail) => {
        if (cancelled) return;
        setProduct(toViewProduct(detail));

        // Related products — paginated 4-item slice from the same category, served from cache when possible.
        if (detail.category?.slug) {
          webApi
            .listProducts({ category: detail.category.slug, limit: 4, sort: 'newest' })
            .then(({ data }) => {
              if (cancelled) return;
              const related = data
                .filter((p) => p.id !== id)
                .slice(0, 3)
                .map(toViewProductFromList);
              setRelatedProducts(related);
            })
            .catch(() => {
              if (!cancelled) setRelatedProducts([]);
            });
        } else {
          setRelatedProducts([]);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load product. Please try again later.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, getOrFetchProduct]);

  const discount = product?.originalPrice && product?.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if unit is pieces (should show increment/decrement) or weight (should show options)
  const isPiecesUnit = useMemo(() => {
    if (!product?.unit?.name) return false;
    const unitName = product.unit.name.toLowerCase().trim();
    return unitName === 'pcs' || unitName === 'pc' || unitName === 'piece' || unitName === 'pieces';
  }, [product?.unit?.name]);

  // Generate quantity options based on unit (only for weight units, not pieces)
  const quantityOptions = useMemo(() => {
    // If pieces unit, return empty array (will show increment/decrement)
    if (isPiecesUnit) return [];
    
    const unitName = product?.unit?.name 
      ? product.unit.name.toLowerCase().trim()
      : null;
    
    if (!unitName) return [];
    
    // For grams (gm, g, gram, grams)
    if (unitName === 'gm' || unitName === 'g' || unitName === 'gram' || unitName === 'grams') {
      return [
        { value: '100', label: '100g' },
        { value: '200', label: '200g' },
        { value: '250', label: '250g' },
        { value: '500', label: '500g' },
        { value: '1000', label: '1kg' },
      ];
    }
    
    // For kilograms (kg, kilogram, kilograms, kgs)
    if (unitName === 'kg' || unitName === 'kgs' || unitName === 'kilogram' || unitName === 'kilograms') {
      return [
        { value: '0.05', label: '50 gms' },
        { value: '0.1', label: '100 gms' },
        { value: '0.125', label: '125 gms' },
        { value: '0.2', label: '200 gms' },
        { value: '0.25', label: '250 gms' },
        { value: '0.375', label: '375 gms' },
        { value: '0.5', label: '500 gms' },
        { value: '1', label: '1 Kg' },
      ];
    }
    
    // Default: return empty array (will show increment/decrement)
    return [];
  }, [product?.unit?.name, isPiecesUnit, product?.id]);

  // Initialize selected quantity option when product loads (only for weight units)
  useEffect(() => {
    if (product && quantityOptions.length > 0 && !selectedQuantityOption) {
      setSelectedQuantityOption(quantityOptions[0].value);
      setQuantity(parseFloat(quantityOptions[0].value));
    } else if (product && isPiecesUnit && quantity === 1) {
      // For pieces, start with quantity 1
      setQuantity(1);
    }
  }, [product, quantityOptions, selectedQuantityOption, isPiecesUnit]);

  // Update quantity when selected option changes
  useEffect(() => {
    if (selectedQuantityOption) {
      setQuantity(parseFloat(selectedQuantityOption));
    }
  }, [selectedQuantityOption]);

  // Check if current selection qualifies for 1kg discount
  const qualifiesFor1KgDiscount = useMemo(() => {
    if (!product?.unit?.name) return false;
    if (isCustomWeight && customWeight) {
      return is1KgSelection(product.unit.name, String(parseFloat(customWeight))) && parseFloat(customWeight) >= 1000;
    }
    if (selectedQuantityOption) {
      return is1KgSelection(product.unit.name, selectedQuantityOption);
    }
    return false;
  }, [product?.unit?.name, selectedQuantityOption, isCustomWeight, customWeight]);

  // Calculate price based on selected variation (for weight-based products)
  const computedPriceBeforeDiscount = useMemo(() => {
    const basePrice = product?.selling_price || product?.price || 0;
    if (isCustomWeight && customWeight) {
      const grams = parseFloat(customWeight);
      if (!isNaN(grams) && grams > 0) {
        return Math.round(basePrice * (grams / 1000)); // convert grams to kg fraction
      }
    }
    if (quantityOptions.length > 0 && selectedQuantityOption) {
      return Math.round(basePrice * parseFloat(selectedQuantityOption));
    }
    return basePrice;
  }, [product?.selling_price, product?.price, quantityOptions, selectedQuantityOption, isCustomWeight, customWeight]);

  // Apply 1kg discount
  const kgDiscountAmount = qualifiesFor1KgDiscount ? get1KgDiscount(computedPriceBeforeDiscount) : 0;
  const computedPrice = computedPriceBeforeDiscount - kgDiscountAmount;

  // Check if product is in wishlist
  useEffect(() => {
    if (typeof window !== 'undefined' && product) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(wishlist.some((item: { id: string }) => item.id === id));
    }
  }, [id, product]);

  const toggleWishlist = () => {
    if (typeof window !== 'undefined' && product) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const productItem = { 
        id, 
        name: product.name, 
        price: product.price || product.selling_price, 
        originalPrice: product.originalPrice, 
        image: product.image || (product.ProductImage && product.ProductImage.length > 0 ? product.ProductImage[0].image : '/Banner-01.jpg') || '/Banner-01.jpg',
        category: product.category?.name || (product as any).category
      };
      
      if (isInWishlist) {
        const updatedWishlist = wishlist.filter((item: { id: string }) => item.id !== id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
      } else {
        wishlist.push(productItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsInWishlist(true);
      }
      
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  // Build variation label for cart item name (e.g. "Product Name - 250 gms")
  const selectedVariationLabel = useMemo(() => {
    if (isCustomWeight && customWeight) {
      const g = parseFloat(customWeight);
      if (!isNaN(g) && g > 0) {
        return g >= 1000 ? `${(g / 1000).toFixed(g % 1000 === 0 ? 0 : 1)} Kg` : `${g} gms`;
      }
    }
    if (quantityOptions.length > 0 && selectedQuantityOption) {
      return quantityOptions.find(o => o.value === selectedQuantityOption)?.label || '';
    }
    return '';
  }, [isCustomWeight, customWeight, quantityOptions, selectedQuantityOption]);

  const selectedVariationGrams = useMemo(() => {
    if (!product?.unit?.name) return undefined;
    const unit = product.unit.name.toLowerCase().trim();
    if (isCustomWeight && customWeight) {
      const grams = parseFloat(customWeight);
      return !isNaN(grams) && grams > 0 ? grams : undefined;
    }
    if (!selectedQuantityOption) return undefined;
    const value = parseFloat(selectedQuantityOption);
    if (isNaN(value) || value <= 0) return undefined;
    if (['gm', 'g', 'gram', 'grams'].includes(unit)) return value;
    if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(unit)) return value * 1000;
    return undefined;
  }, [product?.unit?.name, isCustomWeight, customWeight, selectedQuantityOption]);

  // Generate a unique cart ID for the selected variation
  const cartVariationId = useMemo(() => {
    if (isCustomWeight && customWeight) {
      return `${product?.id}-custom-${customWeight}g`;
    }
    if (selectedVariationLabel && selectedQuantityOption) {
      return `${product?.id}-${selectedQuantityOption}`;
    }
    return product?.id || '';
  }, [product?.id, isCustomWeight, customWeight, selectedVariationLabel, selectedQuantityOption]);

  const handleAddToCart = () => {
    if (product) {
      if (isCustomWeight && (!customWeight || parseFloat(customWeight) <= 0)) return; // guard
      const productImage = product.image || (product.ProductImage && product.ProductImage.length > 0 ? product.ProductImage[0].image : null) || '/Banner-01.jpg';
      const cartName = selectedVariationLabel ? `${product.name} - ${selectedVariationLabel}` : product.name;
      cartUtils.addToCart({
        id: cartVariationId,
        name: cartName,
        price: computedPriceBeforeDiscount,
        image: productImage,
        productId: product.id,
        unitName: product.unit?.name,
        gramsPerUnit: selectedVariationGrams,
        quantity: 1,
      });
      showCartToast(cartName, productImage);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (isCustomWeight && (!customWeight || parseFloat(customWeight) <= 0)) return; // guard
      const productImage = product.image || (product.ProductImage && product.ProductImage.length > 0 ? product.ProductImage[0].image : null) || '/Banner-01.jpg';
      const cartName = selectedVariationLabel ? `${product.name} - ${selectedVariationLabel}` : product.name;
      cartUtils.addToCart({
        id: cartVariationId,
        name: cartName,
        price: computedPriceBeforeDiscount,
        image: productImage,
        productId: product.id,
        unitName: product.unit?.name,
        gramsPerUnit: selectedVariationGrams,
        quantity: 1,
      });
      
      // Redirect to checkout
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <BrandLoader variant="inline" text="Loading product details..." />
      </>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col justify-center items-center py-20">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link href="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-foreground/10 bg-surface">
        <div className="luxury-container py-3">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-foreground/20">/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            {product.category?.name && (
              <>
                <span className="text-foreground/20">/</span>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-foreground/20">/</span>
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-6 sm:py-10 md:py-12 bg-surface overflow-x-hidden">
        <div className="luxury-container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-14">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative aspect-[3/4] overflow-hidden border border-foreground/10 bg-background"
              >
                <img
                  src={product.ProductImage && product.ProductImage[selectedImage] ? product.ProductImage[selectedImage].image : (product.image || '/Banner-01.jpg')}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-semibold tracking-wide">
                    −{discount}%
                  </div>
                )}
              </motion.div>
              <div className="grid grid-cols-4 gap-2">
                {(product.ProductImage && product.ProductImage.length > 0 ? product.ProductImage.map(img => img.image) : [product.image || '/Banner-01.jpg']).map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border transition-all ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-foreground/10 hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5"
            >
              <div>
                <Link href={`/categories/${(product.category?.name || (product as any).category || '').toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="inline-block text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-2 hover:text-foreground transition-colors">
                    {product.category?.name || (product as any).category}
                  </span>
                </Link>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-normal text-foreground mb-3 leading-tight">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor((product as any).rating || 4.5)
                            ? 'fill-primary text-primary'
                            : 'text-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted text-xs sm:text-sm">
                    {(product as any).rating || 4.5} ({(product as any).reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 border-y border-foreground/10 py-4">
                <span className="font-heading text-2xl sm:text-3xl text-foreground tracking-wide">
                  Rs. {computedPrice.toLocaleString()}
                </span>
                {kgDiscountAmount > 0 && (
                  <span className="text-sm text-muted line-through">
                    Rs. {computedPriceBeforeDiscount.toLocaleString()}
                  </span>
                )}
                {quantityOptions.length > 0 && selectedQuantityOption && parseFloat(selectedQuantityOption) !== 1 && (
                  <span className="text-xs text-muted">
                    Rs. {(product.selling_price || product.price || 0).toLocaleString()} / kg
                  </span>
                )}
                {kgDiscountAmount <= 0 && product.originalPrice && (
                  <span className="text-sm text-muted line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && kgDiscountAmount <= 0 && (
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 text-[11px] font-semibold ml-auto">
                    −{discount}%
                  </span>
                )}
                {kgDiscountAmount > 0 && (
                  <span className="bg-primary text-primary-foreground px-2.5 py-0.5 text-[11px] font-semibold ml-auto">
                    Rs {kgDiscountAmount} OFF
                  </span>
                )}
              </div>

              {/* 1 KG Discount Promo Banner */}
              {isWeightBasedUnit(product.unit?.name) && (
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  qualifiesFor1KgDiscount 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-card border-border/40'
                }`}>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${qualifiesFor1KgDiscount ? 'text-primary' : 'text-muted'}`}>
                      {qualifiesFor1KgDiscount ? '✓ Rs 300 Discount Applied!' : 'Select 1 KG to get Rs 300 OFF!'}
                    </p>
                    <p className="text-[10px] text-muted-subtle">
                      {qualifiesFor1KgDiscount 
                        ? `You saved Rs ${kgDiscountAmount} on this order` 
                        : 'Special offer on all 1 KG purchases'}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted leading-relaxed">{product.description}</p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
              <div className="bg-surface-muted/50 rounded-xl p-3 sm:p-4">
                <h3 className="font-bold text-foreground mb-2 text-sm">Key Features</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-muted text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Quantity/Unit Selector */}
              {product.unit ? (
                quantityOptions.length > 0 ? (
                  <div className="p-3 sm:p-4 bg-card border border-border rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">Weight</span>
                        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                          {quantityOptions.find(o => o.value === selectedQuantityOption)?.label || ''}
                        </span>
                      </div>
                      {product.stock && (
                        <span className="text-muted-subtle text-xs">{product.stock} in stock</span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {quantityOptions.map((option) => {
                        const isSelected = !isCustomWeight && selectedQuantityOption === option.value;
                        const optionPrice = Math.round((product.selling_price || product.price || 0) * parseFloat(option.value));
                        const optionIs1Kg = is1KgSelection(product.unit?.name, option.value);
                        const optionDiscount = optionIs1Kg ? get1KgDiscount(optionPrice) : 0;
                        const optionFinalPrice = optionPrice - optionDiscount;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setIsCustomWeight(false);
                              setCustomWeight('');
                              setSelectedQuantityOption(option.value);
                              setQuantity(parseFloat(option.value));
                            }}
                            className={`relative flex flex-col items-center py-2 px-1 rounded-xl font-medium text-xs sm:text-sm transition-all border-2 ${
                              isSelected
                                ? 'bg-surface-elevated text-foreground border-primary/60'
                                : optionIs1Kg
                                ? 'bg-primary/10 text-foreground border-primary/30 hover:border-primary/50'
                                : 'bg-surface-muted text-foreground border-border/40 hover:border-primary/40 hover:bg-surface/50'
                            }`}
                          >
                            {optionIs1Kg && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[7px] sm:text-[8px] px-1.5 py-[1px] rounded-full font-bold whitespace-nowrap leading-tight">
                                Rs {KG_DISCOUNT.amount} OFF
                              </span>
                            )}
                            <span className="font-bold leading-tight">{option.label}</span>
                            {optionDiscount > 0 ? (
                              <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-foreground/80' : 'text-muted'}`}>
                                <span className="line-through mr-0.5">Rs. {optionPrice.toLocaleString()}</span>
                                <span className={`font-bold ${isSelected ? 'text-primary-light' : 'text-primary'}`}> Rs. {optionFinalPrice.toLocaleString()}</span>
                              </span>
                            ) : (
                              <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-foreground/80' : 'text-muted'}`}>
                                Rs. {optionPrice.toLocaleString()}
                              </span>
                            )}
                          </button>
                        );
                      })}
                      {/* Custom weight tile */}
                      <button
                        onClick={() => {
                          setIsCustomWeight(true);
                          setSelectedQuantityOption('');
                        }}
                        className={`relative flex flex-col items-center py-2 px-1 rounded-xl font-medium text-xs sm:text-sm transition-all border-2 ${
                          isCustomWeight
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-surface-muted text-foreground border-transparent hover:border-primary/40 hover:bg-surface/50'
                        }`}
                      >
                        <span className="font-bold leading-tight">Custom</span>
                        <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isCustomWeight ? 'text-foreground/80' : 'text-muted'}`}>
                          Enter gms
                        </span>
                      </button>
                    </div>

                    {/* Custom weight input */}
                    {isCustomWeight && (
                      <div className="flex items-center gap-2 mt-1 p-2 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="10"
                            max="10000"
                            step="10"
                            value={customWeight}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomWeight(val);
                              const g = parseFloat(val);
                              if (!isNaN(g) && g > 0) {
                                setQuantity(g / 1000); // convert grams to kg
                              }
                            }}
                            placeholder="e.g. 300"
                            className="w-full pl-3 pr-12 py-2 text-sm font-semibold text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            autoFocus
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">gms</span>
                        </div>
                        {customWeight && parseFloat(customWeight) > 0 && (
                          <span className="text-sm font-bold text-foreground whitespace-nowrap">
                            = Rs. {computedPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border border-foreground/10 bg-background">
                    <span className="font-semibold text-foreground text-sm">Quantity</span>
                    <div className="flex items-center bg-surface border border-foreground/10 px-1 py-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-foreground" />
                      </button>
                      <span className="font-bold text-foreground min-w-[50px] text-center text-sm">
                        {quantity} {isPiecesUnit ? product.unit.name : ''}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    </div>
                    <span className={`text-xs ml-auto ${(product.stock ?? 0) > 0 ? 'text-muted' : 'text-destructive'}`}>
                      {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                )
              ) : (
              <div className="flex items-center gap-3 p-3 border border-foreground/10 bg-background">
                <span className="font-semibold text-foreground text-sm">Quantity</span>
                <div className="flex items-center bg-surface border border-foreground/10 px-1 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                  <span className="font-bold text-foreground min-w-[50px] text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                </div>
                <span className={`text-xs ml-auto ${(product.stock ?? 0) > 0 ? 'text-muted' : 'text-destructive'}`}>
                  {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 border border-foreground text-foreground font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 hover:bg-foreground hover:text-background"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 hover:bg-primary-dark"
                  aria-label="Buy now"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-11 h-11 flex items-center justify-center transition-all border ${
                    isInWishlist
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-foreground/20 text-muted hover:border-primary hover:text-primary'
                  }`}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-primary text-primary' : ''}`} />
                </button>
              </div>

              {/* Service Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-xs text-muted">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-xs text-muted">Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-10 sm:py-14 bg-background overflow-x-hidden border-t border-foreground/10">
        <div className="luxury-container max-w-4xl">
          <Reveal className="text-center mb-8">
            <p className="luxury-label mb-2">Product Details</p>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground font-normal">Discover More</h2>
          </Reveal>

          {/* Tabs */}
          <div className="flex justify-center gap-1 mb-6 border-b border-foreground/10 overflow-x-auto scrollbar-hide">
            {[
              { id: 'description', label: 'Description' },
              { id: 'notes', label: 'Fragrance Notes' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-heading text-sm tracking-wide transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-surface border border-foreground/10 p-6 sm:p-8"
          >
            {activeTab === 'description' && (
              <div className="space-y-5">
                <h3 className="font-heading text-xl sm:text-2xl text-foreground font-light">About This Fragrance</h3>
                <p className="text-muted leading-relaxed text-sm sm:text-base">
                  {(product as any).longDescription || product.description || 'No description available.'}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 p-4 bg-surface-muted/60 border border-border">
                    <Award className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-luxury text-muted-subtle">Collection</p>
                      <p className="font-medium text-foreground text-sm">{product.category?.name || 'Signature'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-surface-muted/60 border border-border">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-luxury text-muted-subtle">Longevity</p>
                      <p className="font-medium text-foreground text-sm">6–10 hours (varies by skin)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-5">
                <h3 className="font-heading text-xl sm:text-2xl text-foreground font-light">Fragrance Pyramid</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Every fine fragrance unfolds in three layers — an opening that captivates, a heart that defines character, and a base that lingers.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { layer: 'Top Notes', notes: 'Citrus, bergamot, spice', desc: 'The first impression — bright and inviting.' },
                    { layer: 'Heart Notes', notes: 'Oud, rose, amber', desc: 'The soul of the scent — rich and memorable.' },
                    { layer: 'Base Notes', notes: 'Musk, sandalwood, vanilla', desc: 'The lasting trail — warm and enduring.' },
                  ].map((tier) => (
                    <div key={tier.layer} className="p-4 bg-surface-muted/50 border border-border text-center">
                      <p className="luxury-label text-[10px] mb-2">{tier.layer}</p>
                      <p className="font-heading text-lg text-foreground mb-1">{tier.notes}</p>
                      <p className="text-muted text-xs">{tier.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl sm:text-2xl text-foreground font-light">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-sm text-muted">{(product as any).rating || 4.8} · {(product as any).reviews || 24} reviews</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Ayesha K.', location: 'Karachi', text: 'Beautiful projection and lasts all day. Exactly what I expected from YAM-N7 — authentic and long-lasting.' },
                    { name: 'Hassan M.', location: 'Lahore', text: 'Received so many compliments wearing this. The oud blend is rich without being overpowering. Will definitely reorder.' },
                    { name: 'Fatima R.', location: 'Islamabad', text: 'Fast delivery and premium packaging. The scent profile matches the description perfectly. Highly recommend for evening wear.' },
                  ].map((review, index) => (
                    <div key={index} className="p-4 sm:p-5 bg-surface-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading text-sm">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-sm">{review.name}</span>
                            <p className="text-muted-subtle text-xs">{review.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted text-sm leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <ProductPageExtras
        productName={product.name}
        categoryName={product.category?.name}
      />

      {/* Related Products */}
      <SectionShell>
        <SectionHeader
          accent="You May Also Like"
          title="Complete Your Collection"
          subtitle="Fragrances curated to complement your selection."
        />
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((rp) => (
              <StaggerChild key={rp.id} className="h-full">
                <ProductCard
                  id={rp.id}
                  name={rp.name}
                  price={rp.price || rp.selling_price || 0}
                  originalPrice={rp.originalPrice}
                  image={rp.image || ''}
                  category={rp.category?.name || (rp as any).category}
                  unitName={rp.unit?.name}
                  weight={rp.weight}
                  sales_rate_inc_dis_and_tax={rp.sales_rate_inc_dis_and_tax}
                  sales_rate_exc_dis_and_tax={rp.sales_rate_exc_dis_and_tax}
                  selling_price={rp.selling_price}
                />
              </StaggerChild>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted">No related products available.</p>
              <Link href="/shop" className="luxury-btn-outline inline-flex mt-4">
                Browse Shop
              </Link>
            </div>
          )}
        </Stagger>
      </SectionShell>
      <Footer />
    </div>
  );
}
