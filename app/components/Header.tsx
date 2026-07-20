'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart, Menu, X, Search, User, ChevronDown,
  ArrowRight, Heart, LogOut, Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { webApi, WebCategory, WebSearchSuggestion } from '../../lib/api/webApi';
import { cartUtils } from '../../lib/utils/cart';
import { getCategoryIcon, getCategoryDescription } from '../../lib/utils/categoryIcons';
import { useWebCategoryStore } from '../../lib/store/webCategoryStore';
import { useAuthStore } from '../../lib/store/authStore';

/* ─── Nav link definitions ───────────────────────────────────────── */
const NAV_LINKS = [
  { name: 'Home',                href: '/' },
  { name: 'Shop',                href: '/shop' },
  { name: 'Collections',         href: '/collections' },
  { name: 'The Identity Series', href: '/identity-series' },
  { name: 'Best Sellers',        href: '/best-sellers' },
  { name: "What's Hot",          href: '/whats-hot' },
  { name: 'Journal',             href: '/journal' },
  { name: 'About',               href: '/about' },
  { name: 'Contact',             href: '/contact' },
];

/* ─── Badge ───────────────────────────────────────────────────────── */
function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      style={{
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        background: '#E8B4A0',
        color: '#2B0B16',
        fontSize: '10px',
        fontWeight: 700,
        borderRadius: '9999px',
        minWidth: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
        fontFamily: 'var(--font-body)',
        lineHeight: 1,
      }}
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}

/* ─── Icon button ─────────────────────────────────────────────────── */
function IconBtn({
  onClick, href, label, children, count, dark,
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  children: React.ReactNode;
  count?: number;
  dark?: boolean;
}) {
  const base = dark ? '#FFF8F6' : '#FFFFFF';
  const inner = (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      aria-label={label}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: base,
        transition: 'color 0.25s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E8B4A0'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = base; }}
    >
      {children}
      {count !== undefined && <Badge count={count} />}
    </motion.button>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

