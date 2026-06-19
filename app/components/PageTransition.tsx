'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import BrandLoader from './BrandLoader';
import { getLoadingMessage, getPageTitleFromPath } from '../../lib/utils/pageTitles';

const MIN_ROUTE_LOADER_MS = 700;

function isInternalLink(href: string | null, pathname: string) {
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
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationStartedAt = useRef(0);
  const isNavigatingRef = useRef(false);

  const [showSplash, setShowSplash] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetPath, setTargetPath] = useState(pathname);

  const clearTimers = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (completeTimer.current) clearTimeout(completeTimer.current);
    progressTimer.current = null;
    completeTimer.current = null;
  }, []);

  const startNavigation = useCallback(() => {
    if (isNavigatingRef.current) return;

    clearTimers();
    isNavigatingRef.current = true;
    navigationStartedAt.current = Date.now();
    setIsNavigating(true);
    setProgress(15);

    progressTimer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 8 + 2;
      });
    }, 140);
  }, [clearTimers]);

  const finishNavigation = useCallback(() => {
    const elapsed = Date.now() - navigationStartedAt.current;
    const wait = Math.max(0, MIN_ROUTE_LOADER_MS - elapsed);

    clearTimers();
    setProgress(100);

    completeTimer.current = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
      setProgress(0);
    }, wait + 280);
  }, [clearTimers]);

  // Initial splash on every full page load
  useEffect(() => {
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  // Show loader immediately when internal links are clicked
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor || anchor.target === '_blank') return;
      const href = anchor.getAttribute('href');
      if (!isInternalLink(href, pathname)) return;

      const nextPath = href!.split('?')[0].split('#')[0];
      setTargetPath(nextPath);
      startNavigation();
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, startNavigation]);

  // Finish loader when the route actually changes
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setTargetPath(pathname);

    if (!isNavigatingRef.current) {
      startNavigation();
    }
    finishNavigation();
  }, [pathname, startNavigation, finishNavigation]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLoader variant="splash" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isNavigating && !showSplash && (
          <motion.div
            key="route-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandLoader
              variant="route"
              text={getLoadingMessage(targetPath)}
              pageTitle={getPageTitleFromPath(targetPath)}
              progress={progress}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
