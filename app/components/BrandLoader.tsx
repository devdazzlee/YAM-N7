'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type BrandLoaderVariant = 'splash' | 'route' | 'inline';

interface BrandLoaderProps {
  variant?: BrandLoaderVariant;
  text?: string;
  pageTitle?: string;
  progress?: number;
  className?: string;
}

export default function BrandLoader({
  variant = 'inline',
  text,
  pageTitle,
  progress,
  className = '',
}: BrandLoaderProps) {
  const isSplash = variant === 'splash';
  const isRoute = variant === 'route';

  if (isRoute && typeof progress === 'number') {
    return (
      <div
        className="fixed inset-x-0 top-0 z-[9998] h-[3px] bg-border"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={pageTitle ? `Loading ${pageTitle}` : 'Loading page'}
      >
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </div>
    );
  }

  if (isRoute) {
    return null;
  }

  if (isSplash) {
    return (
      <div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="logo-pedestal px-3 py-2"
        >
          <Image
            src="/YAM-N7-Logo.png"
            alt="YAM-N7"
            width={280}
            height={100}
            priority
            className="h-20 sm:h-24 md:h-28 w-auto object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-10 h-px w-36 bg-border overflow-hidden"
        >
          <motion.div
            className="h-full bg-primary origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="logo-pedestal px-2 py-1.5 mb-4">
        <Image
          src="/YAM-N7-Logo.png"
          alt="YAM-N7"
          width={120}
          height={48}
          className="h-10 w-auto object-contain"
        />
      </div>
      <p className="text-sm text-muted">{text ?? 'Please wait…'}</p>
    </div>
  );
}