/* ══════════════════════════════════════════════════════════════════ */
export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();

  const [isMenuOpen,       setIsMenuOpen]       = useState(false);
  const [isShopOpen,       setIsShopOpen]       = useState(false);
  const [wishlistCount,    setWishlistCount]    = useState(0);
  const [cartCount,        setCartCount]        = useState(0);
  const [isSearchOpen,     setIsSearchOpen]     = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [searchResults,    setSearchResults]    = useState<WebSearchSuggestion[]>([]);
  const [isSearching,      setIsSearching]      = useState(false);
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [categories,       setCategories]       = useState<Array<WebCategory & { icon: any; description: string }>>([]);
  const [categoriesLoading,setCategoriesLoading]= useState(true);
  const [isProfileOpen,    setIsProfileOpen]    = useState(false);
  const [isMobileShopExpanded, setIsMobileShopExpanded] = useState(false);
  const [isMobileCollectionsExpanded, setIsMobileCollectionsExpanded] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  const fetchAllCategories = useWebCategoryStore((s) => s.fetchAll);
  const { isAuthenticated, user, logout, fetchCurrentUser } = useAuthStore();

  /* ── Auth init ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tok = localStorage.getItem('authToken');
    if (tok && !isAuthenticated && !user) {
      fetchCurrentUser().catch(() => localStorage.removeItem('authToken'));
    }
  }, [fetchCurrentUser, isAuthenticated, user]);

  /* ── Categories ── */
  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    fetchAllCategories()
      .then((apiCats) => {
        if (cancelled) return;
        setCategories(
          apiCats.filter((c) => c.is_active).map((c) => ({
            ...c,
            icon: getCategoryIcon(c.slug, c.name),
            description: getCategoryDescription(c.name),
          }))
        );
      })
      .catch(() => { if (!cancelled) setCategories([]); })
      .finally(() => { if (!cancelled) setCategoriesLoading(false); });
    return () => { cancelled = true; };
  }, [fetchAllCategories]);

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Wishlist ── */
  useEffect(() => {
    const update = () => {
      if (typeof window === 'undefined') return;
      setWishlistCount(JSON.parse(localStorage.getItem('wishlist') || '[]').length);
    };
    update();
    window.addEventListener('wishlistUpdated', update);
    return () => window.removeEventListener('wishlistUpdated', update);
  }, []);

  /* ── Cart ── */
  useEffect(() => {
    const update = () => setCartCount(cartUtils.getCartCount());
    update();
    window.addEventListener('cartUpdated', update);
    return () => window.removeEventListener('cartUpdated', update);
  }, []);

  /* ── Search typeahead ── */
  useEffect(() => {
    if (!isSearchOpen) return;
    const q = searchQuery.trim();
    if (q.length < 2) { setSearchResults([]); setIsSearching(false); return; }
    let cancelled = false;
    setIsSearching(true);
    const t = setTimeout(() => {
      webApi.suggest(q, 8)
        .then((r) => { if (!cancelled) setSearchResults(r); })
        .catch(() => { if (!cancelled) setSearchResults([]); })
        .finally(() => { if (!cancelled) setIsSearching(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [searchQuery, isSearchOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeSearch(); setIsMenuOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── Body lock when search or menu open ── */
  useEffect(() => {
    document.body.style.overflow = (isSearchOpen || isMenuOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen, isMenuOpen]);

  /* ── Close mobile menu on route change ── */
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsMobileShopExpanded(false);
    setIsMobileCollectionsExpanded(false);
  }, [pathname]);

  /* ── Reset mobile sub-menus when menu closes ── */
  useEffect(() => {
    if (!isMenuOpen) {
      setIsMobileShopExpanded(false);
      setIsMobileCollectionsExpanded(false);
    }
  }, [isMenuOpen]);

  /* ── Helpers ── */
  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); };

  const performSearch = (q: string) => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    closeSearch();
  };

  const isActive = (href: string) => pathname === href;

  /* ════════════════ RENDER ════════════════════════════════════════ */
  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: isScrolled ? '0' : '36px',          /* sits right below the 36px announcement bar when at top */
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'top 0.35s ease, background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
          background: isScrolled
            ? 'rgba(43,11,22,0.88)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(18px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(18px) saturate(180%)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(232,180,160,0.2)'
            : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 24px rgba(255,248,246,0.06)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'height 0.35s ease, padding 0.35s ease',
          }}
          className={`px-4 sm:px-6 lg:px-8 ${
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-[72px]'
          }`}
        >
          {/* ── LEFT: Logo ─────────────────────────────────────── */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <motion.img
              whileHover={{ scale: 1.04 }}
              src="/YAM-N7-Logo.png"
              alt="YAM-N7"
              className={isScrolled ? 'h-9 sm:h-11' : 'h-10 sm:h-[52px]'}
              style={{
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.35s ease',
              }}
            />
          </Link>

          {/* ── CENTER: Desktop Nav — hidden on mobile, shown lg+ ── */}
          <nav
            className="luxury-nav hidden lg:flex items-center"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: '0px',
            }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);

              /* Shop gets a mega-dropdown */
              if (link.name === 'Shop') {
                return (
                  <div
                    key={link.name}
                    ref={shopRef}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setIsShopOpen(true)}
                    onMouseLeave={() => setIsShopOpen(false)}
                  >
                    <NavLink active={active} href={link.href} hasArrow dark={isScrolled}>
                      {link.name}
                    </NavLink>

                    <AnimatePresence>
                      {isShopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.22 }}
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '420px',
                            background: 'rgba(53,15,28,0.98)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(232,180,160,0.2)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            zIndex: 100,
                            boxShadow: '0 20px 48px rgba(255,248,246,0.14)',
                          }}
                        >
                          {/* Dropdown header */}
                          <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(232,180,160,0.15)',
                          }}>
                            <p style={{
                              fontFamily: 'var(--font-display), "Playfair Display", serif',
                              fontSize: '11px',
                              letterSpacing: '0.2em',
                              color: '#E8B4A0',
                              textTransform: 'uppercase',
                            }}>Shop by Category</p>
                          </div>

                          {/* Category list */}
                          <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
                            {categoriesLoading ? (
                              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
                                <div style={{
                                  width: '20px', height: '20px',
                                  border: '2px solid #E8B4A0',
                                  borderTopColor: 'transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                }} />
                              </div>
                            ) : categories.length > 0 ? categories.map((cat, i) => {
                              const Icon = cat.icon;
                              return (
                                <Link
                                  key={cat.id || cat.slug}
                                  href={`/categories/${cat.slug}`}
                                  onClick={() => setIsShopOpen(false)}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.025 }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '10px 12px',
                                      borderRadius: '2px',
                                      cursor: 'pointer',
                                      transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      (e.currentTarget as HTMLElement).style.background = 'rgba(232,180,160,0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                                    }}
                                  >
                                    <Icon style={{ width: '16px', height: '16px', color: '#E8B4A0', flexShrink: 0 }} strokeWidth={1.5} />
                                    <div>
                                      <p style={{
                                        fontFamily: 'var(--font-body), Poppins, sans-serif',
                                        fontSize: '13px',
                                        color: '#FFF8F6',
                                        fontWeight: 500,
                                        margin: 0,
                                      }}>{cat.name}</p>
                                      <p style={{
                                        fontFamily: 'var(--font-body), Poppins, sans-serif',
                                        fontSize: '11px',
                                        color: 'rgba(255,248,246,0.5)',
                                        margin: 0,
                                        marginTop: '2px',
                                      }}>{cat.description}</p>
                                    </div>
                                    <ArrowRight style={{ width: '14px', height: '14px', color: 'rgba(232,180,160,0.5)', marginLeft: 'auto' }} />
                                  </motion.div>
                                </Link>
                              );
                            }) : (
                              <p style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,248,246,0.45)', fontSize: '13px' }}>
                                No categories available
                              </p>
                            )}
                          </div>

                          {/* View all */}
                          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(232,180,160,0.15)' }}>
                            <Link
                              href="/shop"
                              onClick={() => setIsShopOpen(false)}
                              style={{
                                display: 'block',
                                textAlign: 'center',
                                fontFamily: 'var(--font-body), Poppins, sans-serif',
                                fontSize: '11px',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: '#E8B4A0',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#F5D6CE'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#E8B4A0'; }}
                            >
                              View All Products →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <NavLink key={link.name} active={active} href={link.href} dark={isScrolled}>
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* ── RIGHT: Icons ───────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>

            {/* Search — hidden on mobile (available in drawer) */}
            <span className="hidden sm:inline-flex">
              <IconBtn label="Search" onClick={() => setIsSearchOpen(true)} dark={isScrolled}>
                <Search size={18} strokeWidth={1.5} />
              </IconBtn>
            </span>

            {/* Account — hidden on mobile (available in drawer) */}
            <span className="hidden sm:inline-flex" style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <IconBtn label="Profile" onClick={() => setIsProfileOpen(!isProfileOpen)} dark={isScrolled}>
                  <User size={18} strokeWidth={1.5} />
                </IconBtn>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: '220px',
                        background: 'rgba(53,15,28,0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(232,180,160,0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        zIndex: 100,
                        boxShadow: '0 20px 48px rgba(255,248,246,0.14)',
                      }}
                    >
                      <div style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid rgba(232,180,160,0.15)',
                      }}>
                        <p style={{ fontSize: '12px', color: '#E8B4A0', fontFamily: 'var(--font-body)', margin: 0 }}>
                          {user?.email}
                        </p>
                        {user?.name && (
                          <p style={{ fontSize: '11px', color: 'rgba(255,248,246,0.55)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>
                            {user.name}
                          </p>
                        )}
                      </div>
                      <div style={{ padding: '6px' }}>
                        {[
                          { href: '/account/profile', label: 'My Profile', icon: User },
                          { href: '/account/orders',  label: 'My Orders',  icon: Package },
                        ].map(({ href, label, icon: Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setIsProfileOpen(false)}
                            style={{ textDecoration: 'none' }}
                          >
                            <div
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '9px 10px', borderRadius: '2px',
                                transition: 'background 0.2s',
                                cursor: 'pointer',
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,180,160,0.08)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                              <Icon size={14} style={{ color: '#E8B4A0' }} strokeWidth={1.5} />
                              <span style={{ fontSize: '12px', color: '#FFF8F6', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>
                                {label}
                              </span>
                            </div>
                          </Link>
                        ))}
                        <button
                          onClick={async () => {
                            await logout();
                            setIsProfileOpen(false);
                            router.push('/');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '9px 10px', borderRadius: '2px',
                            background: 'transparent', border: 'none',
                            cursor: 'pointer', width: '100%',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,180,160,0.08)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <LogOut size={14} style={{ color: '#E8B4A0' }} strokeWidth={1.5} />
                          <span style={{ fontSize: '12px', color: '#FFF8F6', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>
                            Logout
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <IconBtn label="Account" href="/login" dark={isScrolled}>
                <User size={18} strokeWidth={1.5} />
              </IconBtn>
            )}
            </span>

            {/* Wishlist — hidden on mobile */}
            <span className="hidden sm:inline-flex">
              <IconBtn label="Wishlist" href="/wishlist" count={wishlistCount} dark={isScrolled}>
                <Heart size={18} strokeWidth={1.5} />
              </IconBtn>
            </span>

            {/* Cart */}
            <IconBtn label="Cart" href="/cart" count={cartCount} dark={isScrolled}>
              <ShoppingCart size={18} strokeWidth={1.5} />
            </IconBtn>

            {/* Search — mobile only shortcut */}
            <span className="inline-flex sm:hidden">
              <IconBtn label="Search" onClick={() => setIsSearchOpen(true)} dark={isScrolled}>
                <Search size={18} strokeWidth={1.5} />
              </IconBtn>
            </span>

            {/* Mobile hamburger — only on < lg */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="flex lg:hidden items-center justify-center ml-1"
              style={{
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isScrolled ? '#FFF8F6' : '#FFFFFF',
                flexShrink: 0,
              }}
            >
              {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 98,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(85vw, 360px)',
                background: '#2B0B16',
                borderLeft: '1px solid rgba(232,180,160,0.2)',
                zIndex: 99,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                boxShadow: '-16px 0 40px rgba(255,248,246,0.12)',
              }}
            >
              {/* Drawer header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '1px solid rgba(232,180,160,0.15)',
                flexShrink: 0,
              }}>
                {/* Logo in drawer */}
                <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none' }}>
                  <img
                    src="/YAM-N7-Logo.png"
                    alt="YAM-N7"
                    style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                  />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'rgba(255,248,246,0.05)', border: '1px solid rgba(232,180,160,0.2)',
                    cursor: 'pointer', color: '#FFF8F6', padding: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile search */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(232,180,160,0.12)' }}>
                <form
                  onSubmit={(e) => { e.preventDefault(); performSearch(searchQuery); setIsMenuOpen(false); }}
                  style={{ position: 'relative' }}
                >
                  <Search
                    size={15}
                    style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(232,180,160,0.7)',
                    }}
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fragrances…"
                    style={{
                      width: '100%',
                      background: '#35111F',
                      border: '1px solid rgba(232,180,160,0.2)',
                      borderRadius: '2px',
                      padding: '10px 12px 10px 36px',
                      color: '#FFF8F6',
                      fontFamily: 'var(--font-body), Poppins, sans-serif',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </form>
              </div>

              {/* Nav links */}
              <nav style={{ padding: '4px 0', flex: 1, overflowY: 'auto' }}>
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link.href);
                  const isShop = link.name === 'Shop';
                  const isCollections = link.name === 'Collections';
                  const hasDropdown = isShop || isCollections;

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {hasDropdown ? (
                        <>
                          <div
                            onClick={() => {
                              if (isShop) setIsMobileShopExpanded(!isMobileShopExpanded);
                              if (isCollections) setIsMobileCollectionsExpanded(!isMobileCollectionsExpanded);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '14px 24px',
                              fontFamily: 'var(--font-body), Poppins, sans-serif',
                              fontSize: '13px',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: (isShop && isMobileShopExpanded) || (isCollections && isMobileCollectionsExpanded) ? '#E8B4A0' : 'rgba(255,248,246,0.78)',
                              borderBottom: '1px solid rgba(255,248,246,0.05)',
                              cursor: 'pointer',
                              background: active ? 'rgba(232,180,160,0.06)' : 'transparent',
                              borderLeft: active ? '2px solid #E8B4A0' : '2px solid transparent',
                              transition: 'all 0.2s',
                            }}
                          >
                            <span>{link.name}</span>
                            <ChevronDown
                              size={15}
                              style={{
                                color: '#E8B4A0',
                                transform: (isShop && isMobileShopExpanded) || (isCollections && isMobileCollectionsExpanded) ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.25s ease',
                              }}
                              strokeWidth={1.5}
                            />
                          </div>
                          <AnimatePresence>
                            {((isShop && isMobileShopExpanded) || (isCollections && isMobileCollectionsExpanded)) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                style={{
                                  overflow: 'hidden',
                                  background: 'rgba(255,248,246,0.02)',
                                  borderBottom: '1px solid rgba(232,180,160,0.1)',
                                }}
                              >
                                <div style={{ padding: '8px 0 8px 12px' }}>
                                  {categoriesLoading ? (
                                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                                      <div style={{
                                        width: '16px', height: '16px',
                                        border: '2px solid #E8B4A0',
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                      }} />
                                    </div>
                                  ) : categories.length > 0 ? (
                                    <>
                                      {categories.map((cat) => (
                                        <Link
                                          key={cat.id || cat.slug}
                                          href={`/categories/${cat.slug}`}
                                          onClick={() => setIsMenuOpen(false)}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 24px',
                                            fontFamily: 'var(--font-body), Poppins, sans-serif',
                                            fontSize: '12px',
                                            color: 'rgba(255,248,246,0.65)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                          }}
                                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E8B4A0'; }}
                                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,248,246,0.65)'; }}
                                        >
                                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(232,180,160,0.5)' }} />
                                          <span>{cat.name}</span>
                                        </Link>
                                      ))}
                                      <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '10px',
                                          padding: '12px 24px',
                                          fontFamily: 'var(--font-body), Poppins, sans-serif',
                                          fontSize: '11px',
                                          fontWeight: 600,
                                          letterSpacing: '0.08em',
                                          color: '#E8B4A0',
                                          textDecoration: 'none',
                                          borderTop: '1px solid rgba(255,248,246,0.04)',
                                          marginTop: '4px',
                                        }}
                                      >
                                        <span>Browse All {link.name} →</span>
                                      </Link>
                                    </>
                                  ) : (
                                    <p style={{ padding: '12px 24px', color: 'rgba(255,248,246,0.4)', fontSize: '12px', margin: 0 }}>
                                      No categories available
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 24px',
                            fontFamily: 'var(--font-body), Poppins, sans-serif',
                            fontSize: '13px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: active ? '#E8B4A0' : 'rgba(255,248,246,0.78)',
                            textDecoration: 'none',
                            borderBottom: '1px solid rgba(255,248,246,0.05)',
                            background: active ? 'rgba(232,180,160,0.06)' : 'transparent',
                            borderLeft: active ? '2px solid #E8B4A0' : '2px solid transparent',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span>{link.name}</span>
                          {active && (
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8B4A0', flexShrink: 0 }} />
                          )}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              {/* Quick-access tiles: Cart, Wishlist, Account */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                padding: '16px 20px',
                borderTop: '1px solid rgba(232,180,160,0.12)',
                flexShrink: 0,
              }}>
                {[
                  { href: '/cart',     icon: ShoppingCart, label: 'Cart',     badge: cartCount },
                  { href: '/wishlist', icon: Heart,        label: 'Wishlist',  badge: wishlistCount },
                  { href: isAuthenticated ? '/account/profile' : '/login', icon: User, label: isAuthenticated ? 'Account' : 'Login', badge: 0 },
                ].map(({ href, icon: Icon, label, badge }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      padding: '12px 8px',
                      background: '#35111F',
                      border: '1px solid rgba(232,180,160,0.18)',
                      textDecoration: 'none',
                      position: 'relative',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} style={{ color: '#E8B4A0' }} />
                    <span style={{ fontSize: '10px', color: 'rgba(255,248,246,0.65)', fontFamily: 'var(--font-body)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {label}
                    </span>
                    {badge > 0 && (
                      <span style={{
                        position: 'absolute', top: '6px', right: '6px',
                        background: '#E8B4A0', color: '#2B0B16',
                        fontSize: '9px', fontWeight: 700, borderRadius: '9999px',
                        minWidth: '16px', height: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px',
                      }}>{badge > 9 ? '9+' : badge}</span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Auth footer */}
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid rgba(232,180,160,0.15)',
              }}>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(232,180,160,0.85)', fontFamily: 'var(--font-body)', letterSpacing: '0.08em', margin: 0 }}>
                      {user?.email}
                    </p>
                    <button
                      onClick={async () => { await logout(); setIsMenuOpen(false); router.push('/'); }}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(232,180,160,0.3)',
                        borderRadius: '2px',
                        padding: '10px 16px',
                        color: '#E8B4A0',
                        fontFamily: 'var(--font-body), Poppins, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px',
                      border: '1px solid rgba(232,180,160,0.4)',
                      borderRadius: '2px',
                      color: '#E8B4A0',
                      fontFamily: 'var(--font-body), Poppins, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'all 0.25s',
                    }}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SEARCH MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeSearch}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,   scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 201,
                width: 'min(640px, calc(100vw - 32px))',
                background: 'rgba(53,15,28,0.98)',
                border: '1px solid rgba(232,180,160,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(255,248,246,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(232,180,160,0.15)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display), "Playfair Display", serif',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: '#E8B4A0',
                  textTransform: 'uppercase',
                  margin: 0,
                }}>Search</p>
                <button
                  onClick={closeSearch}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,248,246,0.5)', padding: '2px' }}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); performSearch(searchQuery); }}
                style={{ padding: '20px' }}
              >
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(232,180,160,0.7)',
                    }}
                    strokeWidth={1.5}
                  />
                  <input
                    id="header-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for fragrances, attars, oud…"
                    autoFocus
                    style={{
                      width: '100%',
                      background: '#2B0B16',
                      border: '1px solid rgba(232,180,160,0.25)',
                      borderRadius: '2px',
                      padding: '14px 40px 14px 44px',
                      color: '#FFF8F6',
                      fontFamily: 'var(--font-body), Poppins, sans-serif',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      letterSpacing: '0.02em',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                      style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none',
                        cursor: 'pointer', color: 'rgba(255,248,246,0.4)',
                        padding: '2px',
                      }}
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                  {searchQuery && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ marginTop: '12px', maxHeight: '340px', overflowY: 'auto' }}
                    >
                      {isSearching ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px', justifyContent: 'center' }}>
                          <div style={{
                            width: '18px', height: '18px',
                            border: '2px solid #E8B4A0',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }} />
                          <span style={{ color: 'rgba(255,248,246,0.45)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
                            Searching…
                          </span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div>
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => {
                                router.push(`/products/${product.id}`);
                                closeSearch();
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                width: '100%',
                                padding: '10px 4px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,248,246,0.06)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,180,160,0.07)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                              <div style={{
                                width: '52px', height: '52px',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: 'rgba(255,248,246,0.06)',
                              }}>
                                <img
                                  src={product.image || '/Banner-01.jpg'}
                                  alt={product.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/Banner-01.jpg'; }}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                  margin: 0,
                                  fontFamily: 'var(--font-body), Poppins, sans-serif',
                                  fontSize: '13px',
                                  color: '#FFF8F6',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>{product.name}</p>
                                {product.category && (
                                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,248,246,0.45)', fontFamily: 'var(--font-body)' }}>
                                    {product.category.name}
                                  </p>
                                )}
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E8B4A0', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                                  Rs. {product.price?.toLocaleString() || '0'}
                                </p>
                              </div>
                              <ArrowRight size={14} style={{ color: 'rgba(232,180,160,0.5)', flexShrink: 0 }} />
                            </button>
                          ))}

                          <button
                            type="submit"
                            style={{
                              marginTop: '12px',
                              width: '100%',
                              padding: '12px',
                              background: 'transparent',
                              border: '1px solid rgba(232,180,160,0.35)',
                              borderRadius: '2px',
                              color: '#E8B4A0',
                              fontFamily: 'var(--font-body), Poppins, sans-serif',
                              fontSize: '11px',
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(232,180,160,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'transparent';
                            }}
                          >
                            View All Results
                          </button>
                        </div>
                      ) : (
                        <p style={{
                          textAlign: 'center', padding: '24px',
                          color: 'rgba(255,248,246,0.4)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                        }}>
                          No products found for "{searchQuery}"
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Popular searches */}
                  {!searchQuery && categories.length > 0 && (
                    <motion.div
                      key="popular"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ marginTop: '16px' }}
                    >
                      <p style={{
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                        color: 'rgba(232,180,160,0.75)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)',
                        margin: '0 0 10px',
                      }}>Popular Searches</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {categories.slice(0, 8).map((cat) => (
                          <button
                            key={cat.id || cat.name}
                            type="button"
                            onClick={() => setSearchQuery(cat.name)}
                            style={{
                              padding: '6px 14px',
                              background: 'rgba(232,180,160,0.08)',
                              border: '1px solid rgba(232,180,160,0.2)',
                              borderRadius: '2px',
                              color: 'rgba(255,248,246,0.7)',
                              fontFamily: 'var(--font-body), Poppins, sans-serif',
                              fontSize: '11px',
                              letterSpacing: '0.06em',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(232,180,160,0.15)';
                              el.style.color = '#E8B4A0';
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(232,180,160,0.08)';
                              el.style.color = 'rgba(255,248,246,0.7)';
                            }}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <p style={{
                textAlign: 'center',
                padding: '0 20px 14px',
                fontSize: '10px',
                color: 'rgba(255,248,246,0.3)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.08em',
              }}>
                Press ESC to close
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spin keyframe */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

/* ─── NavLink sub-component ──────────────────────────────────────── */
function NavLink({
  href, active, children, hasArrow, dark,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  hasArrow?: boolean;
  dark?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const base = dark ? 'rgba(255,248,246,0.78)' : 'rgba(255,255,255,0.85)';

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        fontFamily: 'var(--font-body), Poppins, sans-serif',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: active || hovered ? '#E8B4A0' : base,
        transition: 'color 0.25s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      {hasArrow && (
        <ChevronDown
          size={11}
          strokeWidth={1.5}
          style={{ transition: 'transform 0.25s', opacity: 0.7 }}
        />
      )}

      {/* Active / hover underline */}
      <span
        style={{
          position: 'absolute',
          bottom: '2px',
          left: '12px',
          right: '12px',
          height: '1px',
          background: '#E8B4A0',
          transform: active || hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease',
        }}
      />
    </Link>
  );
}
