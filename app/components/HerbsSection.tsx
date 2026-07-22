'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';
import { Reveal, ease, viewport } from './motion/reveal';

interface HerbsCategoryLike {
  name: string;
  slug?: string;
}

interface HerbsSectionProps {
  categories: HerbsCategoryLike[];
}

function getFeaturedCategory(categories: HerbsCategoryLike[]): HerbsCategoryLike | null {
  if (!categories || categories.length === 0) return null;

  const preferred = ['perfume', 'perfumes', 'attar', 'attars', 'oud', 'fragrance', 'body mist', 'scent'];
  for (const name of preferred) {
    const found = categories.find((c) => c.name.toLowerCase() === name);
    if (found) return found;
  }
  return categories[0];
}

function getCategorySlug(cat: HerbsCategoryLike): string {
  return cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
}

export default function HerbsSection({ categories }: HerbsSectionProps) {
  const featured = getFeaturedCategory(categories);

  if (!featured) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewport}
      transition={{ duration: 0.6, ease }}
      className="py-10 sm:py-12 md:py-14 page-banner text-foreground relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 1.2, ease }}
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-surface blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 1.2, delay: 0.2, ease }}
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-card blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="fadeScale">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-3"
            >
              <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-primary-light mx-auto" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
              Explore {featured.name}
            </h2>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed max-w-2xl mx-auto mb-5">
              Discover our curated collection of luxury perfumes and attars. From bold oud blends to elegant everyday fragrances, find your signature scent at YAM-N7.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/categories/${getCategorySlug(featured)}`}
                className="inline-flex items-center space-x-2 bg-surface hover:bg-surface-muted text-foreground px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg"
              >
                <span>Explore {featured.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </motion.section>
  );
}
