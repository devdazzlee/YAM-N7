'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Flags the home route on <html> so globals.css can scope the site's
 * "luxury" micro-interactions (smooth scroll, button glow, underline/focus
 * styles) away from the Fizzi-sourced home page, which brings its own look
 * and feel and shouldn't inherit them.
 */
export default function RouteThemeFlag() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle('is-home', pathname === '/');
  }, [pathname]);

  return null;
}
