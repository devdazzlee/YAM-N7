'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * GlobalScrollReveal
 * ──────────────────────────────────────────────────────────────────────────────
 * Runs on every page. Uses IntersectionObserver to watch elements that carry
 * the CSS class `sr` (scroll-reveal). When the element enters the viewport,
 * the class `sr-visible` is added, triggering the CSS animation defined in
 * globals.css.
 *
 * Elements already visible on first render are immediately marked visible
 * (they skip the animation so above-the-fold content never flickers).
 *
 * Framer-motion components (Reveal / Stagger) already handle their own
 * animations. This system covers non-framer HTML blocks, plain sections,
 * and any raw page content that doesn't use motion wrappers.
 * ──────────────────────────────────────────────────────────────────────────────
 */
export default function GlobalScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to let the page DOM fully render after route change
    const init = () => {
      const elements = document.querySelectorAll<HTMLElement>('.sr');

      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('sr-visible');
              observer.unobserve(entry.target); // fire once only
            }
          });
        },
        {
          rootMargin: '-60px 0px -40px 0px', // trigger slightly before fully in view
          threshold: 0.08,
        }
      );

      elements.forEach((el) => {
        // Elements already in the viewport on page load animate immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('sr-visible');
        } else {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    };

    // 80ms grace period so framer-motion page-enter transition completes first
    const timer = setTimeout(init, 80);
    return () => clearTimeout(timer);
  }, [pathname]); // re-scan on every route change

  return null;
}
