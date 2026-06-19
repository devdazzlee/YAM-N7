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
  const isFull = isSplash || isRoute;

  const message =
    text ??
    (isSplash ? 'Welcome to YAM-N7' : isRoute ? 'Loading...' : 'Please wait...');

  const shellClass = isSplash
    ? 'fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-background'
    : isRoute
      ? 'fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-background/97 backdrop-blur-md'
      : `flex flex-col items-center justify-center py-12 ${className}`;

  return (
    <div className={shellClass} role="status" aria-live="polite" aria-busy="true">
      {isSplash && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,160,89,0.22),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(142,109,49,0.12),transparent_40%)]" />
        </>
      )}

      {isRoute && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(197,160,89,0.08),transparent_60%)]" />
      )}

      {isRoute && typeof progress === 'number' && (
        <div className="absolute inset-x-0 top-0 h-1 bg-primary/10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-dark via-primary to-primary-light"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <div className={`relative ${isRoute ? 'mb-8 sm:mb-10' : 'mb-5'}`}>
          {isFull && (
            <>
              <motion.div
                className={`absolute rounded-full border ${
                  isSplash
                    ? '-inset-4 border-primary/30 sm:-inset-5'
                    : '-inset-6 border-primary/30 sm:-inset-8'
                }`}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className={`absolute rounded-full border ${
                  isSplash
                    ? '-inset-2 border-primary/20 sm:-inset-3'
                    : '-inset-3 border-primary/20 sm:-inset-4'
                }`}
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
            </>
          )}

          <div
            className={`relative flex items-center justify-center rounded-full ${
              isSplash
                ? 'h-24 w-24 bg-gradient-to-br from-surface-elevated to-background shadow-[0_0_40px_rgba(197,160,89,0.25)] sm:h-28 sm:w-28'
                : isRoute
                  ? 'h-28 w-28 bg-gradient-to-br from-surface-muted to-background shadow-[0_12px_48px_rgba(197,160,89,0.25)] sm:h-36 sm:w-36 md:h-40 md:w-40'
                  : 'h-20 w-20 bg-card shadow-md'
            }`}
          >
            {!isFull && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <Image
              src="/YAM-N7-Logo.png"
              alt="YAM-N7"
              width={120}
              height={120}
              priority={isFull}
              className={
                isSplash
                  ? 'h-14 w-14 object-contain sm:h-16 sm:w-16'
                  : isRoute
                    ? 'h-16 w-16 object-contain sm:h-20 sm:w-20 md:h-24 md:w-24'
                    : 'h-12 w-12 object-contain'
              }
            />
          </div>
        </div>

        {isSplash && (
          <>
            <p className="font-heading text-3xl font-semibold tracking-[0.18em] text-foreground sm:text-4xl">
              YAM-N7
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.35em] text-primary/90 sm:text-base">
              Luxury Fragrances
            </p>
          </>
        )}

        {isRoute && pageTitle && (
          <p className="font-heading text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl mb-2">
            {pageTitle}
          </p>
        )}

        <p
          className={`font-medium tracking-wide ${
            isSplash
              ? 'mt-3 text-sm text-muted sm:text-base'
              : isRoute
                ? 'text-base text-muted sm:text-lg md:text-xl'
                : 'mt-3 text-sm text-muted sm:text-base'
          }`}
        >
          {message}
        </p>

        <div
          className={`overflow-hidden rounded-full bg-foreground/10 ${
            isRoute ? 'mt-8 h-[3px] w-48 sm:w-64 md:w-72' : 'mt-6 h-[2px] w-40 sm:w-52'
          }`}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {isSplash && (
        <p className="absolute bottom-8 text-xs tracking-[0.2em] text-muted-subtle">SINCE 2000</p>
      )}
    </div>
  );
}
