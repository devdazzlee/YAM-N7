'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import BrandLoader from './BrandLoader';

const SPLASH_MS = 1600;

// Luxury easing curve
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function isNavigableLink(href: string | null, pathname: string) {
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (
    href.startsWith('http') &&
    typeof window !== 'undefined' &&
    !href.includes(window.location.host)
  ) {
    return false;
  }
  const path = href.split('?')[0].split('#')[0];
  return path !== pathname;
}

export default function PageTransition() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  const [showSplash, setShowSplash] = useState(true);
  // exitCurtain: true while we are between "link clicked" and "new page mounted"
  const [exitCurtain, setExitCurtain] = useState(false);
  const curtainTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initial splash screen ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  // ── Show exit curtain when any internal link is clicked ─────────────────
  const handleLinkClick = useCallback(
    (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor || anchor.target === '_blank') return;
      const href = anchor.getAttribute('href');
      if (!isNavigableLink(href, pathname)) return;

      // Fade the current page out before Next.js navigates
      setExitCurtain(true);

      // Safety: drop the curtain after 1.2s in case navigation stalls
      if (curtainTimer.current) clearTimeout(curtainTimer.current);
      curtainTimer.current = setTimeout(() => setExitCurtain(false), 1200);
    },
    [pathname]
  );

  useEffect(() => {
    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [handleLinkClick]);

  // ── Drop curtain when the new page has mounted ───────────────────────────
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // Give the new page template 80ms to start its own fade-in, then lift curtain
    if (curtainTimer.current) clearTimeout(curtainTimer.current);
    curtainTimer.current = setTimeout(() => {
      setExitCurtain(false);
    }, 80);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (curtainTimer.current) clearTimeout(curtainTimer.current);
    };
  }, []);

  return (
    <>
      {/* ── Splash screen (first load only) ── */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: 'fixed', inset: 0, zIndex: 10001 }}
          >
            <BrandLoader variant="splash" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Exit curtain: fades current page out on navigation ── */}
      <AnimatePresence>
        {exitCurtain && !showSplash && (
          <motion.div
            key="exit-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: '#2B0B16',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
