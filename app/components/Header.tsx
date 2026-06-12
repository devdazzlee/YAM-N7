'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Search, User, ChevronDown, Droplets, Flame, Sparkles, Package, Heart, Phone, Mail, MapPin, Box, ArrowRight, FlaskConical, Wind, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { webApi, WebCategory, WebSearchSuggestion } from '../../lib/api/webApi';
import { cartUtils } from '../../lib/utils/cart';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { useAuthStore } from '../../lib/store/authStore';
import { CONTACT } from '../../config/storeInfo';

// Icon mapping function - maps category names to icons
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('perfume') || name.includes('fragrance') || name.includes('scent')) return Sparkles;
  if (name.includes('attar') || name.includes('oud')) return Flame;
  if (name.includes('mist') || name.includes('body')) return Droplets;
  if (name.includes('essential') || name.includes('oil')) return FlaskConical;
  if (name.includes('gift') || name.includes('set')) return Gift;
  if (name.includes('men') || name.includes('women')) return User;
  return Wind;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WebSearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Array<WebCategory & { icon: any; description: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const fetchAllCategories = useWebCategoryStore((s) => s.fetchAll);
  const { isAuthenticated, user, logout, fetchCurrentUser, token } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Initialize auth state on mount if token exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken && !isAuthenticated && !user) {
        fetchCurrentUser().catch(() => {
          // If fetch fails, token is invalid, clear it
          localStorage.removeItem('authToken');
        });
      }
    }
  }, [fetchCurrentUser, isAuthenticated, user]);

  // Fetch active categories once via shared store (cached 10 min).
  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    fetchAllCategories()
      .then((apiCategories) => {
        if (cancelled) return;
        const mapped = apiCategories
          .filter((cat) => cat.is_active)
          .map((cat) => ({
            ...cat,
            icon: getCategoryIcon(cat.name),
            description: `Browse our ${cat.name.toLowerCase()} collection`,
          }));
        setCategories(mapped);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchAllCategories]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get wishlist count from localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      if (typeof window !== 'undefined') {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(wishlist.length);
      }
    };

    updateWishlistCount();
    
    if (typeof window !== 'undefined') {
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
    }
  }, []);

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartUtils.getCartCount());
    };

    updateCartCount();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', updateCartCount);
      return () => {
        window.removeEventListener('cartUpdated', updateCartCount);
      };
    }
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Debounced typeahead — hits the lightweight /web/search/suggest endpoint.
  useEffect(() => {
    if (!isSearchOpen) return;
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      webApi
        .suggest(trimmed, 8)
        .then((results) => {
          if (!cancelled) setSearchResults(results);
        })
        .catch(() => {
          if (!cancelled) setSearchResults([]);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, isSearchOpen]);

  const performSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleProductClick = (product: WebSearchSuggestion) => {
    router.push(`/products/${product.id}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      const searchInput = document.getElementById('header-search-input');
      if (searchInput) {
        (searchInput as HTMLInputElement).focus();
      }
    }, 300);
  };

  const closeSearchModal = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearchModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Bar - Promotional */}
      <div className="bg-gradient-to-r from-[#C5A059] to-[#1A1A1A] text-white text-xs sm:text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{CONTACT.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>{CONTACT.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              <span>Free Shipping on Orders Over Rs. 5000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg border-b border-gray-100' : 'shadow-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                className="relative"
            >
              <img
                src="/YAM-N7-Logo.png"
                alt="YAM-N7"
                className="h-14 sm:h-16 md:h-[72px] w-auto max-w-[200px] sm:max-w-[240px] object-contain transition-transform duration-300 group-hover:brightness-110"
                width={240}
                height={72}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation — centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 space-x-1">
            {menuItems.map((item) => {
              if (item.name === 'Shop') {
                return (
                    <div key={item.name} className="flex items-center space-x-1">
                    <Link
                      href={item.href}
                        className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          isActive(item.href)
                            ? 'text-[#C5A059] bg-[#C5A059]/10'
                            : 'text-[#1A1A1A] hover:text-[#C5A059] hover:bg-gray-50'
                        }`}
                    >
                      {item.name}
                        {isActive(item.href) && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                    </Link>
                      
                      {/* Products Dropdown */}
                    <div
                      className="relative"
                      onMouseEnter={() => setIsCategoriesOpen(true)}
                      onMouseLeave={() => setIsCategoriesOpen(false)}
                    >
                        <button className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          isCategoriesOpen
                            ? 'text-[#C5A059] bg-[#C5A059]/10'
                            : 'text-[#1A1A1A] hover:text-[#C5A059] hover:bg-gray-50'
                        }`}>
                        <span>Products</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isCategoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                            >
                              <div className="p-6 bg-gradient-to-r from-[#C5A059] via-[#1A1A1A] to-[#C5A059]">
                                <h3 className="text-white font-bold text-xl">Shop by Category</h3>
                                <p className="text-white/90 text-sm mt-1">Browse our premium collection</p>
                            </div>
                              <div className="max-h-96 overflow-y-auto p-2">
                                {categoriesLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : categories.length > 0 ? (
                                  categories.map((category, index) => {
                                const Icon = category.icon;
                                return (
                                  <Link
                                        key={category.id || category.slug}
                                        href={`/categories/${category.slug}`}
                                    onClick={() => setIsCategoriesOpen(false)}
                                  >
                                    <motion.div
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.03 }}
                                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#F5EDD8] hover:to-[#FBF6EC] transition-all group cursor-pointer"
                                    >
                                          <div className="w-14 h-14 bg-gradient-to-br from-[#F5EDD8] to-[#C5A059]/10 rounded-xl flex items-center justify-center group-hover:from-[#C5A059] group-hover:to-[#1A1A1A] transition-all shadow-sm group-hover:shadow-md">
                                            <Icon className="w-7 h-7 text-[#1A1A1A] group-hover:text-white transition-colors" />
                                      </div>
                                      <div className="flex-1">
                                            <h4 className="font-bold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors text-base">
                                          {category.name}
                                        </h4>
                                            <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                                      </div>
                                          <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:text-[#C5A059] transition-colors" />
                                    </motion.div>
                                  </Link>
                                );
                                  })
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>No categories available</p>
                                  </div>
                                )}
                            </div>
                              <div className="p-4 bg-gradient-to-r from-[#FBF6EC] to-[#F5EDD8] border-t border-gray-100">
                              <Link
                                href="/shop"
                                  className="block text-center text-[#C5A059] hover:text-[#1A1A1A] font-bold text-sm transition-colors py-2"
                              >
                                View All Products →
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-[#C5A059] bg-[#C5A059]/10'
                        : 'text-[#1A1A1A] hover:text-[#C5A059] hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchClick}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#C5A059] hover:text-white rounded-full transition-all duration-300 group"
              aria-label="Search"
            >
                <Search className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-white hidden lg:block">Search</span>
            </motion.button>
            
              {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#C5A059] to-[#1A1A1A] text-white rounded-full transition-all duration-300 hover:shadow-lg group"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </motion.button>
                
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-50"
                    >
                      <div className="p-4 bg-gradient-to-r from-[#C5A059] to-[#1A1A1A] text-white">
                        <p className="font-semibold truncate">{user?.email}</p>
                        {user?.name && (
                          <p className="text-sm text-white/90 truncate">{user.name}</p>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            setIsProfileMenuOpen(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-[#C5A059] hover:text-white rounded-full transition-all duration-300 group"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </motion.button>
              </Link>
            )}

              {/* Wishlist */}
            <Link href="/wishlist">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-[#C5A059] hover:text-white rounded-full transition-all duration-300 group"
                aria-label="Wishlist"
              >
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8E6D31] to-[#A67C3D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                    >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                    </motion.span>
                )}
              </motion.button>
            </Link>

              {/* Cart */}
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#C5A059] to-[#1A1A1A] text-white rounded-full transition-all duration-300 hover:shadow-lg group"
                aria-label="Shopping Cart"
              >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8E6D31] to-[#A67C3D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
              </motion.button>
            </Link>

              {/* Mobile Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchClick}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-[#C5A059] hover:text-white rounded-full transition-all duration-300"
              aria-label="Search"
            >
                <Search className="w-5 h-5 text-gray-600" />
            </motion.button>

              {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-300"
              aria-label="Menu"
            >
                {isMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
              <nav className="container mx-auto px-4 py-6 space-y-1">
              {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="pb-4 mb-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                    />
                </div>
              </form>
                
              {menuItems.map((item) => {
                if (item.name === 'Shop') {
                  return (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                            isActive(item.href)
                              ? 'text-[#C5A059] bg-[#C5A059]/10'
                              : 'text-[#1A1A1A] hover:bg-gray-50'
                          }`}
                      >
                        {item.name}
                      </Link>
                        <div className="pl-4 mt-1">
                        <button
                          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                        >
                          <span>Products</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isCategoriesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                                className="pl-4 mt-1 space-y-1"
                            >
                              {categoriesLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <div className="w-5 h-5 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : categories.length > 0 ? (
                                categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                  <Link
                                      key={category.id || category.slug}
                                      href={`/categories/${category.slug}`}
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setIsCategoriesOpen(false);
                                    }}
                                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-[#C5A059] hover:bg-gray-50 rounded-lg transition-colors"
                                  >
                                      <Icon className="w-5 h-5" />
                                      <span className="font-medium">{category.name}</span>
                                  </Link>
                                );
                                })
                              ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  <p>No categories available</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                        isActive(item.href)
                          ? 'text-[#C5A059] bg-[#C5A059]/10'
                          : 'text-[#1A1A1A] hover:bg-gray-50'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

                <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                >
                  Login / Register
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSearchModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-[101] flex items-start justify-center pt-10 sm:pt-20 px-4 pointer-events-none overflow-y-auto"
            >
              <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto my-4"
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Search Products</h2>
                  <button
                    onClick={closeSearchModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close search"
                  >
                      <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                  <form onSubmit={handleSearchSubmit} className="p-6">
                  <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      id="header-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, categories, or brands..."
                        className="w-full pl-14 pr-12 py-4 text-lg text-[#1A1A1A] placeholder-gray-400 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Search Results */}
                  {searchQuery && (
                    <div className="mt-4 max-h-96 overflow-y-auto">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
                          <span className="ml-3 text-gray-600">Searching...</span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductClick(product)}
                              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                            >
                              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={product.image || '/Banner-01.jpg'}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/Banner-01.jpg';
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#1A1A1A] truncate group-hover:text-[#C5A059] transition-colors">
                                  {product.name}
                                </h3>
                                {product.category && (
                                  <p className="text-sm text-gray-500 truncate">{product.category.name}</p>
                                )}
                                <p className="text-lg font-bold text-[#C5A059] mt-1">
                                  Rs. {product.price?.toLocaleString() || '0'}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#C5A059] transition-colors" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No products found</p>
                          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Popular Searches - Category names from API */}
                  {!searchQuery && categories.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-gray-600 mb-3">Popular Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 8).map((cat) => (
                          <button
                            key={cat.id || cat.name}
                            type="button"
                            onClick={() => {
                              setSearchQuery(cat.name);
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gradient-to-r hover:from-[#F5EDD8] hover:to-[#FBF6EC] text-gray-700 hover:text-[#1A1A1A] rounded-full text-sm font-medium transition-all"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery && searchResults.length > 0 && (
                    <button
                      type="submit"
                      className="mt-4 w-full py-3 bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white rounded-xl font-bold hover:from-[#C5A059] hover:to-[#1A1A1A] transition-all shadow-lg hover:shadow-xl"
                    >
                      View All Results
                    </button>
                  )}
                </form>

                  <div className="px-6 pb-4">
                  <p className="text-xs text-gray-400 text-center">
                    Press <kbd className="hidden sm:inline px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">ESC</kbd><span className="sm:hidden">Tap outside</span> to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
