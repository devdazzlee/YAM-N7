'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';
import Services from '../../components/Services';
import ProductCard from '../../components/ProductCard';
import ProductImageDisclaimer from '../../components/ProductImageDisclaimer';
import { ShoppingCart, Heart, Minus, Plus, Star, Shield, RotateCcw, CheckCircle, TrendingUp, Award, Gift, Zap, Sparkles } from 'lucide-react';
import Loader from '../../components/Loader';
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
        <Loader size="xl" text="Loading product details..." fullScreen />
      </>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center py-20">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link href="/shop" className="text-[#C5A059] hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Product Details */}
      <section className="py-4 sm:py-6 md:py-8 bg-white overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-10">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={product.ProductImage && product.ProductImage[selectedImage] ? product.ProductImage[selectedImage].image : (product.image || '/Banner-01.jpg')}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {discount > 0 && (
                  <div className="absolute top-2.5 left-2.5 bg-[#8E6D31] text-white px-2.5 py-0.5 rounded-full font-bold text-xs">
                    -{discount}%
                  </div>
                )}
              </motion.div>
              <div className="grid grid-cols-4 gap-2">
                {(product.ProductImage && product.ProductImage.length > 0 ? product.ProductImage.map(img => img.image) : [product.image || '/Banner-01.jpg']).map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#C5A059] shadow-sm'
                        : 'border-gray-200 hover:border-[#C5A059]/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
              <ProductImageDisclaimer className="text-[10px] sm:text-xs pt-0.5" />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <Link href={`/categories/${(product.category?.name || (product as any).category || '').toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="inline-block text-[#C5A059] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 hover:text-[#1A1A1A] transition-colors">
                    {product.category?.name || (product as any).category}
                  </span>
                </Link>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] mb-2 leading-tight">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor((product as any).rating || 4.5)
                            ? 'fill-[#8E6D31] text-[#8E6D31]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[#6B7280] text-xs sm:text-sm">
                    {(product as any).rating || 4.5} ({(product as any).reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-[#FBF6EC]/60 rounded-xl">
                <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Rs. {computedPrice.toLocaleString()}
                </span>
                {kgDiscountAmount > 0 && (
                  <span className="text-sm text-[#9CA3AF] line-through">
                    Rs. {computedPriceBeforeDiscount.toLocaleString()}
                  </span>
                )}
                {quantityOptions.length > 0 && selectedQuantityOption && parseFloat(selectedQuantityOption) !== 1 && (
                  <span className="text-xs text-[#6B7280] bg-white/70 px-2 py-0.5 rounded-full">
                    Rs. {(product.selling_price || product.price || 0).toLocaleString()} / kg
                  </span>
                )}
                {kgDiscountAmount <= 0 && product.originalPrice && (
                  <span className="text-sm text-[#9CA3AF] line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && kgDiscountAmount <= 0 && (
                  <span className="bg-[#8E6D31] text-white px-2 py-0.5 rounded-full text-[11px] font-bold ml-auto">
                    -{discount}%
                  </span>
                )}
                {kgDiscountAmount > 0 && (
                  <span className="bg-gradient-to-r from-[#e53e3e] to-[#8E6D31] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold ml-auto animate-pulse">
                    🔥 Rs {kgDiscountAmount} OFF
                  </span>
                )}
              </div>

              {/* 1 KG Discount Promo Banner */}
              {isWeightBasedUnit(product.unit?.name) && (
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${
                  qualifiesFor1KgDiscount 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-[#FFF5F5] border-[#e53e3e]/20'
                }`}>
                  <span className="text-lg">🔥</span>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${qualifiesFor1KgDiscount ? 'text-green-700' : 'text-[#e53e3e]'}`}>
                      {qualifiesFor1KgDiscount ? '✅ Rs 300 Discount Applied!' : 'Select 1 KG to get Rs 300 OFF!'}
                    </p>
                    <p className="text-[10px] text-[#6B7280]">
                      {qualifiesFor1KgDiscount 
                        ? `You saved Rs ${kgDiscountAmount} on this order` 
                        : 'Special offer on all 1 KG purchases'}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-[#6B7280] leading-relaxed">{product.description}</p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
              <div className="bg-[#FBF6EC]/50 rounded-xl p-3 sm:p-4">
                <h3 className="font-bold text-[#1A1A1A] mb-2 text-sm">Key Features</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                      <span className="text-[#6B7280] text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Quantity/Unit Selector */}
              {product.unit ? (
                quantityOptions.length > 0 ? (
                  <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A1A1A] text-sm">Weight</span>
                        <span className="text-[10px] text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-full font-medium">
                          {quantityOptions.find(o => o.value === selectedQuantityOption)?.label || ''}
                        </span>
                      </div>
                      {product.stock && (
                        <span className="text-[#9CA3AF] text-xs">{product.stock} in stock</span>
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
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                                : optionIs1Kg
                                ? 'bg-[#FFF5F5] text-[#1A1A1A] border-[#e53e3e]/40 hover:border-[#e53e3e]/60'
                                : 'bg-gray-50 text-[#1A1A1A] border-transparent hover:border-[#C5A059]/40 hover:bg-[#F5EDD8]/50'
                            }`}
                          >
                            {optionIs1Kg && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#e53e3e] text-white text-[7px] sm:text-[8px] px-1.5 py-[1px] rounded-full font-bold whitespace-nowrap leading-tight">
                                Rs {KG_DISCOUNT.amount} OFF
                              </span>
                            )}
                            <span className="font-bold leading-tight">{option.label}</span>
                            {optionDiscount > 0 ? (
                              <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
                                <span className="line-through mr-0.5">Rs. {optionPrice.toLocaleString()}</span>
                                <span className={`font-bold ${isSelected ? 'text-green-300' : 'text-green-600'}`}> Rs. {optionFinalPrice.toLocaleString()}</span>
                              </span>
                            ) : (
                              <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
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
                            ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-md'
                            : 'bg-gray-50 text-[#1A1A1A] border-transparent hover:border-[#C5A059]/40 hover:bg-[#F5EDD8]/50'
                        }`}
                      >
                        <span className="font-bold leading-tight">Custom</span>
                        <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isCustomWeight ? 'text-white/80' : 'text-[#6B7280]'}`}>
                          Enter gms
                        </span>
                      </button>
                    </div>

                    {/* Custom weight input */}
                    {isCustomWeight && (
                      <div className="flex items-center gap-2 mt-1 p-2 bg-[#F0F7FF] rounded-lg border border-[#C5A059]/20">
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
                            className="w-full pl-3 pr-12 py-2 text-sm font-semibold text-[#1A1A1A] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            autoFocus
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#6B7280]">gms</span>
                        </div>
                        {customWeight && parseFloat(customWeight) > 0 && (
                          <span className="text-sm font-bold text-[#1A1A1A] whitespace-nowrap">
                            = Rs. {computedPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="font-semibold text-[#1A1A1A] text-sm">Quantity</span>
                    <div className="flex items-center bg-gray-100 rounded-lg px-1 py-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#1A1A1A]" />
                      </button>
                      <span className="font-bold text-[#1A1A1A] min-w-[50px] text-center text-sm">
                        {quantity} {isPiecesUnit ? product.unit.name : ''}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1A1A1A]" />
                      </button>
                    </div>
                    <span className="text-[#9CA3AF] text-xs ml-auto">{product.stock} in stock</span>
                  </div>
                )
              ) : (
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                <span className="font-semibold text-[#1A1A1A] text-sm">Quantity</span>
                <div className="flex items-center bg-gray-100 rounded-lg px-1 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  </button>
                  <span className="font-bold text-[#1A1A1A] min-w-[50px] text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  </button>
                </div>
                <span className="text-[#9CA3AF] text-xs ml-auto">{product.stock} in stock</span>
              </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#C5A059]"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2.5 bg-[#C5A059] text-white rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 hover:bg-[#1A1A1A]"
                  aria-label="Buy now"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border ${
                    isInWishlist
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-[#C5A059] hover:text-[#C5A059]'
                  }`}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
                  <Shield className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span className="text-[11px] text-[#6B7280] font-medium leading-tight">Secure Payment</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span className="text-[11px] text-[#6B7280] font-medium leading-tight">Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-6 sm:py-8 bg-gray-50 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          {/* Tabs */}
          <div className="flex space-x-1 mb-4 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {['description', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition-all text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-[#C5A059] border-b-2 border-[#C5A059]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm"
          >
            {activeTab === 'description' && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">Product Description</h3>
                <p className="text-[#6B7280] leading-relaxed text-sm">
                  {(product as any).longDescription || product.description || 'No description available.'}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <p className="font-medium text-[#1A1A1A] text-xs">Weight</p>
                      <p className="text-[#6B7280] text-xs">{(product as any).weight || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <p className="font-medium text-[#1A1A1A] text-xs">Origin</p>
                      <p className="text-[#6B7280] text-xs">{(product as any).origin || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] mb-3">Nutritional Information</h3>
                {product.nutrition && Array.isArray(product.nutrition) && product.nutrition.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {product.nutrition.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-[#1A1A1A] text-sm">{item.label}</span>
                      <span className="text-[#6B7280] text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-[#6B7280] text-sm">Nutritional information not available for this product.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] mb-3">Customer Reviews</h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#C5A059] rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {review}
                          </div>
                          <span className="font-medium text-[#1A1A1A] text-sm">Customer {review}</span>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#8E6D31] text-[#8E6D31]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#6B7280] text-sm">Great product! Highly recommended.</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Why Buy This Product */}
      <section className="py-6 sm:py-8 bg-white overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] text-center mb-4">Why Choose This Product?</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Handpicked & tested' },
              { icon: CheckCircle, title: '100% Authentic', desc: 'Genuine guaranteed' },
              { icon: Gift, title: 'Best Value', desc: 'Competitive prices' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 bg-[#1A1A1A] rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-0.5">{item.title}</h3>
                  <p className="text-[#6B7280] text-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Offer Banner - 1 KG Discount */}
      <section className="py-4 bg-gradient-to-r from-[#e53e3e] to-[#8E6D31] text-white overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0 animate-pulse" />
              <div>
                <h3 className="text-sm sm:text-base font-bold">🔥 1 KG = Rs 300 OFF!</h3>
                <p className="text-white/80 text-xs">Buy any item in 1 KG and get flat Rs 300 discount</p>
              </div>
            </div>
            <Link href="/shop" className="bg-white text-[#e53e3e] px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-yellow-50 transition-colors whitespace-nowrap">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-6 sm:py-8 bg-white overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">You May Also Like</h2>
            <p className="text-[#6B7280] text-xs sm:text-sm mt-1">Related products you might be interested in</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
            {relatedProducts.length > 0 ? relatedProducts.map((product) => (
              <div
                key={product.id}
                className="h-full"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price || product.selling_price || 0}
                  originalPrice={product.originalPrice}
                  image={product.image || '/Banner-01.jpg'}
                  category={product.category?.name || (product as any).category}
                  unitName={product.unit?.name}
                  weight={product.weight}
                  sales_rate_inc_dis_and_tax={product.sales_rate_inc_dis_and_tax}
                  sales_rate_exc_dis_and_tax={product.sales_rate_exc_dis_and_tax}
                  selling_price={product.selling_price}
                />
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-[#6B7280]">No related products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
