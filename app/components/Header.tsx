'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Search, User, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { webApi, WebCategory, WebSearchSuggestion } from '../../lib/api/webApi';
import { cartUtils } from '../../lib/utils/cart';
import { getCategoryIcon, getCategoryDescription } from '../../lib/utils/categoryIcons';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { useAuthStore } from '../../lib/store/authStore';

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
            icon: getCategoryIcon(cat.slug, cat.name),
            description: getCategoryDescription(cat.name),
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

  // Compact sticky header on scroll — top bar slides away, main bar stays pinned
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <header className="sticky top-0 z-50">
        {/* Main navigation — always sticky, compacts on scroll */}
        <div
          className={`relative border-b border-border transition-[background-color,box-shadow,padding] duration-300 ease-out ${
            isScrolled
              ? 'bg-surface/95 backdrop-blur-md shadow-[0_2px_16px_rgba(31,27,23,0.06)]'
              : 'bg-surface shadow-sm'
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-60'
            }`}
          />
          <div className="container mx-auto px-4 sm:px-6">
            <div
              className={`flex items-center justify-between transition-[height] duration-300 ease-out ${
                isScrolled ? 'h-[4.25rem]' : 'h-16 md:h-20'
              }`}
            >
          {/* Logo — white pedestal so black+gold PNG is always visible */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="logo-pedestal px-2 py-1"
            >
              <img
                src="/YAM-N7-Logo.png"
                alt="YAM-N7"
                className={`w-auto object-contain transition-[height] duration-300 ease-out ${
                  isScrolled
                    ? 'h-9 sm:h-10 md:h-11'
                    : 'h-12 sm:h-14 md:h-16'
                }`}
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
                            ? 'text-primary bg-primary/10'
                            : 'text-foreground hover:text-primary hover:bg-surface-muted'
                        }`}
                    >
                      {item.name}
                        {isActive(item.href) && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
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
                            ? 'text-primary bg-primary/10'
                            : 'text-foreground hover:text-primary hover:bg-surface-muted'
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
                              className="absolute top-full left-0 mt-2 w-96 bg-card rounded-xl shadow-luxury overflow-hidden border border-border"
                            >
                              <div className="px-5 py-4 bg-primary">
                                <h3 className="text-primary-foreground font-heading text-xl font-medium">Shop by Category</h3>
                                <p className="text-primary-foreground/80 text-sm mt-0.5">Browse our premium collection</p>
                            </div>
                              <div className="max-h-96 overflow-y-auto p-2">
                                {categoriesLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-muted transition-all group cursor-pointer"
                                    >
                                          <div className="luxury-icon-box-sm flex-shrink-0 group-hover:border-primary/40 transition-colors">
                                            <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                                      </div>
                                      <div className="flex-1">
                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                                          {category.name}
                                        </h4>
                                            <p className="text-sm text-muted mt-0.5">{category.description}</p>
                                      </div>
                                          <ChevronDown className="w-5 h-5 text-muted-subtle rotate-[-90deg] group-hover:text-primary transition-colors" />
                                    </motion.div>
                                  </Link>
                                );
                                  })
                                ) : (
                                  <div className="text-center py-8 text-muted">
                                    <p>No categories available</p>
                                  </div>
                                )}
                            </div>
                              <div className="p-4 bg-gradient-to-r from-surface-muted to-surface border-t border-border">
                              <Link
                                href="/shop"
                                  className="block text-center text-primary hover:text-foreground font-bold text-sm transition-colors py-2"
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
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-surface-muted'
                    }`}
                >
                  {item.name}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
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
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 group"
              aria-label="Search"
            >
                <Search className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                <span className="text-sm font-medium text-muted group-hover:text-foreground hidden lg:block">Search</span>
            </motion.button>
            
              {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-surface-elevated text-foreground rounded-full transition-all duration-300 hover:shadow-lg group"
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
                      className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-2xl overflow-hidden border border-border z-50"
                    >
                      <div className="p-4 bg-gradient-to-r from-primary to-surface-elevated text-foreground">
                        <p className="font-semibold truncate">{user?.email}</p>
                        {user?.name && (
                          <p className="text-sm text-foreground/90 truncate">{user.name}</p>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-foreground hover:bg-surface-muted transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-foreground hover:bg-surface-muted transition-colors"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            setIsProfileMenuOpen(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-destructive/10 transition-colors"
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
                  className="hidden md:flex items-center justify-center w-10 h-10 bg-surface-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 group"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                </motion.button>
              </Link>
            )}

              {/* Wishlist */}
            <Link href="/wishlist">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center w-10 h-10 bg-surface-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 group"
                aria-label="Wishlist"
              >
                  <Heart className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-dark to-primary-dark text-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
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
                  className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-surface-elevated text-foreground rounded-full transition-all duration-300 hover:shadow-lg group"
                aria-label="Shopping Cart"
              >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-dark to-primary-dark text-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
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
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-surface-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300"
              aria-label="Search"
            >
                <Search className="w-5 h-5 text-muted" />
            </motion.button>

              {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-surface-muted hover:bg-subtle-strong rounded-full transition-all duration-300"
              aria-label="Menu"
            >
                {isMenuOpen ? <X className="w-5 h-5 text-foreground/90" /> : <Menu className="w-5 h-5 text-foreground/90" />}
            </button>
          </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu — inside sticky header so it stays attached */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t border-border bg-card shadow-lg"
            >
              <nav className="container mx-auto px-4 py-6 space-y-1">
              {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="pb-4 mb-4 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-subtle" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-muted border border-border rounded-full text-foreground placeholder-muted-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                              ? 'text-primary bg-primary/10'
                              : 'text-foreground hover:bg-surface-muted'
                          }`}
                      >
                        {item.name}
                      </Link>
                        <div className="pl-4 mt-1">
                        <button
                          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-surface-muted transition-colors"
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
                                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                                      className="flex items-center gap-3 px-4 py-2.5 text-foreground/90 hover:text-primary hover:bg-surface-muted rounded-lg transition-colors"
                                  >
                                      <span className="luxury-icon-box w-8 h-8 flex-shrink-0">
                                        <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                                      </span>
                                      <span className="font-medium">{category.name}</span>
                                  </Link>
                                );
                                })
                              ) : (
                                <div className="text-center py-4 text-muted text-sm">
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
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground hover:bg-surface-muted'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

                <div className="pt-4 mt-4 border-t border-border space-y-1">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-surface-muted transition-colors"
                >
                  Login / Register
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
        </AnimatePresence>
      </header>

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
                  className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto my-4"
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-foreground">Search Products</h2>
                  <button
                    onClick={closeSearchModal}
                    className="p-2 hover:bg-subtle-strong rounded-full transition-colors"
                    aria-label="Close search"
                  >
                      <X className="w-6 h-6 text-muted" />
                  </button>
                </div>

                  <form onSubmit={handleSearchSubmit} className="p-6">
                  <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-subtle" />
                    <input
                      id="header-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, categories, or brands..."
                        className="w-full pl-14 pr-12 py-4 text-lg text-foreground placeholder-muted-subtle border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-subtle-strong rounded-full transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-5 h-5 text-muted-subtle hover:text-muted" />
                      </button>
                    )}
                  </div>

                  {/* Search Results */}
                  {searchQuery && (
                    <div className="mt-4 max-h-96 overflow-y-auto">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-3 text-muted">Searching...</span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductClick(product)}
                              className="w-full flex items-center gap-4 p-3 hover:bg-surface-muted rounded-lg transition-colors text-left group"
                            >
                              <div className="flex-shrink-0 w-16 h-16 bg-subtle-strong rounded-lg overflow-hidden">
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
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                                {product.category && (
                                  <p className="text-sm text-muted truncate">{product.category.name}</p>
                                )}
                                <p className="text-lg font-bold text-primary mt-1">
                                  Rs. {product.price?.toLocaleString() || '0'}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <ArrowRight className="w-5 h-5 text-muted-subtle group-hover:text-primary transition-colors" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted">No products found</p>
                          <p className="text-sm text-muted-subtle mt-1">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Popular Searches - Category names from API */}
                  {!searchQuery && categories.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-muted mb-3">Popular Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 8).map((cat) => (
                          <button
                            key={cat.id || cat.name}
                            type="button"
                            onClick={() => {
                              setSearchQuery(cat.name);
                            }}
                            className="px-4 py-2 bg-subtle-strong hover:bg-gradient-to-r hover:from-surface hover:to-surface-muted text-foreground/90 hover:text-foreground rounded-full text-sm font-medium transition-all"
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
                      className="mt-4 w-full py-3 bg-gradient-to-r from-surface-elevated to-primary text-foreground rounded-xl font-bold hover:from-primary hover:to-surface-elevated transition-all shadow-lg hover:shadow-xl"
                    >
                      View All Results
                    </button>
                  )}
                </form>

                  <div className="px-6 pb-4">
                  <p className="text-xs text-muted-subtle text-center">
                    Press <kbd className="hidden sm:inline px-2 py-1 bg-subtle-strong rounded text-muted font-mono">ESC</kbd><span className="sm:hidden">Tap outside</span> to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
